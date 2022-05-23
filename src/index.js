import Detector from '@/js/utils/detector';
import Main from '@/js/app/main';
import Root from '@/js/app/overlay/root';
import Builder from '@/js/app/overlay/builder';

// Test import of styles
import '@/styles/index.scss';

function init(){
    //Check for webGL capabilities
    if(!Detector.webgl){
        Detector.addGetWebGLMessage();
    } else {
        const container = document.getElementById("root");
        new Main(container);
        const root = new Root();

        new Builder(root.init);
    }
}

init();