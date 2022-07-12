import vars from "./vars";

// Controls based on orbit controls
export default class Events {
  constructor() {
    // do nothing;
  }

  init() {
      
    window.addEventListener("blur", () => { vars.isPaused = true; });
    window.addEventListener("focus", () => {
          vars.isPaused = false; 
          vars.main.render();
    });

    window.addEventListener("mousemove", this.updateMouseEvents, false);

    let button = document.querySelector(".trigger");
    button.addEventListener("click", (e) => { vars.main.onTriggerClick(); }, false);

  }

  updateMouseEvents(e) {
    vars.mouse.x = e.clientX / vars.width;
    vars.mouse.y = e.clientY / vars.height;

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