import * as THREE from 'three';
import anime from 'animejs';

import vertex from '../shaders/explode/vertex.glsl';
import fragment from '../shaders/explode/fragment.glsl';

import vars from "../tools/vars";
import fx from "../tools/fx";

let opts = {
    particleCount: Math.pow(256, 2),
    min_radius: .5,
    max_radius: 2,
    move:0,
}

// Controls based on orbit controls
export default class Explode {
  constructor() {
    this.scene = vars.main.scene;
    
    this.initTextures();
    this.init();
    this.initGraphics();

  }

  initTextures(){
    this.textures = [];
    vars.data.collection.forEach(elm => {
        let texture = new THREE.TextureLoader().load(elm.visual);
        this.textures.push(texture);
    });
  }

  init() {

    const _this = this;

    const axesHelper = new THREE.AxesHelper( 500 );
    //this.scene.add( axesHelper );

    this.raycaster = new THREE.Raycaster();
    this.mouseVector = new THREE.Vector3();

    vars.mouseMoveFunctions.push([(point) => {

      _this.raycaster.setFromCamera(point, vars.main.camera.threeCamera);

      let intersects = _this.raycaster.intersectObjects([_this.plane]);
      if(intersects.length > 0){
        let point = intersects[0].point;
        _this.ball.position.copy(point);
        _this.mouseVector.copy(point);
      }

      // do nothing
    }, "DRAW_RIPPLES"]);
    
    vars.loopFunctions.push([(time) => {
      _this.time++;
      _this.material.uniforms.time.value = _this.time;
      _this.material.uniforms.move.value = vars.main.settings.progress;
      _this.material.uniforms.transition.value = vars.main.settings.transition;
      _this.material.uniforms.uMouse.value = _this.mouseVector;
    }, "ANIMATE_OBJECTS"]);
  }

  initGraphics() {
    const _this = this;
    this.time = 0;

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(512,512,10,10),
      new THREE.MeshBasicMaterial({color:"yellow", wireframe:true})
    );
    //this.scene.add(this.plane);

    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(30,10,10),
      new THREE.MeshBasicMaterial({color:"red", wireframe:true})
    );
    //this.scene.add(this.ball);

    this.mask = new THREE.TextureLoader().load('/assets/particle.jpg');

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        move: { type: "f", value: 0 },
        transition: { type: "f", value: 0 },
        iTexture1: { type: "sampler2D", value: _this.textures[0] },
        iTexture2: { type: "sampler2D", value: _this.textures[1] },
        mTexture: { type: "sampler2D", value: _this.mask },
        uMouse: { type: "v3", value: new THREE.Vector3() },
        resolution: { type: "f", value: Math.sqrt(opts.particleCount) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      wireframe: false,
      transparent: true,
      depthTest: true,
      depthWrite: false
    });

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

  onClick(current){

    let _this = this;

    anime.timeline({loop:false})
    .add({
        targets: vars.main.settings,
        progress: 1,
        transition: 1,
        duration:8000,
        easing: 'easeInOutCubic',
        complete:()=>{
            let first = current;
            let second = current < vars.data.collection.length - 1 ? current + 1 : 0;

            _this.material.uniforms.iTexture1.value = _this.textures[first];
            _this.material.uniforms.iTexture2.value = _this.textures[second];
        }
    }).add({
        targets: vars.main.settings,
        progress: 0,
        transition: 0,
        duration:6000,
        easing: 'easeOutCubic',
    });

  }
}