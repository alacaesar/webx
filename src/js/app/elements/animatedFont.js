import anime from 'animejs';
import font from './font';

export default class AnimatedFont {
  constructor(dom) {

    this.dom = dom;
    this.init();

  }

  init() {

    const _this = this;

  }

  write(text){
    this.dom.innerHTML = "<span class='word'>" + text.replaceAll(" ", "</span> <span class='word'>") + "</span>";

    let match = text.match(/([^[]+(?=]))/g);
    let k = 0;
    let last = "";
    const words = this.dom.querySelectorAll("span.word");
    for(let i=0; i<words.length; ++i){
        let word = words[i].textContent;
        
        word = word.replace(/([^[]+(?=]))/g, "$").replaceAll("[","").replaceAll("]","");
        
        let letters = word.split("");
        
        let html = "";
        for(let j=0; j<letters.length; ++j){
            if(letters[j] == "$"){
                let _class = "";
                if(last == "a") _class = "kern";
                html += `<span class="letter aa ${_class}"><span data-id="${j}">${font[match[k]]}</span></span>`;
                last = "";
                k++;
            }else{
                html += `<span class="letter nn"><span data-id="${j}">${letters[j].toUpperCase()}</span></span>`;
                last = letters[j];
            }
        }
        words[i].innerHTML = html;
    }

    this.animate();
  }

  animate(){
    this.dom.style.opacity = 1;

    let nn =  this.dom.querySelectorAll(".letter span");
    nn.forEach((el, i) => {
        if( !el.parentNode.classList.contains("aa") ){
            if(i == 0){
                el.style.transform =  "translateX("+ (Math.random() * -300) + "%)";
            }else if(i == nn.length - 1){
                el.style.transform =  "translateX("+ (Math.random() * 300) + "%)";
            }
            else{
                el.style.transform =  "translateY("+ ((Math.random()-.5) * 400) + "%)";
            }
            el.style.opacity = 0;
        }
    });

    anime.timeline({loop:false})
    .add({
        targets: this.dom.querySelectorAll(".letter.aa span"),
        opacity: [0, 1],
        scale: [1.5, 1],
        easing: "easeOutCubic",
        duration: 777,
        delay: (el, i) => Math.random() * 333 + 333
    })
    .add({
        targets: nn,
        opacity: 1,
        easing: "easeInOutExpo",
        duration: 333,
        delay: (el, i) => Math.random() * 1111 + 333
    })
    .add({
        targets: nn,
        translateY: 0,
        translateX: 0,
        easing: "easeInOutCubic",
        duration: 1666,
        delay: (el, i) => Math.random() * 1111 + 333
    }, 1000);
  }
}