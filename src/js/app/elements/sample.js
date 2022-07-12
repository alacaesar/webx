import * as THREE from 'three';

import vertex from '../shaders/new/vertex';
import fragment from '../shaders/new/fragment';

import WaterTexture from './waterTexture';
import FaceDetector from './faceDetector';

import vars from "../tools/vars";

// Controls based on orbit controls
export default class Sample {
  constructor() {
    this.scene = vars.main.scene;
    this.init();
    this.initGraphics();
  }

  init() {

    const _this = this;

    this.waterTexture = new WaterTexture({ debug: true });
    this.FaceDetector = new FaceDetector({ onResults:(point) =>{
      //_this.waterTexture.addPoint(point);
    }} );
    //this.FaceDetector.init();

    vars.mouseMoveFunctions.push([(point) => {
      _this.waterTexture.addPoint(point);
    }, "DRAW_RIPPLES"]);
    
    vars.loopFunctions.push([(time) => {
      _this.waterTexture.update();
    }, "ANIMATE_OBJECTS"]);
  }

  initGraphics() {
    const _this = this;
    this.time = 0;

    this.texture = new THREE.TextureLoader().load('/assets/sample.jpg');
    this.texture.needsUpdate = true;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        iTexture: { type: "sampler2D", value: _this.texture },
        uTexture: { type: "sampler2D", value: _this.waterTexture.texture },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: false,
    });

    this.geometry = new THREE.PlaneGeometry(3,3,100,100);

    this.plane = new THREE.Mesh(
      this.geometry,
      this.material,
    );
    this.scene.add(this.plane);
  }
}