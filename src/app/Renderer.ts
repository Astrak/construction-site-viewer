import {
    CineonToneMapping,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { state } from "../store";
import { hasMaterial } from "../utils";
// import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass";
import "./Renderer.css";
import { Viewer } from "./Viewer";

export class Renderer {
    renderer: WebGLRenderer = new WebGLRenderer();
    lastRenderTime: number = performance.now();
    currentRenderTime: number = performance.now();
    // tslint:disable-next-line: no-empty
    onUpdate: () => void = () => {};
    camera?: PerspectiveCamera;
    scene?: Scene;
    controls?: OrbitControls;
    composer?: EffectComposer;
    fxaaPass?: ShaderPass;
    cameraDistance?: number;
    water?: Water;
    isDevice: boolean = window.devicePixelRatio > 1.1; // IE11 returns 1.001?

    constructor(public viewer: Viewer) {
        this.renderer.setPixelRatio(
            window.location.hash === "low" ? 1 : window.devicePixelRatio
        );
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.autoUpdate = false;
        // this.renderer.shadowMap.renderSingleSided = false;
        // this.renderer.gammaInput = this.renderer.gammaOutput = true;
        this.renderer.toneMapping = CineonToneMapping;
        document.getElementById("app").appendChild(this.renderer.domElement);
    }

    resize() {
        if (this.isDevice === undefined) {
            if (this.isDevice) {
                this.renderer.setSize(innerWidth, innerHeight);
            } else {
                this.renderer.setSize(innerWidth, innerHeight);
                this.composer.setSize(innerWidth, innerHeight);
                if (this.fxaaPass !== undefined) {
                    (this.fxaaPass.uniforms as any).resolution.value.set(
                        1 / innerWidth,
                        1 / innerHeight
                    );
                }
            }
        }
    }

    setRendering(
        scene: Scene,
        camera: PerspectiveCamera,
        controls: OrbitControls
    ) {
        if (!this.isDevice) {
            const saoParams = {
                saoBias: 0.5,
                saoIntensity: 0.02,
                saoScale: 30,
                saoKernelRadius: 10,
                saoMinResolution: 0,
                saoBlur: true,
                saoBlurRadius: 8,
                saoBlurStdDev: 1.3,
                saoBlurDepthCutoff: 0.01,
            };

            this.composer = new EffectComposer(this.renderer);
            this.composer.addPass(new RenderPass(scene, camera));

            /*this.SAOPass = new SAOPass( scene, camera, false, true );
            Object.assign( this.SAOPass.params, {
                saoBias: saoParams.saoBias,
                saoIntensity: saoParams.saoIntensity,
                saoScale: saoParams.saoScale,
                saoKernelRadius: saoParams.saoKernelRadius,
                saoMinResolution: saoParams.saoMinResolution,
                saoBlur: saoParams.saoBlur,
                saoBlurRadius: saoParams.saoBlurRadius,
                saoBlurStdDev: saoParams.saoBlurStdDev,
                saoBlurDepthCutoff: saoParams.saoBlurDepthCutoff
            });
            this.composer.addPass( this.SAOPass );*/

            this.fxaaPass = new ShaderPass(FXAAShader);
            (this.fxaaPass.uniforms as any).resolution.value.set(
                1 / (window.devicePixelRatio * innerWidth),
                1 / (window.devicePixelRatio * innerHeight)
            );
            this.composer.addPass(this.fxaaPass);
            this.fxaaPass.renderToScreen = true;

            // this.copyPass = new ShaderPass( CopyShader );
            // this.copyPass.renderToScreen = true;
            // this.composer.addPass( this.copyPass );
        }

        this.camera = camera;
        this.scene = scene;
        this.controls = controls;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Controls
        const cameraDistance =
            this.cameraDistance ??
            this.camera.position.clone().sub(this.controls.target).length();
        this.controls.minPolarAngle = this.controls.maxPolarAngle =
            1 + 0.4 * ((10 - cameraDistance) / 5);

        this.controls.update();

        // Seasons and water (uniforms update)
        this.currentRenderTime = performance.now();
        const timeDiff = this.currentRenderTime - this.lastRenderTime;
        this.lastRenderTime = this.currentRenderTime;

        let yearTime: number;
        this.viewer.objectsList.forEach((object) => {
            if (hasMaterial(object) && (object.material as any).yearTime) {
                if (yearTime !== undefined) {
                    yearTime = (object.material as any).yearTime.value;
                    yearTime = (yearTime + timeDiff / 32 / 1000) % 1;
                }
                (object.material as any).yearTime.value = yearTime;
            }
        });

        if (this.water !== undefined) {
            (this.water.material as any).uniforms.time.value += timeDiff / 1000;
        }

        // Render rules
        if (state.updateCamera || this.viewer.userIsViewing) {
            if (this.isDevice) {
                // Better benefit pixelratio than fxaa, if pr > 1 (?)
                this.renderer.render(this.scene, this.camera);
            } else {
                this.composer.render(0.016);
            }

            state.updateCamera = false;

            this.onUpdate();
        }
    }
}
