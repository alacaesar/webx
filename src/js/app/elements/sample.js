import * as THREE from 'three';

import vars from "../tools/vars";

let pixels = [];

const param = {
  planeSize: 500,
  pixelRes: 30,
  elevation: 30,
}

// Controls based on orbit controls
export default class Sample {
  constructor() {
    this.scene = vars.main.scene;
    this.init();
  }

  init() {

    const _this = this;

    const foxImage = new THREE.TextureLoader().load('/fox.jpg');
          foxImage.encoding = THREE.sRGBEncoding;

    const loader = new THREE.ImageLoader();
          loader.load(
            '/fox.jpg',

            function(image){
              const canvas = document.createElement( 'canvas' );
                    canvas.setAttribute("class", "preview");
                    canvas.width = param.pixelRes;
                    canvas.height = param.pixelRes;
              const context = canvas.getContext( '2d' );
              context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height, );

              document.body.appendChild(canvas);

              _this.addPixels( context );
            },
            undefined,
            function(){
              console.error("Image could not be loaded");
            }
          );

    this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(param.planeSize, param.planeSize),
        new THREE.MeshBasicMaterial({
          map: foxImage,
        })
    );
    this.scene.add(this.plane);

    this.sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(param.planeSize * .3, 3),
        new THREE.MeshBasicMaterial({wireframe:true})
    );
    this.scene.add(this.sphere);

    vars.loopFunctions.push([() => {
        //_this.box.rotation.y += .010;
    }, "ANIMATE_OBJECTS"]);

  }

  addPixels( c ){

    const psize = param.planeSize/param.pixelRes;

    const pixelGeometry = new THREE.BoxGeometry(psize, psize, 1);

    for(var i=0; i< Math.pow(param.pixelRes, 2); ++i){
      
      const x = i - param.pixelRes * Math.floor( i/param.pixelRes );
      const y = Math.floor( i/param.pixelRes );
      const z = param.elevation;

      let p = c.getImageData(x, y, 1, 1).data;

      const color = 'rgb('+p[0]+','+p[1]+','+p[2]+')';

      const pixel = new THREE.Mesh(
        pixelGeometry, 
        new THREE.MeshBasicMaterial({color:color, depthWrite:false})
        );

      pixel.position.set(x * psize - param.planeSize * .5, -y * psize + param.planeSize * .5, z);
      pixels.push(pixel);
      this.scene.add(pixel);
    }
    this.randomize();
  }

  randomize(){
    const _this = this;
    for(var i=0; i<pixels.length; ++i){
      if(Math.random() > .6){
        pixels[i].visible = false;
      }else{
        pixels[i].visible = true;
      }
    }
    setTimeout(function(){ _this.randomize(); }, Math.random() * 2000);
  }
}