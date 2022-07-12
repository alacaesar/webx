import * as THREE from 'three';

import vertex from '../shaders/galaxy/vertex';
import fragment from '../shaders/galaxy/fragment';

import vars from "../tools/vars";
import fx from "../tools/fx";

let opts = {
    particleCount: 10000,
    min_radius: .5,
    max_radius: 2,
}

// Controls based on orbit controls
export default class Galaxy {
  constructor() {
    this.scene = vars.main.scene;
    this.init();
    this.initGraphics();
  }

  init() {

    const _this = this;

    vars.mouseMoveFunctions.push([(point) => {
      // do nothing
    }, "DRAW_RIPPLES"]);
    
    vars.loopFunctions.push([(time) => {
      // do nothing
    }, "ANIMATE_OBJECTS"]);
  }

  initGraphics() {
    const _this = this;
    this.time = 0;

    this.texture = new THREE.TextureLoader().load('/assets/particle.webp');
    this.texture.needsUpdate = true;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        iTexture: { type: "sampler2D", value: _this.texture },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: false,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    //this.geometry = new THREE.PlaneGeometry(1,1,1,1);

    // geometry for each particle
    let particleGeo = new THREE.PlaneBufferGeometry(1,1);

    // create empty geometry
    this.geometry = new THREE.InstancedBufferGeometry();

    this.geometry.instanceCount = opts.particleCount;
    this.geometry.setAttribute("position", particleGeo.getAttribute("position"));
    this.geometry.index = particleGeo.index;

    let pos = new Float32Array(opts.particleCount * 3);

    for(let i=0; i<opts.particleCount; ++i){
        let theta = Math.random()*2*Math.PI;
        let r = fx.lerp(opts.min_radius, opts.max_radius, Math.random());

        let x = r * Math.sin(theta);
        let y = (Math.random()-.5)*.3;
        let z = r * Math.cos(theta);

        pos.set([
            x,y,z
        ],i*3);
    }

    this.geometry.setAttribute('pos', new THREE.InstancedBufferAttribute(pos, 3, false));

    
    this.points = new THREE.Mesh(
      this.geometry,
      this.material,
    );
    this.scene.add(this.points);
  }
}