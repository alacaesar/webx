import * as faceapi from 'face-api.js';
import "regenerator-runtime/runtime.js";

import vars from '../tools/vars';

let videoElement;
let opts = {};

export default class FaceDetector {
    constructor(options) {
        opts = options;
    }

    init(){

        this.initCam();

    }

    async initCam(){

        const stream = await navigator.mediaDevices.getUserMedia({ video:{} });

        let div = document.createElement("div");
            div.classList.add("detector");

        videoElement = document.createElement("video");
        videoElement.muted = true;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.addEventListener("onloadmediadata", this.onPlay());
        videoElement.srcObject = stream;
        div.appendChild(videoElement);

        this.canvas = document.createElement("canvas");
        div.appendChild(this.canvas);

        document.body.appendChild(div);

        this.setFaceDetectorOptions();
        this.loadFaceDetectorModel();

        //vars.loopFunctions.push([this.onPlay, "PLAY_WEBCAM"]);
        
    }

    async onPlay(){

        const _this  = this;

        if( videoElement.paused || videoElement.ended || !faceapi.nets.tinyFaceDetector.params )
            return setTimeout(() => this.onPlay())

        const result = await faceapi.tinyFaceDetector(videoElement, this.options);

        if(result.length > 0){
            const dims = faceapi.matchDimensions(this.canvas, videoElement, true);
            faceapi.draw.drawDetections(this.canvas, faceapi.resizeResults(result, dims));


            result.forEach((r) => {
                const box = r.box;
                const dims = r.imageDims;

                let point = {};
                point.x = (box.x + box.width * .5) / dims.width;
                point.y = (box.y + box.height * .5) / dims.height;

                opts.onResults(point);

            });

        }else{
            // do nothing
        }

        setTimeout(() => this.onPlay(), 1000/27)
    }

    setFaceDetectorOptions(){
        let scoreThreshold = .5,
            inputSize = 128;
        
        this.options = new faceapi.TinyFaceDetectorOptions({ inputSize: inputSize, scoreThreshold: scoreThreshold });
    }

    async loadFaceDetectorModel(){
        await faceapi.nets.tinyFaceDetector.load('/tiny/');
    }
}