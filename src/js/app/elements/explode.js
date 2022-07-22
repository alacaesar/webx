import * as THREE from 'three';
import anime from 'animejs';

import vertex from '../shaders/explode/vertex.glsl';
import fragment from '../shaders/explode/fragment.glsl';
import thumbVertex from '../shaders/explode/thumbVertex.glsl';
import thumbFragment from '../shaders/explode/thumbFragment.glsl';

import vars from "../tools/vars";
import fx from "../tools/fx";

let opts = {
    particleCount: Math.pow(128, 2),
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
      _this.material.uniforms.distortion.value = vars.main.settings.distortion;
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
        distortion: { type: "f", value: 0 },
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

    this.initProcess();
  }

  initProcess(){
    const _this = this;

    let thumbCount = 10; 
    let thumbSize = 6; 
    let thumbPadding = 2;
    let thumbSpacing = 12;

    this.thumbnails = new THREE.Object3D();

    for(var j = 1; j<thumbCount+1; ++j){

      // let nts = thumbSize + j/(thumbCount-1);
      let nts = thumbSize;

      let thumbnail = new THREE.Object3D();

      let frame = new THREE.Mesh(
        new THREE.PlaneGeometry(nts+3, nts+3, 1, 1),
        new THREE.MeshBasicMaterial({
          color:0xffffff,
          wireframe: true,
          transparent: true,
        })
      );
      frame.position.z = -0.1;
      thumbnail.add(frame);

      
      let small = new THREE.Points(
        new THREE.PlaneGeometry(nts+j*.1,nts+j*.1,j*5,j*5),
        new THREE.ShaderMaterial({
          extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
          },
          side: THREE.DoubleSide,
          uniforms: {
            Texture1: { type: "sampler2D", value:  new THREE.TextureLoader().load("assets/portal-"+(j-1)+".jpg") },
            resolution: { type: "f", value: vars.width * vars.height },
            shift: { type: "f", value: 0.0 },
            blur: { type:"f", value: j*5 },
          },
          vertexShader: thumbVertex,
          fragmentShader: thumbFragment,
          wireframe: false,
          transparent: true,
        })
      );
      thumbnail.add(small);

      thumbnail._stackPosition = new THREE.Vector3(0,0,thumbPadding * j);
      thumbnail._gridPosition = new THREE.Vector3((j-1) * thumbSpacing - (thumbSpacing * thumbCount * .5) + thumbSpacing - thumbSize, 0,0);
      // thumbnail._randPosition = new THREE.Vector3(Math.sin(Math.random()*360*THREE.Math.DEG2RAD) * 500, Math.cos(Math.random()*360*THREE.Math.DEG2RAD) * 500, 0);
      thumbnail._randPosition = new THREE.Vector3(0, -10, 30);
      thumbnail._discardPosition = new THREE.Vector3((j-1< thumbCount * .5 ? -1:1) * 100,0,0);
      thumbnail._discardPosition = new THREE.Vector3((j-1) * thumbSpacing - (thumbSpacing * thumbCount * .5) + thumbSpacing - thumbSize,-100,0);

      thumbnail.position.copy(thumbnail._randPosition);

      this.thumbnails.add(thumbnail);
      
    }

    vars.main.camera.threeCamera.add(this.thumbnails);

    this.thumbnails.position.set(0,0,-30);
    
  }

  resetProcess(){
    const _this = this;
    const arr = this.thumbnails.children;
    this.thumbnails.position.set(0,0,-30);
    arr.forEach((elm, index) => {
      elm.position.copy(elm._randPosition);
      elm.rotation.z = -45 * THREE.Math.DEG2RAD;
      elm.children[0].material.opacity = 0;
      elm.children[1].material.uniforms.shift.value = 0;
    });
  }

  animateProcess(current, callback){
    const _this = this;
    const arr = this.thumbnails.children;
    let wait = 0;

    vars.loopFunctions.push([(time) => {
      _this.thumbnails.rotation.y = Math.sin(time * .0004) * .4;
      _this.thumbnails.rotation.x = Math.cos(time * .0002) * .1;
    }, "ANIMATE_FRAMES"]);

    // build frames
    arr.forEach((elm, index) => {

      elm.children[1].material.uniforms.Texture1.value =  new THREE.TextureLoader().load(vars.data.collection[current].thumbs[index]);
      
      anime.timeline({loop:false})
      .add({
        targets:elm.position,
        x: elm._stackPosition.x,
        y: elm._stackPosition.y,
        z: elm._stackPosition.z,
        duration: 500,
        delay: index * 200,
        easing: "easeOutCubic",
      })
      .add({
        targets: elm.rotation,
        z: 0,
        duration: 500,
        delay: index * 200,
        easing: "easeOutCubic",
      }, 0)
      .add({
        targets: elm.children[0].material,
        opacity: 1,
        duration: 500,
        delay: index * 200,
        easing: "easeOutCubic",
      }, 0);
    });
    wait += arr.length * 200 + 500;

    // fill pixels
    setTimeout(()=>{

      arr.forEach((elm, index) =>{
        elm.children[1].material.uniforms.shift.value = 0;
        anime({
          targets:elm.children[1].material.uniforms.shift,
          value: 1,
          duration: 2000,
          easing:"easeInOutCubic",
          delay: index * 800
        });
      });

    }, wait);
    wait += arr.length * 800 + 2000 + 1500;

    // show grid
    setTimeout(()=>{

      fx.removeFromLoop('ANIMATE_FRAMES');

      anime.timeline()
      .add({
        targets: _this.thumbnails.rotation,
        x:0,
        y:0,
        z:0,
        duration: 3000,
        easing:"easeInOutExpo"
      })
      .add({
        targets: _this.thumbnails.position,
        z: -60,
        duration: 3000,
        easing:"easeInOutExpo"
      }, 0);

      arr.forEach((elm, index) =>{
        anime({
          targets:elm.position,
          x: elm._gridPosition.x,
          y: elm._gridPosition.y,
          z: elm._gridPosition.z,
          duration: 1500,
          easing: "easeInOutExpo",
        });
      });
    }, wait);
    wait += 3000;

    // blink last one
    setTimeout(()=>{
      let mat =  arr[arr.length-1].children[0].material;
      let blink = setInterval(()=>{
        mat.wireframe = !mat.wireframe
      }, 50);
      setTimeout(() => {
        clearInterval(blink);
      }, 500);
    }, wait);
    wait += 800;

    // outro animation
    setTimeout(()=>{
      arr.forEach((elm, index) =>{
        anime({
          targets:elm.position,
          x: elm._discardPosition.x,
          y: elm._discardPosition.y,
          z: elm._discardPosition.z,
          duration: 1500,
          delay: index * 130,
          easing: "easeInExpo",
        });
      });
    }, wait);
    wait += 1500 + arr.length * 130;

    // callback and reset
    setTimeout(()=>{
      _this.resetProcess();
      if(callback) callback();
    }, wait);
    
  }

  expand(current, callback){
    anime.timeline()
    .add({
      targets: vars.main.settings,
      distortion: 0,
      duration: 2000,
      easing: 'easeInOutCubic'
    })
    .add({
        targets: vars.main.settings,
        progress: 1,
        transition: 1,
        duration:8000,
        easing: 'easeInOutCubic',
        complete:()=>{
          if(callback) callback();
        }
    });
  }

  contract(current, callback){
    let _this = this;
    
    anime({
      targets: vars.main.settings,
      progress: 0,
      duration:6000,
      easing: 'easeInOutCubic',
      complete:()=>{
          let first = current;
          let second = current < vars.data.collection.length - 1 ? current + 1 : 0;

          _this.material.uniforms.iTexture1.value = _this.textures[first];
          _this.material.uniforms.iTexture2.value = _this.textures[first];
          vars.main.settings.transition = 0;
          setTimeout(()=>{
            _this.material.uniforms.iTexture2.value = _this.textures[second];
            _this.distort();
          }, 100);

          if(callback) callback();
          
        }
    });
  }

  distort(){
    anime({
      targets: vars.main.settings,
      distortion: 1,
      duration: 2000,
      easing: 'easeInOutCubic'
    })
  }
}