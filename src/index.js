import Detector from '@/js/utils/detector';
import Main from '@/js/app/main';

// Test import of styles
import '@/styles/index.scss';

function init(){
    //Check for webGL capabilities
    if(!Detector.webgl){
        Detector.addGetWebGLMessage();
    } else {
        const container = document.getElementById("root");
        new Main(container);
    }
}

init();