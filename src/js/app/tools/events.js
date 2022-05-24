import * as THREE from 'three';import vars from "./vars";
import anime from 'animejs';
import Plyr from 'plyr';

// Controls based on orbit controls
export default class Events {
  constructor() {
    // do nothing;
  }

  init() {
      
    window.addEventListener("blur", () => { vars.isPaused = true; });
    window.addEventListener("focus", () => {
          vars.isPaused = false; 
          vars.main.render();
    });

    document.addEventListener("mousemove", (e)=> this.onMouseMoveHandler(e), false);

    document.querySelector(".menuTrigger").addEventListener("click", (e)=>{
      document.querySelector("header").classList.toggle("extended"); 
    });
    
    let videoTrigger = document.querySelector(".video");
    let videoClose = document.querySelector(".player .close");
    let player = document.querySelector(".player");
    let vid = player.querySelector("video");
    
    videoTrigger.addEventListener("click", ()=>{
      let rect = videoTrigger.getBoundingClientRect();

      player.style.cssText = "display:block; clip-path: circle("+ (rect.width * .4) +"px at 50% "+ (rect.top + rect.height * .5) +"px )";
      vid.play();
      anime({
        targets: '.player',
        easing: 'easeInCubic', 
        keyframes: [
            {clipPath: "circle("+ (rect.width * .4) +"px at 50% "+ (rect.top + rect.height * .5) +"px )" }, // start frame
            {clipPath: "circle( 2000px at 50% "+ (rect.top + rect.height * .5) +"px )" }, // end frame
        ],
        duration: 1400,
        complete: ()=>{ document.body.classList.add("player-open"); }
      });

    });

    videoClose.addEventListener("click", ()=>{

      let rect = videoTrigger.getBoundingClientRect();

      let _y, _s;

      if( rect.top > -300 && rect.top < vars.windowSize.height ){
        _y = (rect.top + rect.height * .5);
        _s = (rect.width * .5);
      }else{
        _y = "50%";
        _s = "0px";
      }

      player.style.cssText = "display:block; clip-path: circle( 2000px at 50% "+ _y +"px )";

      anime({
        targets: '.player',
        easing: 'easeOutCubic', 
        keyframes: [
            {clipPath: "circle( 2000px at 50% "+ _y +"px )" }, // start frame
            {clipPath: "circle( "+ _s +"px at 50% "+ _y +"px )" }, // end frame
        ],
        duration: 1200,
        complete: ()=>{ 
          document.body.classList.remove("player-open");
          vid.pause();
          vid.currentTime = 0;

          player.style.cssText = "";
        }
      });
      
    });



    this.plyr = new Plyr("#plyr", {
      controls:['play','progress']
    });


    this.panAnimation();

  }

  onWindowResize(){
    
    if( vars.windowSize.width < 1000){
      vars.isMobile = true;
      document.body.classList.add("mobile");
    }else{
      vars.isMobile = false;
      document.body.classList.remove("mobile");
    }
  }

  onMouseMoveHandler(e){
    vars.mouseCoords = {
      x:(e.clientX-vars.windowSize.width * .5) / vars.windowSize.width, 
      y:(e.clientY-vars.windowSize.height * .5) / vars.windowSize.height
    };
  }

  panAnimation(){
    vars.loopFunctions.push([() => {

      const scene = vars.scene;
      const plane = vars.plane;

      scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, (vars.mouseCoords.x * Math.PI) / 10, 0.05);
      scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, (vars.mouseCoords.y * Math.PI) / 10, 0.07);

      plane.rotation.y = THREE.MathUtils.lerp(plane.rotation.y, (vars.mouseCoords.x * Math.PI) / 40, 0.05);
      plane.rotation.x = THREE.MathUtils.lerp(plane.rotation.x, (vars.mouseCoords.y * Math.PI) / 40, 0.05);

      //_this.box.rotation.y += .010;
  }, "PAN_ANIMATION"]);
  }

  
}