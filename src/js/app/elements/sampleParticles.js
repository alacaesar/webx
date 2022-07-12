import * as THREE from 'three';

import vertex from '../shaders/vertex';
import fragment from '../shaders/fragment';

import vars from "../tools/vars";

// Controls based on orbit controls
export default class Sample {
  constructor() {
    this.scene = vars.main.scene;
    this.init();

  }

  init() {

    const _this = this;

    this.time = 0;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        uMouse: { type: "v2", value: new THREE.Vector2() },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },

      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    this.geometry = new THREE.BufferGeometry();

    let num = 1000;
    
    let positions = new Float32Array(num*3);
    let angle =  new Float32Array(num);
    let life =  new Float32Array(num);

    for(var i=0; i<num; ++i){
      positions.set(
        [Math.random(), Math.random(), Math.random()], 
        3*i
      );

      angle.set(
        [Math.random()*Math.PI*2],
        i
      )

      life.set(
        [4 + Math.random()*10],
        i
      )
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("angle", new THREE.BufferAttribute(angle, 1));
    this.geometry.setAttribute("life", new THREE.BufferAttribute(life, 1));

    
    this.dots = new THREE.Points(
        this.geometry,
        this.material,
    );
    this.scene.add(this.dots);

    this.sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(60, 3),
        new THREE.MeshBasicMaterial({wireframe:true})
    );
    this.scene.add(this.sphere);

    
    vars.loopFunctions.push([(time) => {
      
      _this.time += 0.03;
      _this.material.uniforms.time.value = _this.time;
      _this.material.uniforms.uMouse.value = new THREE.Vector2(vars.mouse.x, vars.mouse.y);

    }, "ANIMATE_OBJECTS"]);
  }
}