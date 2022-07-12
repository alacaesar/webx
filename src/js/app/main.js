// Global imports -
import * as THREE from 'three';
import anime from 'animejs';

// enabling VR
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

// Stats for dev
import Stats from 'three/examples/jsm/libs/stats.module';

//Components
import Renderer from './components/renderer';
import Camera from './components/camera';
import Light from './components/light';
import Controls from './components/controls';

//Data
import Config from '../data/config';
import vars from './tools/vars';
import Events from './tools/events';

// Custom
import Sample from './elements/sample';
import Explode from './elements/explode';

export default class Main {
  constructor(container) {

    vars.main = this;

    this.container = container;

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Get Device Pixel Ratio first for retina
    if(window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    // Main renderer constructor
    this.renderer = new Renderer(this.scene, container);

    // Components instantiations
    this.camera = new Camera(this.renderer.threeRenderer);
    this.light = new Light(this.scene);

    // Create and place lights in scene
    const lights = ['ambient', 'directional', 'point', 'hemi'];
    lights.forEach((light) => this.light.place(light));

    // Events manager
    this.events = new Events();
    this.events.init();

    // Dev perpose stats
    if(Config.isDev){
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
      vars.loopFunctions.push([()=> this.stats.update(), "UPDATE_STATS"]);
    }

    this.init();

    if(Config.isVREnabled){
      document.body.appendChild( VRButton.createButton( this.renderer.threeRenderer ) );
      this.renderer.threeRenderer.setAnimationLoop( this.onAnimationFrame );
      console.log('%c[( )^( )] VR Enabled','background:#FCFF00; color:#000; padding:3px 7px');
    }else{
      this.controls = new Controls(this.camera.threeCamera, container);
      this.controls.threeControls.enabled = true;

      this.render();
    }
  }

  init(){
    this.explode = new Explode();
  }

  onTriggerClick(){
    this.explode.onClick();
  }

  render() {
    this.onAnimationFrame();
    // RAF
    if(!vars.isPaused)
      requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }

  onAnimationFrame(){

    const _this = vars.main;

    // Call render function and pass in created scene and camera
    _this.renderer.render(_this.scene, _this.camera.threeCamera);

    const delta = _this.clock.getDelta();

    // loop functions
    if(!vars.isPauseLoopFunctions){
      var time = Date.now();
      for (var i in vars.loopFunctions){
        vars.loopFunctions[i][0](time, delta);
      }
    }
  }
}