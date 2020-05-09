import { EventEmitter } from "events";
import {
    DoubleSide,
    FrontSide,
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    PlaneBufferGeometry,
    RepeatWrapping,
    ShaderMaterial,
    Texture,
    TextureLoader,
} from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { Water } from "three/examples/jsm/objects/Water";
import { ASSETS } from "../constants/assets";
import { SEASONS } from "../constants/seasons";
import { state } from "../store";
import { Renderer } from "./Renderer";

export class Loader extends EventEmitter {
    loader = new PLYLoader();
    tLoader = new TextureLoader();
    textures: { [key: string]: boolean | string | Texture } = {};
    loadCount: number = 0;
    totalAssetsNumber: number;
    constructor(
        public renderer: Renderer,
        public camera: PerspectiveCamera,
        public rootObject: Object3D,
        public objectsList: Object3D[],
        public tweenedColorObjects: Object3D[]
    ) {
        super();
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
        (water.material as any).uniforms.size.value = 50;
        water.rotation.x = -Math.PI / 2;
        water.rotation.z = (Math.PI / 4) * 1.3;
        water.position.set(-42.5, -0.06, -20);
        water.receiveShadow = true;
        water.renderOrder = 1;

        this.rootObject.add(water);

        this.renderer.water = water;
    }

    loadTextures() {
        // tslint:disable-next-line: forin
        for (const k in ASSETS) {
            const fileName = (ASSETS as any)[k].map;
            if (fileName && !(this.textures[fileName] as boolean)) {
                this.textures[fileName] =
                    (ASSETS as any)[k].minFilter === "linear";
            }
        }

        // tslint:disable-next-line: forin
        for (const k in SEASONS) {
            const fileName = (SEASONS as any)[k];
            if (!(this.textures[fileName] as boolean)) {
                this.textures[fileName] = fileName;
            }
        }

        const texturesArray = Object.keys(this.textures);
        const texturesLength = texturesArray.length;

        this.totalAssetsNumber = Object.keys(ASSETS).length + texturesLength;

        // tslint:disable-next-line: forin
        for (const fileName in this.textures) {
            this.tLoader.load("public/img/" + fileName, (t) => {
                t.anisotropy = 4;
                if (this.textures[fileName] as boolean) {
                    t.minFilter = LinearFilter;
                }
                this.textures[fileName] = t;
                this.loadCount++;
                this.emit(
                    "asset-loaded",
                    this.loadCount / this.totalAssetsNumber
                );
                if (this.loadCount === texturesLength) {
                    this.loadGeometries();
                }
            });
        }
    }

    loadGeometries() {
        // tslint:disable-next-line: forin
        for (const k in ASSETS) {
            this.loader.load(
                "public/geometries/" + (ASSETS as any)[k].file,
                (g) => {
                    const ASSET = (ASSETS as any)[k];

                    // material
                    let material;
                    const matOptions = {
                        color: ASSET.color ?? 0xffffff,
                        side: ASSET.side === "double" ? DoubleSide : FrontSide,
                        alphaTest: ASSET.alphaTest ?? 0,
                        transparent: ASSET.transparent === true,
                        depthWrite: ASSET.hasOwnProperty("depthWrite")
                            ? ASSET.depthWrite
                            : true,
                    };
                    if (this.textures[ASSET.map] !== undefined) {
                        (matOptions as any).map = this.textures[
                            ASSET.map
                        ] as Texture;
                    }

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

                    if (ASSET.animateSeasons) {
                        this.makeSeasonalMaterial(material);
                    }

                    // mesh
                    const mesh = new Mesh(g, material);
                    mesh.name = k;
                    mesh.castShadow = ASSET.castShadow !== false;
                    mesh.receiveShadow = ASSET.receiveShadow !== false;
                    mesh.matrixAutoUpdate = false;
                    this.rootObject.add(mesh);
                    this.objectsList.push(mesh);
                    if (ASSET.tweenColorWithDayLight) {
                        this.tweenedColorObjects.push(mesh);
                    }
                    Object.assign(mesh.userData, {
                        begin: ASSET.begin,
                        end: ASSET.end,
                        mode: ASSET.mode,
                        dayTime: ASSET.dayTime,
                    });
                    if (ASSET.useCustomDepthMaterial) {
                        mesh.customDepthMaterial = this.getCustomDepthMaterial(
                            mesh
                        );
                    }

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

                    if (ASSET.renderOrder) {
                        mesh.renderOrder = ASSET.renderOrder;
                    }

                    if (ASSET.waterMirrored) {
                        mesh.userData.waterMirrored = ASSET.waterMirrored;
                    }

                    state.updateCamera = true;

                    this.loadCount++;
                    this.emit(
                        "asset-loaded",
                        this.loadCount / this.totalAssetsNumber
                    );
                    if (this.loadCount === this.totalAssetsNumber) {
                        this.addWater();
                        this.emit("assets-loaded");
                    }
                }
            );
        }
    }

    getCustomDepthMaterial(mesh: Mesh) {
        return new ShaderMaterial({
            uniforms: { texture: { value: (mesh.material as any).map } },
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

    makeSeasonalMaterial(material: MeshBasicMaterial) {
        material.map = this.textures[SEASONS.summer] as Texture;

        material.onBeforeCompile = (shader) => {
            shader.uniforms.fallTexture = {
                value: this.textures[SEASONS.fall],
            };
            shader.uniforms.winterTexture = {
                value: this.textures[SEASONS.winter],
            };
            shader.uniforms.springTexture = {
                value: this.textures[SEASONS.spring],
            };
            shader.uniforms.yearTime = { value: 0.5 };
            (material as any).yearTime = shader.uniforms.yearTime;

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
