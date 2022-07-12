import * as THREE from 'three';

import vertex from '../shaders/vertex';
import fragment from '../shaders/fragment';

import vars from "../tools/vars";

// Controls based on orbit controls
export default class Sample {
  constructor() {
    this.scene = vars.main.scene;
    this.init();

  }

  init() {

    const _this = this;

    this.time = 0;

    this.texture = new THREE.TextureLoader().load("/assets/sample.jpg");

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        texture1: {type: "sampler2D", value: this.texture },
        texture2: {type: "sampler2D", value: this.texture },
        uMouse: { type: "v2", value: new THREE.Vector2() },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.geometry = new THREE.PlaneGeometry(5.4,5.4,90*4,90*4);
    
    this.dots = new THREE.Points(
        this.geometry,
        this.material,
    );
    this.scene.add(this.dots);

    this.plane = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({map:this.texture,  color:0xE8E8E8})
    );
    this.plane.position.z = -.0;
    this.scene.add(this.plane);

    this.sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(60, 3),
        new THREE.MeshBasicMaterial({wireframe:true})
    );
    this.scene.add(this.sphere);

    
    vars.loopFunctions.push([(time) => {
      
      _this.time += 0.03;
      _this.material.uniforms.time.value = _this.time;

    }, "ANIMATE_OBJECTS"]);
  }
}