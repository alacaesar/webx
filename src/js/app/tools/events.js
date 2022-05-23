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

  }
}