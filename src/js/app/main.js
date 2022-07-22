// Global imports -
import * as THREE from 'three';
import anime from 'animejs';
import * as dat from 'dat.gui';


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
import Explode from './elements/explode';
import Overlay from './elements/overlay';
import FaceDetector from './elements/faceDetector';
import WaterTexture from './elements/waterTexture';

let current = 0;

let k = 0;

export default class Main {
  constructor(container) {

    vars.main = this;

    this.container = container;

    this.clock = new THREE.Clock();
    this.cameraTime = 0;

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

    this.scene.add(this.camera.threeCamera);

    // Create and place lights in scene
    const lights = ['ambient', 'directional', 'point', 'hemi'];
    lights.forEach((light) => this.light.place(light));

    // Events manager
    this.events = new Events();
    this.events.init();

    // Dev perpose stats
    if(Config.isDev){
      /*
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
      vars.loopFunctions.push([()=> this.stats.update(), "UPDATE_STATS"]);
      */
    }

    this.initSettings();
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

  initSettings(){
    let _this = this;
    this.settings = {
      move_camera: true,
      path_radius: 120,
      camera_speed: 0.005,
      progress: 0,
      transition: 0,
      distortion: 0,
      toggle: _this.onTriggerClick,
      explode: _this.onTransitionClick,
    }
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "move_camera");
    this.gui.add(this.settings, "path_radius", 100, 500, 10);
    this.gui.add(this.settings, "camera_speed", 0, 0.01, 0.0001);
    this.gui.add(this.settings, "progress", 0, 1, 0.001);
    this.gui.add(this.settings, "distortion", 0, 1, 0.001);
    this.gui.add(this.settings, "transition", 0, 1, 0.01);
    this.gui.add(this.settings, "toggle");
    this.gui.add(this.settings, "explode");
  }

  init(){
    let _this = this;

    fetch("/data.json")
    .then(response => response.json())
    .then(data => {
      vars.data = data;

      // _this.explode = new Explode();
      _this.overlay = new Overlay(document.querySelector(".overlay"));
      //_this.waterTexture = new WaterTexture({ debug: true });
      _this.faceDetector = new FaceDetector({onResults:(point)=>{
        //_this.waterTexture.addPoint(point);
      }});
      //_this.faceDetector.init();
      

      vars.loopFunctions.push([(time) => {
        //_this.waterTexture.update();
      }, "ANIMATE_OBJECTS"]);
      
    });

    // this.explode = new Explode();
    //this.overlay = new Overlay(document.querySelector(".overlay"));
    //this.font = new AnimatedFont(document.querySelector(".title"));
    // this.font.write("[t1][o1][o2] muc[h2] te[c1]h[n1]o[l1]ogy[tm] a[l1][a2]a al[n1]uai[m1]i");
    // this.font.write("blo[c1]kc[h1]ain");
    // this.font.write("a[a1][a2][a3][a4]b[b1]c[c1]d[d1][d2]e[e1][e2] fgh[h1][h2]i[i1]jk[k1]l[l1]m[m1][m2]n [n1]o[o1][o2][o3][o4]p[p1]q[q1]r[r1]s[s1] t[t1][t2]u[u1][u2][u3]vw[w1][w2]x[x1][x2] [x3]y[y1]z./?0123456789[tm]");

    this.k = 0;
  }

  onTriggerClick(){

    let s = [
      "[x1]",
      "[u2]",
    ]

    let _this = vars.main;
    // _this.font.animate();
    // _this.overlay.font.write("blo[c1]kc[h1]ain");
    _this.overlay.font.write("[d2]ef[i1]");
    _this.overlay.font.write(s[k]);
    k++;
    // _this.overlay.font.write("w[w1][w2]");
    _this.overlay.font.write("a[l1][a2]a al[n1]uai[m1]i");
    // _this.overlay.font.write("a[a1][a2][a3][a4]b[b1]c[c1]d[d1][d2]e [e1][e2]fgh[h1][h2]i[i1]jk[k1]l[l1]m [m1][m2]n[n1]o[o1][o2][o3][o4]p[p1] q[q1]r[r1]s[s1]t[t1][t2]u[u1][u2][u3] vw[w1][w2]x[x1][x2][x3]y[y1]z./ ?0123456789[tm]");
    // _this.overlay.font.write("[a1][a2][a3][a4][b1][c1][d1][d2] [e1][e2][h1][h2][i1][k1][l1][m1][m2] [n1][o1][o2][o3][o4][p1][q1] [r1][s1][t1][t2][u1][u2][u3][w1] [w2][x1][x2][x3][y1][tm]");
  }

  onTransitionClick(){
    let _this = vars.main;
    current < vars.data.collection.length -1 ? current++ : current = 0;

    _this.overlay.killAll(2000);
    _this.explode.expand(current, ()=>{
       
      _this.overlay.process(current);
       _this.explode.animateProcess(current, ()=>{

        _this.overlay.display(current);
        _this.explode.contract(current, ()=>{});

       });

    });
    

    //_this.explode.animateProcess();
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

      if(_this.settings.move_camera){

        this.cameraTime++;

        let x = _this.settings.path_radius * Math.cos(this.cameraTime * _this.settings.camera_speed);
        let y = _this.settings.path_radius * Math.sin(2* this.cameraTime * _this.settings.camera_speed) / 2;
        let z = _this.settings.path_radius * .9 * Math.sin(this.cameraTime * _this.settings.camera_speed) + Config.camera.posZ;

        _this.camera.threeCamera.position.set(x,y,z);
        _this.camera.threeCamera.lookAt(_this.scene.position);
      }

      for (var i in vars.loopFunctions){
        vars.loopFunctions[i][0](time, delta);
      }
    }
  }
}