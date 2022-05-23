import * as THREE from 'three';
import anime from 'animejs';

import vars from "../tools/vars";

let pixels = [], plane, plane2;

const param = {
  planeSize: 500,
  pixelRes: 30,
  elevation: 30,
}

let wires = false;

export default class Face {
    constructor() {
      this.scene = vars.main.scene;
      this.init();
    }
  
    init() {

        const _this = this;

        // create picture plane
        plane2 = new THREE.Mesh(
            new THREE.PlaneGeometry(param.planeSize, param.planeSize),
            new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                opacity: 0.5,
                transparent: 0,
            })
        );
        //this.scene.add(plane2);


        // create picture plane
        plane = new THREE.Mesh(
            //new THREE.PlaneGeometry(param.planeSize, param.planeSize),
            new THREE.SphereGeometry(param.planeSize, 16, 8, 1.07, 1, 0.98, 1.2),
            new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                opacity: 0.0,
                transparent: 0,
            })
        );
        plane.position.z = -param.planeSize;
        this.scene.add(plane);
        
        vars.plane = plane;

        // create pixels
        const psize = param.planeSize/param.pixelRes;
        const pixelGeometry = new THREE.BoxGeometry(psize, psize, 3);
            pixelGeometry.colorsNeedUpdate = true;

        for(var i=0; i< Math.pow(param.pixelRes, 2); ++i){
      
            const x = i - param.pixelRes * Math.floor( i/param.pixelRes );
            const y = Math.floor( i/param.pixelRes );
            const z = param.elevation;

            const xpos = x * psize - param.planeSize * .5;
            const ypos = -y * psize + param.planeSize * .5;
            const zpos = z;
      
            const pixel = new THREE.Mesh(
              pixelGeometry, 
              new THREE.MeshBasicMaterial({color:0xFF0000, depthWrite:false, wireframe:wires})
            );            

            pixel._i = Math.floor( Math.random() * 10 ); //id
            pixel._c = [x, y]; //row/colum pos
            pixel._p = [xpos, ypos, zpos];// position in space
            pixel._angle = Math.atan2(ypos - 0, xpos - 0) * THREE.Math.RAD2DEG; // angle in regard to 0,0
            pixel._distance = Math.sqrt( Math.pow((0-xpos), 2) + Math.pow((0-ypos), 2) ); // distance from 0,0
      
            pixel.position.set(xpos, ypos, zpos + 600);
            pixels.push(pixel);
            this.scene.add(pixel);
        }

        //this.randomize(3333);
        //this.refresh("assets/animals/mink.jpg", ()=>{ _this.build(); });
    }

    update(p){

        for(var i=0; i<pixels.length; ++i){
            let pixel = pixels[i];
            let angle = pixel._angle * THREE.Math.DEG2RAD;

            plane.material.opacity = (1-p) * .9 + .1;
            plane.position.z = - param.planeSize - (120 * p);

            let nnn = pixel._angle;

            if(pixel._p[0] < 0 && pixel._p[1] > 0){
                nnn = pixel._angle - 90;
            }else if(pixel._p[0] > 0 && pixel._p[1] > 0){
                nnn = pixel._angle * -1;
            }else if(pixel._p[0] > 0 && pixel._p[1] < 0){
                nnn = pixel._angle * -1;
            }else{
                nnn = pixel._angle + 90;
            }
            
            pixel.rotation.z = nnn * THREE.Math.DEG2RAD * p * .5;
            //pixel.rotation.x = nnn * THREE.Math.DEG2RAD * p * .5;

            pixel.position.set(
                pixel._p[0] + Math.cos(angle) * pixel._distance * 1.5 * p,
                pixel._p[1] + Math.sin(angle) * pixel._distance * 1.5 * p,
                pixel._p[2] + pixel._distance * 1.5 * p,
            );
        }

    }

    disintegrate(fixed){

        if(fixed){

            vars.isPauseGlitch = true;
            
            for(var i=0; i<pixels.length; ++i){
                let pixel = pixels[i];

                let angle = Math.atan2(pixel.position.y - 0, pixel.position.x - 0);
                let distance = Math.sqrt( Math.pow((0-pixel.position.x), 2) + Math.pow((0-pixel.position.y), 2) );

                anime({
                    targets: pixel.position,
                    x: pixel.position.x + Math.cos(angle) * distance * 1.5,
                    y: pixel.position.y + Math.sin(angle) * distance * 1.5,
                    z: -distance + param.elevation * 2, //Math.max(param.elevation, distance * 1.5),
                    easing: "easeOutQuint",
                    delay: 33 * pixels[i]._i,
                    duration: 3999,
                })

                anime({
                    targets: plane.material,
                    opacity: [1.0, 0.1],
                    easing: 'easeOutQuint',
                    duration: 3999,
                    delay: 555,
                });

                anime({
                    targets: plane.position,
                    z: [-param.planeSize, -param.planeSize-100],
                    easing: 'easeOutQuint',
                    duration: 4999,
                })

            }
        }else{

            vars.isPauseGlitch = false;

            for(var i=0; i<pixels.length; ++i){
                let pixel = pixels[i];

                anime({
                    targets: pixel.position,
                    x: pixel._p[0],
                    y: pixel._p[1],
                    z: pixel._p[2],
                    easing: "easeOutCubic",
                    delay: 33 * pixels[i]._i,
                    duration: 1999,
                })

                anime({
                    targets: plane.material,
                    opacity: [0.1, 1.0],
                    easing: 'easeOutCubic',
                    duration: 1999,
                    delay: 555,
                });

                anime({
                    targets: plane.position,
                    z: [-param.planeSize-100, -param.planeSize],
                    easing: 'easeOutCubic',
                    duration: 1999
                })

            }

        }
    }

    refresh(img, doneCallback, imageLoadedCallback) {
        const texture = new THREE.TextureLoader().load(img);
            texture.encoding = THREE.sRGBEncoding;
        
        plane.material = new THREE.MeshBasicMaterial({ map: texture, transparent:true, opacity:1.0, side:THREE.DoubleSide });
        plane2.material = new THREE.MeshBasicMaterial({ map: texture, transparent:true, opacity:1.0 });
        
        const loader = new THREE.ImageLoader();
            loader.load(
                img,

                function(image){

                    if(imageLoadedCallback) imageLoadedCallback();

                    const canvas = document.createElement( 'canvas' );
                        canvas.setAttribute("class", "preview");
                        canvas.width = param.pixelRes;
                        canvas.height = param.pixelRes;
                    const context = canvas.getContext( '2d' );
                        context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height, );

                    for(var i=0; i<pixels.length; ++i){
                        let c = pixels[i]._c;
                        let p = context.getImageData(c[0], c[1], 1, 1).data;

                        const color = 'rgb('+p[0]+','+p[1]+','+p[2]+')';

                        pixels[i].material = new THREE.MeshBasicMaterial({color:color});
                    }

                    if(doneCallback) doneCallback();
                },

                undefined,

                () => console.error("Image not loaded")
            );
    }

    build(callback) {
        for(var i=0; i< Math.pow(param.pixelRes, 2); ++i){
            anime({
                targets: pixels[i].position,
                z: [600, param.elevation],
                easing: "easeOutCubic",
                duration: 1999,
                delay: 99 * pixels[i]._i,
            })
        }

        anime({
            targets: plane.material,
            opacity: [0.0, 1.0],
            easing: 'linear',
            duration: 1999,
            delay: 777,
        });

        anime({
            targets: plane.position,
            z: [-param.planeSize-150, -param.planeSize],
            easing: 'easeOutCubic',
            duration: 2999
        })

        anime({
            targets: plane.rotation,
            x: [5 * THREE.Math.DEG2RAD, 0],
            easing: 'easeInOutCubic',
            duration: 3999,
            complete: ()=> { if(callback) callback(); }
        })
    }

    randomize(delay) {
        const _this = this;

        if(!vars.isPauseGlitch){
            for(var i=0; i<pixels.length; ++i){
            if(Math.random() > .6){
                pixels[i].visible = false;
            }else{
                pixels[i].visible = true;
            }
            }
            setTimeout(function(){ _this.randomize(0); }, delay > 0 ? delay : 1000 + Math.random() * 3000 );
        }
    }
}