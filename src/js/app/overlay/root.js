import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';

import vars from "../tools/vars";
import fx from "../tools/fx";

gsap.registerPlugin(ScrollTrigger);

let body, header, logoHolder, _this;

export default class Root {
    constructor() {

        _this = this;

        this.initText(document);
        this.initObserver();

        body = document.body;
        header = document.querySelector("header");

        logoHolder = document.querySelector("#intro .logo-holder");
    }

    init() {

      body.classList.remove("curtain");

      if(pageType == "home"){
        _this.initHomeScrolls();
        //_this.startCountdown();
        _this.initLinkEvents();
      }
      else{
        document.body.classList.remove("hold");
        _this.initPageCloseEvent();
        if(!vars.isMobile && pageType == "nft")
          _this.initNftScrolls();
      }
      
    }

    initLinkEvents(){
      let internalLinks = document.querySelectorAll("#collection a.link, #interviews a.link");
      internalLinks.forEach((item) => {
        item.addEventListener("click", _this.onInternalLinkClick, false);
      });
    }

    initPageCloseEvent(){
      let pageCloseBtn = document.querySelector("button.close");
      pageCloseBtn.addEventListener("click", _this.onPageCloseClick, false);
    }

    onInternalLinkClick(e){
      e.preventDefault();
      body.classList.add("curtain");

      let itemID = e.target.getAttribute("href");
      setTimeout(() => {
        window.location.assign(itemID);
      }, 600);
    }

    onPageCloseClick(e){
      e.preventDefault();
      body.classList.add("curtain");

      let section = "";
      if(pageType == "nft") section = "collection";
      else if(pageType == "interview") section = "interviews";
      
      setTimeout(() => {
        window.location.assign("/#" + section);
      }, 600);
    }

    initNftScrolls(){
      gsap.timeline({
        scrollTrigger: {
          trigger: ".second .inside",
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: ".second .inside .slide",
          anticipatePin: 1,
          pinSpacing: true
        }
      })
      .to(".second .slide ul", {translateX:"-78%", ease:"none"})
      .from(".second .slide ul li:nth-child(3), .second .slide ul li:nth-child(5)", {translateX:"8vw", ease:"none"}, 0);
    }

