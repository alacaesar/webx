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

// Shaders
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { FilmGrainShader } from './shaders/FilmGrainShader';
import { LensDistortionShader } from './shaders/LensDistortionShader';

var composer,
    renderPass,
    distortPass,
    grainPass,
    fxaaPass,
    glitchPass;

// Custom
import Face from './elements/face';


let animals = ["fox", "bear", "chinchilla", "seal", "mink", "racoon"], k = 0, first = true;

export default class Main {
  constructor(container) {

    vars.main = this;

    this.container = container;

    this.clock = new THREE.Clock();

    // Events manager
    this.events = new Events();
    this.events.init();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    vars.scene = this.scene;

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
    //const lights = ['ambient', 'directional', 'point', 'hemi'];
    const lights = ['directional'];
    //lights.forEach((light) => this.light.place(light));

    // Dev perpose stats
    if(Config.isDev){
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
      vars.loopFunctions.push([()=> this.stats.update(), "UPDATE_STATS"]);
    }

    // Render Pass Setup
    renderPass = new RenderPass( this.scene, this.camera.threeCamera );
    grainPass = new ShaderPass( FilmGrainShader );
    fxaaPass = new ShaderPass( FXAAShader );
    distortPass = new ShaderPass( LensDistortionShader );
    glitchPass = new GlitchPass();
    //glitchPass.goWild = true;
    glitchPass.curF = 10;

    glitchPass.material.uniforms.distortion_x.value = 0.0;
    glitchPass.material.uniforms.distortion_y.value = 0.0;

    composer = new EffectComposer( this.renderer.threeRenderer );
    composer.setSize( window.innerWidth, window.innerHeight );
    composer.setPixelRatio( window.devicePixelRatio );
    composer.addPass( renderPass );
    composer.addPass( fxaaPass );
    //composer.addPass( glitchPass );
    composer.addPass( distortPass );
    composer.addPass( grainPass );
    

    setTimeout(() => {
      //composer.removePass( glitchPass );
    }, 2000);

    distortPass.material.uniforms.baseIor.value = 0.99;
    distortPass.material.uniforms.bandOffset.value = 0.003;
    grainPass.material.uniforms.intensity.value = 0.08;

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

    //animals.sort(() => (Math.random() > 0.5) ? 1 : -1)
    
    this.face = new Face();
    vars.face = this.face;

    this.refresh();
  }

  refresh() {
    const _this = this;

    if(!vars.isPauseGlitch){
      composer.addPass( glitchPass );

      this.face.refresh(
        "assets/animals/"+ animals[k] +".jpg", 
        ()=>{ 
          setTimeout(function(){ 
            glitchPass.goWild = false;
            distortPass.material.uniforms.bandOffset.value = 0.003; 
          }, 200); 
          setTimeout(function(){ 
            composer.removePass( glitchPass );
          }, 2000);

          if(first){
            first = false;
            _this.face.randomize(3333);
            _this.face.build( _this.intro );
          }

          if(k == animals.length - 1) k = 0;
          else k++;
          
        },
        ()=>{
          if(!first) glitchPass.goWild = true;
          distortPass.material.uniforms.bandOffset.value = 0.02; 
        }
      );
      setTimeout(function(){ _this.refresh(); }, 4000 + Math.random() * 4000 );
    }
  }

  intro(){
    //vars.isPauseGlitch = true;
    document.body.classList.remove("hold");
  }

  render() {
    this.onAnimationFrame();
    // RAF
    if(!vars.isPaused){
      requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
    }
  }

  onAnimationFrame(){

    const _this = vars.main;

    // Call render function and pass in created scene and camera
    //_this.renderer.render(_this.scene, _this.camera.threeCamera);

    composer.render();

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