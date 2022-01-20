export default{
    removeFromLoop: (fx) => {
        const loopFunctions = vars.loopFunctions;
        for (var i in loopFunctions)
          if (loopFunctions[i][1] === fx) loopFunctions.splice(i, 1);
    },
}