    initHomeScrolls(){

      var _scroll = gsap.timeline({
        scrollTrigger: {
          trigger:"#intro",
          //pin:"#intro .inside",
          scrub:true,
          start: "top top",
          end: "bottom top+=25%",
          onUpdate: (e) => {
            vars.face.update(e.progress);

            //let k = ( .5 - e.progress ) * 2;
            
            //logoHolder.style.cssText = "opacity:"+ k + "; transform: translateY("+ (-250 * e.progress) +"px) scale("+ (1 + e.progress * .3) +");";
          }
        }
      });

      
        gsap.timeline({
            scrollTrigger: {
              trigger: "#about",
              start: "top+=100 bottom",
              onEnter: ()=>{
                  body.classList.add("scroll");
                  if(!vars.isMobile) header.classList.remove("extended");
                },
              onLeaveBack: ()=>{ 
                  body.classList.remove("scroll");
                  if(!vars.isMobile) header.classList.add("extended");
                }
            }
        });
        

        gsap.timeline({
            scrollTrigger: {
              trigger: "#ngo",
              start: "top bottom",
              end: "bottom-=15% bottom",
              onUpdate: (e) => {
                
                vars.face.update( 1 - e.progress );
                
              }
              /*
              onEnter: ()=>{
                  vars.face.disintegrate(false); 
                  vars.isPauseLoopFunctions = false;
                },
              onLeaveBack: ()=>{
                  vars.face.disintegrate(true); 
                  vars.isPauseLoopFunctions = true; 
                }
                */
            }
        });

        gsap.timeline({
            scrollTrigger: {
              trigger: "#overview",
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              pin: "#overview .inside",
              anticipatePin: 1,
              pinSpacing: true,
              onLeave: ()=> { fx.activateSection("#collection"); },
              onEnterBack: ()=> { fx.deactivateSection("#collection"); }
            }
        })
        .to(".zoom", {scale:1, height:"60vh", width:"50%", left:"50%", translateX:"-50%", translateY:"-20%", ease:"none"})
        .to("ul.grid", {scale:3, ease:"none"}, 0)
        .to("ul.grid li.left", {translateX:"-50%", ease:"none"}, 0)
        .to("ul.grid li.right", {translateX:"180%", ease:"none"}, 0)
        .to("ul.grid li small", {opacity:0, ease:"none", duration: 0.1}, 0);

        if(!vars.isMobile){
          gsap.timeline({
              scrollTrigger: {
                  trigger: "#collection",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: true,
                  pin: "#collection .inside",
                  anticipatePin: 1,
                  onEnter: ()=> { fx.activateSection("#collection"); },
                  onEnterBack: ()=> { fx.activateSection("#collection"); }
              }
          })
          .to("aside.left", {translateY:"-200%", ease:"none"})
          .to("aside.right", {translateY:"0", ease:"none"}, 0);
        }

        gsap.timeline({
          scrollTrigger: {
              trigger: "#designers",
              start: "top top",
              end: "bottom bottom+=20%",
              scrub: true,
              pin: "#designers figure",
              anticipatePin: 1,
              onEnter: ()=> { fx.deactivateSection("#collection"); },
              onLeaveBack: ()=> { fx.activateSection("#collection"); }
          }
      })
      .to("h2", {scale:"1", translateY: ( vars.isMobile ? "100px" : "0" ), fontVariationSettings: "'wght' 200", force3D: false, ease:"none"})
      .to("ul.profiles", {scale:"1", ease:"none"}, 0)
      .to("ul.profiles svg", {rotate:"+=60deg", ease:"none"}, 0);

      gsap.timeline({
        scrollTrigger: {
          trigger: "#designers",
          start: "top+=200 top",
          onEnter: ()=>{
              let des = document.querySelector("#designers");
              des.classList.add("on");
            },
          onLeaveBack: ()=>{ 
              let des = document.querySelector("#designers");
              des.classList.remove("on");
            }
        }
      });

      if(!vars.isMobile){
        gsap.timeline({
          scrollTrigger: {
            trigger: "#interviews",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: "#interviews .inside",
            anticipatePin: 1,
          }
        })
        .to("#interviews .inside ul", {translateX:"-40%", ease:"none"}, 0);
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: "#outro",
          start: "top+=200 bottom",
          end: "bottom+=140 bottom",
          scrub: true,
        }
      })
      .to("#outro .slide", {translateX:"-1600px", ease:"none"});

    }

    initText(ID){
        var textWrappers = ID.querySelectorAll(".off");

        for(var i=0; i<textWrappers.length; ++i){
          const text = textWrappers[i];
    
          if(!text.classList.contains("made")){
            if(text.classList.contains("anim-letters")){
              text.innerHTML = "<span class='word'>" + text.textContent.replaceAll(" ", "</span> <span class='word'>") + "</span>";
              const words = text.querySelectorAll("span.word");
              for(var k=0; k<words.length; ++k){
                words[k].innerHTML = words[k].textContent.replace(/\S/g, "<span class='letter'><span>$&</span></span>");
              }
            }
            else if(text.classList.contains("anim-words")){
              //text.innerHTML = "<span class='letter'><span>" + text.textContent.replaceAll(" ", "</span></span> <span class='letter'><span>") + "</span></span>";
              let arr = text.textContent.split(" ");
              arr = arr.map(n=>n.replaceAll('<$', '<i>').replaceAll('$>', '</i>'));
              text.innerHTML = '<span class="letter"><span>' + arr.join("</span></span> <span class='letter'><span>") + "</span></span>";
            }
          }
        }
    }

    initObserver(){
        let _this = this;
        let options = {
            root: null,
            rootMargin: '0px',
            threshold: .15
        }

        let callback = function (entries, observer) {

            for (var j=0; j<entries.length; ++j) {
                if (entries[j].intersectionRatio > 0) {
                  var elm = entries[j].target;

                  if (!elm.classList.contains('on')) {
                    elm.classList.add("on");
                    if(!elm.classList.contains("wait"))
                        _this.animate(elm);
                  }
                }
            }
        }

        let observer = new IntersectionObserver(callback, options);
        
        let target = document.querySelectorAll('.off');
        for (var i = 0; i < target.length; ++i) {
            observer.observe(target[i]);
        }
    }

    animate(elm){
        elm.style.opacity = 1;
        anime.timeline({loop:false})
        .add({
            targets: elm.querySelectorAll(".letter span"),
            translateY: ['100%',0],
            easing: "easeOutExpo",
            duration: 999,
            delay: (el, i) => 88 * i
        }).add({
            targets: elm,
            translateY: ['40%', 0],
            //scale:[1.2, 1],
            easing: "easeOutCubic",
            duration: 3333,
        }, 0);
    }

    startCountdown(){

      let _d = document.querySelector("#technology .days");
      let _h = document.querySelector("#technology .hours");
      let _m = document.querySelector("#technology .minutes");

      var countDownDate = new Date("Jun 14, 2022 19:30:00").getTime();

      var x = setInterval(function() {

        var now = new Date().getTime();
        var distance = countDownDate - now;
      
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
        _d.innerHTML = ( days < 10 ? "0"+days : days );
        _h.innerHTML = ( hours < 10 ? "0"+hours : hours );
        _m.innerHTML = ( minutes < 10 ? "0"+minutes : minutes );
      
        // If the count down is finished, write some text
        if (distance < 0) {
          clearInterval(x);
        }
      }, 1000);


    }
}