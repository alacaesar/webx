import * as THREE from 'three';
import anime from 'animejs';

import vertex from '../shaders/explode/vertex.glsl';
import fragment from '../shaders/explode/fragment.glsl';

import vars from "../tools/vars";
import fx from "../tools/fx";

let opts = {
    particleCount: 512 * 512,
    min_radius: .5,
    max_radius: 2,
    move:0,
}

// Controls based on orbit controls
export default class Explode {
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
      _this.material.uniforms.time.value = time;
      _this.material.uniforms.move.value = opts.move;
    }, "ANIMATE_OBJECTS"]);
  }

  initGraphics() {
    const _this = this;
    this.time = 0;

    this.texture = new THREE.TextureLoader().load('/assets/sample.jpg');
    this.mask = new THREE.TextureLoader().load('/assets/particle.jpg');

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        move: { type: "f", value: 0 },
        iTexture: { type: "sampler2D", value: _this.texture },
        mTexture: { type: "sampler2D", value: _this.mask },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: false,
      transparent: true,
      depthTest: false,
    });

    //this.geometry = new THREE.PlaneGeometry(1,1,1,1);
    this.geometry = new THREE.BufferGeometry();

    let positions = new Float32Array(opts.particleCount*3);
    let coordinates = new Float32Array(opts.particleCount*3);
    let speeds = new Float32Array(opts.particleCount);
    let offsets = new Float32Array(opts.particleCount);

    let index = 0;
    let axis =  Math.sqrt(opts.particleCount);
    for(let i=0; i<opts.particleCount; i++){

        let x = i - index * axis;
        let y = index;
        let z = 0;

        positions.set( [x - axis * .5,y - axis * .5,z], 3*i );
        coordinates.set( [x,y,z], 3*i);
        offsets.set([fx.rand(-1000,1000)], i);
        speeds.set([fx.rand(.4,1)], i);

        if(i == (axis -1) + index * axis){
            index++;
        }
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("aCoordinates", new THREE.BufferAttribute(coordinates, 3));
    this.geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    this.geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    
    this.points = new THREE.Points(
      this.geometry,
      this.material,
    );
    this.scene.add(this.points);
  }

  onClick(){
    let k = opts.move == 0 ? 2000 : 0;
    anime({
        targets: opts,
        move: k,
        duration:2000,
        easing: 'easeInOutCubic',
        complete: ()=>{ console.log(opts.move); }
    });
  }
}