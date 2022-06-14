export default{
    removeFromLoop: (fx) => {
        const loopFunctions = vars.loopFunctions;
        for (var i in loopFunctions)
          if (loopFunctions[i][1] === fx) loopFunctions.splice(i, 1);
    },

    activateSection: (ID) => {
        let vids = document.querySelectorAll(ID+" video");
        for(var i=0; i<vids.length; ++i){
            let video = vids[i];
            let promise = video.getAttribute("data-playpromise");

            if( promise != "true"){
                let playPromise = video.play();
                if( playPromise != undefined ){
                    playPromise.then(()=>{
                    video.setAttribute("data-playpromise", "true");
                    }).catch((error)=>{
                    console.log("video could not play!");
                    })
                }
            }
        }
    },

    deactivateSection: (ID) => {
        let vids = document.querySelectorAll(ID+" video");
        for(var i=0; i<vids.length; ++i){
            let video = vids[i];
            let promise = video.getAttribute("data-playpromise");
            if(promise == "true"){
                video.pause();
                video.setAttribute("data-playpromise", "false");
            }
        }
    }
}