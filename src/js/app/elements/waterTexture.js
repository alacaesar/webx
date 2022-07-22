import * as THREE from 'three';
import fx from "../tools/fx";

export default class WaterTexture {
  constructor(options) {

    this.size = 64;
    this.radius = this.size * 0.1;
    this.width = this.height = this.size;

    this.points = [];
    this.maxAge = 64;
    this.last = null;

    if(options.debug){
        this.width = window.innerWidth * .3;
        this.height = window.innerHeight * .3;
        this.radius = this.width * .05;
    }

    this.init();
    if(options.debug) document.body.append(this.canvas);

  }

  init() {

    this.canvas = document.createElement("canvas");
    this.canvas.id = "WaterTexture";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.clear();

    this.texture = new THREE.Texture(this.canvas);

  }

  addPoint(point){
    /*
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;

    if(last){
        const relativeX = point.x - last.x;
        const relativeY = point.y - last.y;

        //distance formula
        const distanceSquared = relativeX * relativeX + relativeY * relativeY;
        const distance = Math.sqrt(distanceSquared);

        vx = relativeX / distance;
        vy = relativeY / distance;

        force = Math.min(distanceSquared * 10000, 1.);
    }

    this.last = {
        x: point.x,
        y: point.y
    }
    */
    this.points.push({x: point.x, y: point.y, age: 0});
  }

  /*
  drawPoint(point){

    let pos = {
        x: point.x * this.width,
        y: point.y * this.height
    }
    const radius = this.radius;
    const ctx = this.ctx;

    let intensity = 1.;
    // easing intensity
    if(point.age < this.maxAge * 0.3){
        intensity = fx.easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
    }
    else{
        intensity = fx.easeOutQuad(1-(point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
    }
    intensity += point.force;

    intensity = 1. - point.age / this.maxAge;

    let red = ((point.vx + 1)/2) * 255;
    let green = ((point.vy + 1)/2) * 255;
    let blue = intensity * 255;
    let color = `${red}, ${green}, ${blue}`;

    let offset = this.width * 5.;

    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius * 1;
    ctx.shadowColor = `rgba(${color},${0.8 * intensity})`;

    this.ctx.beginPath();
    this.ctx.fillStyle =`rgba(${color},${0.8 * intensity})`;
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    //this.ctx.rect(pos.x, pos.y, radius * 2, radius*2);
    this.ctx.fill();
  }
  */

  drawPoint(point){
    let pos = {
      x: point.x * this.width,
      y: point.y * this.height
    }
    const radius = this.radius;
    const ctx = this.ctx;

    let intensity = 1.;
    intensity = 1. - point.age / this.maxAge;

    let color = `255,255,255`;
    let offset = this.width * 5.;

    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius * 1;
    ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

    this.ctx.beginPath();
    this.ctx.fillStyle =`rgba(555,0,0,1)`;
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();

  }

  clear(){
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
  }

  /*
  update(){
    this.clear();
    let agePart = 1. / this.maxAge;
    
    this.points.forEach((point,i) => {
        let slowAsOlder = (1. - point.age / this.maxAge);
        let force = point.force * agePart * slowAsOlder;
            point.x += point.vx * force;
            point.y += point.vy * force;

        point.age += 1;
        if(point.age > this.maxAge){
            this.points.splice(i, 1);
        }
    });

    this.points.forEach(point => {
        this.drawPoint(point);
    });

    this.texture.needsUpdate = true;
  }*/

  update(){
    this.clear();
    
    this.points.forEach((point,i) => {
        point.age += 1;
        if(point.age > this.maxAge){
            this.points.splice(i, 1);
        }
    });
    this.points.forEach(point => {
        this.drawPoint(point);
    });
    this.texture.needsUpdate = true;
  }
}