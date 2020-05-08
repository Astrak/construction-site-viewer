import {
    Group,
    Mesh,
    MeshLambertMaterial,
    LinearFilter,
    MeshBasicMaterial,
    MeshPhongMaterial,
    ShaderMaterial,
    DoubleSide,
    FrontSide,
    TextureLoader,
    RepeatWrapping,
    PlaneBufferGeometry,
} from "three";
import PLYLoader from "./../lib/PLYLoaderr89.js";
import Water from "./../lib/Waterr89";

import EventEmitter from "events";

import ASSETS from "./../constants/assets";
import SEASONS from "./../constants/seasons";

export default class Loader extends EventEmitter {
    constructor(
        renderer,
        camera,
        rootObject,
        objectsList,
        tweenedColorObjects
    ) {
        super();

        this.loader = new PLYLoader();
        this.tLoader = new TextureLoader();

        this.renderer = renderer;
        this.camera = camera;
        this.rootObject = rootObject;
        this.objectsList = objectsList;
        this.tweenedColorObjects = tweenedColorObjects;
    }

    start() {
        this.loadTextures();
    }

    addWater() {
        const water = new Water(new PlaneBufferGeometry(5.5, 19), {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: this.tLoader.load(
                "public/img/waternormals.jpg",
                (t) => (t.wrapS = t.wrapT = RepeatWrapping)
            ),
            alpha: 1,
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 0.12,
        });
        water.material.uniforms.size.value = 50;
        water.rotation.x = -Math.PI / 2;
        water.rotation.z = (Math.PI / 4) * 1.3;
        water.position.set(-42.5, -0.06, -20);
        water.receiveShadow = true;
        water.renderOrder = 1;

        this.rootObject.add(water);

        this.renderer.water = water;
    }

    loadTextures() {
        const that = this;

        this.textures = {};
        for (let k in ASSETS) {
            const fileName = ASSETS[k].map;
            if (fileName && !this.textures[fileName])
                this.textures[fileName] = ASSETS[k].minFilter === "linear";
        }

        for (let k in SEASONS) {
            const fileName = SEASONS[k];
            if (!this.textures[fileName]) this.textures[fileName] = fileName;
        }

        const texturesArray = Object.keys(this.textures),
            texturesLength = texturesArray.length;

        this.loadCount = 0;
        this.totalAssetsNumber = Object.keys(ASSETS).length + texturesLength;

        for (let fileName in this.textures) {
            this.tLoader.load("public/img/" + fileName, (t) => {
                t.anisotropy = 4;
                if (that.textures[fileName]) t.minFilter = LinearFilter;
                that.textures[fileName] = t;
                that.loadCount++;
                that.emit(
                    "asset-loaded",
                    that.loadCount / that.totalAssetsNumber
                );
                if (that.loadCount === texturesLength) that.loadGeometries();
            });
        }
    }

