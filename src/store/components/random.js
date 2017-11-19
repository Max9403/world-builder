export default {
    id: "random",
    name: "Random",
    outputs: {
      "value":{
        id: "value",
        type: "number"
      }
    },
    calculate() {
      return {value: Math.random()};
    }
  }
