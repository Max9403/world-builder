export default {
  id: "divide",
  name: "Divide",
  outputs: {
    "division":{
      id: "division",
      type: "number"
    }
  },
  inputs: {
    left: {
      id: "left",
      type: "number"
    },
    right: {
      id: "right",
      type: "number"
    }
  },
  calculate(item, {left = 0, right = 1} = {}) {
    return {division: left / right};
  }
}
