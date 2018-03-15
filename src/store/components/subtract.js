export default {
  id: "subtract",
  name: "Subtract",
  outputs: {
    "difference":{
      id: "difference",
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
  calculate(item, {left = 0, right = 0} = {}) {
    return {difference: left - right};
  }
}
