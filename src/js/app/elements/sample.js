import * as THREE from 'three';

import vars from "../tools/vars";

// Controls based on orbit controls
export default class Sample {
  constructor() {
    this.scene = vars.main.scene;
    this.init();
  }

  init() {

    const _this = this;
      
    this.box = new THREE.Mesh(
        new THREE.BoxGeometry(30,30,30),
        new THREE.MeshPhongMaterial({color:0xFFFF00})
    );
    this.scene.add(this.box);

    this.sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(60, 3),
        new THREE.MeshBasicMaterial({wireframe:true})
    );
    this.scene.add(this.sphere);

    vars.loopFunctions.push([() => {
        _this.box.rotation.y += .010;
        _this.box.rotation.x += .005;
    }, "ANIMATE_OBJECTS"]);

  }
}