    loadGeometries() {
        const that = this;

        for (let k in ASSETS) {
            this.loader.load("public/geometries/" + ASSETS[k].file, (g) => {
                const ASSET = ASSETS[k];

                //material
                let material;
                const matOptions = {
                    map: this.textures[ASSET.map] || null,
                    color: ASSET.color === undefined ? 0xffffff : ASSET.color,
                    side: ASSET.side === "double" ? DoubleSide : FrontSide,
                    alphaTest: ASSET.alphaTest || 0,
                    transparent: ASSET.transparent === true,
                    depthWrite: ASSET.hasOwnProperty("depthWrite")
                        ? ASSET.depthWrite
                        : true,
                };

                switch (ASSET.material) {
                    case "basic":
                        material = new MeshBasicMaterial(matOptions);
                        break;
                    case "phong":
                        material = new MeshPhongMaterial(matOptions);
                        break;
                    case "lambert":
                    default:
                        material = new MeshLambertMaterial(matOptions);
                        break;
                }

                if (ASSET.animateSeasons) this.makeSeasonalMaterial(material);

                //mesh
                const mesh = new Mesh(g, material);
                mesh.name = k;
                mesh.castShadow = ASSET.castShadow !== false;
                mesh.receiveShadow = ASSET.receiveShadow !== false;
                mesh.matrixAutoUpdate = false;
                that.rootObject.add(mesh);
                that.objectsList.push(mesh);
                if (ASSET.tweenColorWithDayLight)
                    that.tweenedColorObjects.push(mesh);
                Object.assign(mesh.userData, {
                    begin: ASSET.begin,
                    end: ASSET.end,
                    mode: ASSET.mode,
                    dayTime: ASSET.dayTime,
                });
                if (ASSET.useCustomDepthMaterial)
                    mesh.customDepthMaterial = that.getCustomDepthMaterial(
                        mesh
                    );

                if (ASSET.XRay) {
                    Object.assign(mesh.material, {
                        depthWrite: false,
                        depthTest: false,
                        transparent: true,
                        opacity: 0,
                        side: DoubleSide,
                    });
                    mesh.renderOrder = Infinity;
                    mesh.receiveShadow = false;
                    mesh.castShadow = false;
                }

                if (ASSET.dayTime && ASSET.dayTime !== "day") {
                    mesh.position.y = -0.8;
                    mesh.updateMatrix();
                }

                if (ASSET.renderOrder) mesh.renderOrder = ASSET.renderOrder;

                if (ASSET.waterMirrored)
                    mesh.userData.waterMirrored = ASSET.waterMirrored;

                that.camera.update = true;

                that.loadCount++;
                that.emit(
                    "asset-loaded",
                    that.loadCount / that.totalAssetsNumber
                );
                if (that.loadCount === that.totalAssetsNumber) {
                    that.addWater();
                    that.emit("assets-loaded");
                }
            });
        }
    }

    getCustomDepthMaterial(mesh) {
        return new ShaderMaterial({
            uniforms: { texture: { value: mesh.material.map } },
            vertexShader: `
        varying vec2 vUV;
        void main() {
         vUV = uv;
         vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
         gl_Position = projectionMatrix * mvPosition;
        }`,
            fragmentShader: `
        #include <packing>
        uniform sampler2D texture;
        varying vec2 vUV;
        void main() {
         vec4 pixel = texture2D( texture, vUV );
         if ( pixel.a < 0.7 ) discard;
         gl_FragData[ 0 ] = packDepthToRGBA( gl_FragCoord.z );
        }`,
            side: DoubleSide,
        });
    }

    makeSeasonalMaterial(material) {
        const that = this;

        material.map = this.textures[SEASONS.summer];

        material.onBeforeCompile = (shader) => {
            shader.uniforms.fallTexture = {
                value: that.textures[SEASONS.fall],
            };
            shader.uniforms.winterTexture = {
                value: that.textures[SEASONS.winter],
            };
            shader.uniforms.springTexture = {
                value: that.textures[SEASONS.spring],
            };
            shader.uniforms.yearTime = { value: 0.5 };
            material.yearTime = shader.uniforms.yearTime;

            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_pars_fragment>",
                `uniform sampler2D map;
        uniform sampler2D fallTexture;
        uniform sampler2D winterTexture;
        uniform sampler2D springTexture;
        uniform float yearTime;`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_fragment>",
                `vec4 texelColor = vec4( 0.0, 0.0, 0.0, 0.0 );
        texelColor += texture2D( map, vUv ) * ( max( 0.0, 1.0 - 4.0 * abs( yearTime ) ) + max( 0.0, 1.0 - 4.0 * abs( yearTime - 1.0 ) ) );
        texelColor += texture2D( fallTexture, vUv ) * max( 0.0, 1.0 - 4.0 * abs( yearTime - 0.25 ) );
        texelColor += texture2D( winterTexture, vUv ) * max( 0.0, 1.0 - 4.0 * abs( yearTime - 0.5 ) );
        texelColor += texture2D( springTexture, vUv ) * max( 0.0, 1.0 - 4.0 * abs( yearTime - 0.75 ) );

        texelColor = mapTexelToLinear( texelColor );
        diffuseColor *= texelColor;`
            );
        };
    }
}
