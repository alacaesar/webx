export default{
    removeFromLoop: (fx) => {
        const loopFunctions = vars.loopFunctions;
        for (var i in loopFunctions)
          if (loopFunctions[i][1] === fx) loopFunctions.splice(i, 1);
    },

    // easing
    easeOutSine: (t, b, c, d) => {
        return c * Math.sin((t/d) * (Math.PI/2)) + b;
    },
    easeOutQuad: (t, b, c, d) => {
        t /= d;
        return -c * t * (t - 2) + b;
    },

    // random between 2 values
    lerp: (a,b,t) => {
        return a*(1-t)+b*t;
    },
    rand: (a,b) => {
        return a + (b-a)*Math.random();
    }
}