export default {
  id: "subtract",
  name: "Subtract",
  outputs: {
    "diffirence":{
      id: "diffirence",
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
  calculate(item, {left, right}) {
    return {diffirence: (left || 0) - (right || 0)};
  }
}
