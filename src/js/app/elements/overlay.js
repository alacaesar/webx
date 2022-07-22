import anime from 'animejs';
import fx from '../tools/fx';
import vars from '../tools/vars';
import AnimatedFont from '../elements/animatedFont';
import Typewriter from 'typewriter-effect/dist/core';

let shapes = [
    {name: "plus", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 20V0H11V20H9ZM0 11V9H20V11H0Z" fill="white"/>
    </svg>
    `},
    {name: "box", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15V5H15V15H5Z" fill="white"/>
    </svg>    
    `},
    {name: "disc", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="6" fill="white"/>
    </svg>        
    `},
    {name: "brakets", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16V4H9V6H6V14H9V16H4Z" fill="white"/>
    <path d="M16 16V4H11V6H14V14H11V16H16Z" fill="white"/>
    </svg>        
    `},
    {name: "triangle", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4L16.0622 14.5H3.93782L10 4Z" fill="white"/>
    </svg>        
    `},
    {name: "glitch", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 11V3H11V11H5Z" fill="white"/>
    <path d="M9 17V9H15V17H9Z" fill="white"/>
    </svg>        
    `},
    {name: "target", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.2218 6.36352L16.364 2.22138L17.7782 3.6356L13.636 7.77773L12.2218 6.36352ZM2.22183 3.6356L3.63604 2.22138L7.77817 6.36352L6.36396 7.77773L2.22183 3.6356Z" fill="white"/>
    <path d="M7.55649 13.4939L3.41436 17.636L2.00015 16.2218L6.14228 12.0797L7.55649 13.4939ZM17.5565 16.2218L16.1423 17.636L12.0001 13.4939L13.4144 12.0797L17.5565 16.2218Z" fill="white"/>
    </svg>        
    `},
    {name: "focals", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6.5" cy="6.5" r="3.5" fill="white"/>
    <circle cx="13.5" cy="13.5" r="3.5" fill="white"/>
    </svg>
    `},
    {name: "pixels", 
    shape:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6V1H6V6H1Z" fill="white"/>
    <path d="M5 10V5H10V10H5Z" fill="white"/>
    <path d="M14 19V14H19V19H14Z" fill="white"/>
    <path d="M1 19V14H6V19H1Z" fill="white"/>
    </svg>    
    `},
];

let qtext = "cute robot riding skate board voxelized morning";
let loader = ["—",'\\','|','/'];
let progress = ["..",'....','......','........'];
let loaderCount = 0;

let dots;

export default class Overlay {
  constructor(dom) {

    this.dom = dom;
    this.qEl = this.dom.querySelector(".query span");
    this.qT = this.dom.querySelector(".query h2");
    this.qArray = qtext.split(" ");
    this.textWrapper = this.dom.querySelector(".definition p");
    this.title = this.dom.querySelector(".title");

    this.init();

  }

  init() {
    const _this = this;
    
    this.initDots();
    this.initFont();
    this.typewriter = new Typewriter(this.dom.querySelector(".input p"), {cursor:"█", delay:75, deleteSpeed:2});
    //this.display(0);
    
  }

  killAll(delay){
    let delayTime = delay || 0;
    let _this = this;
    setTimeout(()=>{
      clearTimeout(_this.queryTimeout);
      _this.textWrapper.innerHTML = "";
      _this.title.innerHTML = "";
      _this.qEl.innerHTML = "";
      _this.qT.innerHTML = "^// WAITING";
      this.dom.querySelector(".input p .Typewriter__wrapper").innerHTML = "";

    }, delayTime);
    
  }

  display(current){
    
    this.initText(vars.data.collection[current].definition);
    this.dom.classList.remove('processing');

    // this.font.write("a[a1][a2][a3][a4]b[b1]c[c1]d[d1][d2]e[e1][e2] fgh[h1][h2]i[i1]jk[k1]l[l1]m[m1][m2]n [n1]o[o1][o2][o3][o4]p[p1]q[q1]r[r1]s[s1] t[t1][t2]u[u1][u2][u3]vw[w1][w2]x[x1][x2] [x3]y[y1]z./?0123456789[tm]");
    // this.font.write("[t1][o1][o2] muc[h2] te[c1]h[n1]o[l1]ogy[tm]");
    // this.font.write("blo[c1]kc[h1]ain");
    // this.font.write("spa[t1][i1]al a[u1]dio");
    // this.font.write("e[x1]ten[d1]ed r[e1]ali[t1]y");

  }

  process(current){
    this.dom.classList.add('processing');

    this.typewriter
      .typeString(vars.data.collection[current].definition)
      .pauseFor(150)
      .start();

    this.font.write(vars.data.collection[current].term);
    qtext = vars.data.collection[current].query;
    this.initQuery();

  }

  initFont(){
    this.font = new AnimatedFont(this.title);
    
  }

  initText(text){
    let _this = this;
    const _text = text;
    let arr = _text.split(" ");
        arr = arr.map(n=>n.replaceAll('<$', '<i>').replaceAll('$>', '</i>'));
        _this.textWrapper.innerHTML = '<span class="letter"><span>' + arr.join("</span></span> <span class='letter'><span>") + "</span></span>";

    anime.timeline({loop:false})
        .add({
            targets: _this.textWrapper.querySelectorAll(".letter span"),
            translateY: ['100%',0],
            easing: "easeOutExpo",
            duration: 999,
            delay: (el, i) => 88 * i
        });
  }

  initQuery(){
    let _this = this;
    let length = this.qArray.length < 5 ? this.qArray.length : 5;

    let qhtml = "<br>";
    for(let i=0; i<length; ++i){
        qhtml += `${this.qArray[i]}<br>`;
    }

    this.qEl.innerHTML = qhtml;
    this.qT.innerHTML = ':$ QUERY .......... ' + loader[loaderCount];

    loaderCount < loader.length-1 ? loaderCount++ : loaderCount=0;

    this.qArray.push(this.qArray[0]);
    this.qArray.shift();

    this.queryTimeout = setTimeout(()=>{ _this.initQuery() }, 500);
  }

  initDots(){
    dots = this.dom.querySelectorAll('.dot');
    dots.forEach((el, i) => {
        el.innerHTML = shapes[i].shape;
    });
    this.randomizeDots();
  }

  randomizeDots(){
    let _this = this;
    dots.forEach((el, i) => {
        el.classList.remove("flash");
        if(Math.random() < .5){
            el.innerHTML = shapes[Math.floor(fx.rand(0,dots.length))].shape;
            el.classList.add("flash");
        }
    });
    setTimeout(()=>{ _this.randomizeDots() }, Math.random()*1000 + 1000);
  }


}