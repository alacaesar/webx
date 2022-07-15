import vars from "./vars";

// Controls based on orbit controls
export default class Events {
  constructor() {
    // do nothing;
  }

  init() {
      
    window.addEventListener("blur", () => { vars.isPaused = true; });
    window.addEventListener("focus", () => {
      if(vars.isPaused){
          vars.isPaused = false; 
          vars.main.render();
      }
    });

    window.addEventListener("mousemove", this.updateMouseEvents, false);

  }

  updateMouseEvents(e) {
    vars.mouse.x = (e.clientX / vars.width) * 2 - 1;
    vars.mouse.y = - (e.clientY / vars.height) * 2 + 1;

    vars.mouse.vX = vars.mouse.x - vars.mouse.prevX;
    vars.mouse.vY = vars.mouse.y - vars.mouse.prevY;


    vars.mouse.prevX = vars.mouse.x
    vars.mouse.prevY = vars.mouse.y;

    if(!vars.isPaused){
      for (var i in vars.mouseMoveFunctions){
        vars.mouseMoveFunctions[i][0](vars.mouse);
      }
    }

  }

}