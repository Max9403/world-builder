export default {
  id: "add",
  name: "Add",
  outputs: {
    "value":{
      id: "sum",
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
    return {sum: (left || 0) + (right || 0)};
  }
}
