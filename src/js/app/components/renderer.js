import * as THREE from 'three';

import Config from '../../data/config';
import vars from '../tools/vars';

// Main webGL renderer class
export default class Renderer {
  constructor(scene, container) {
    // Properties
    this.scene = scene;
    this.container = container;

    // Create WebGL renderer and set its antialias
    this.threeRenderer = new THREE.WebGLRenderer({powerPreference: "high-performance", antialias: true});
    this.threeRenderer.outputEncoding = THREE.sRGBEncoding;
    this.threeRenderer.xr.enabled = true;

    // Set clear color to fog to enable fog or to hex color for no fog
    this.threeRenderer.setClearColor(scene.fog.color);
    this.threeRenderer.setPixelRatio(window.devicePixelRatio); // For retina

    // Appends canvas
    container.appendChild(this.threeRenderer.domElement);

    // Shadow map options
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Get anisotropy for textures
    Config.maxAnisotropy = this.threeRenderer.capabilities.getMaxAnisotropy();

    // Initial size update set to canvas container
    this.updateSize();

    // Listeners
    if (document.readyState !== 'loading') {
      this.updateSize();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
    }
    window.addEventListener('resize', () => this.updateSize(), false);
  }

  updateSize() {
    vars.windowSize = {width:window.innerWidth, height:window.innerHeight};
    vars.main.events.onWindowResize();
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(scene, camera) {
    // Renders scene to canvas target
    //this.threeRenderer.autoClear = true;
    this.threeRenderer.clear();
    this.threeRenderer.clearDepth();
    this.threeRenderer.render(scene, camera);
  }
}
