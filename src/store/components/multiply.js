export default {
  id: "multiply",
  name: "Multiply",
  outputs: {
    "product":{
      id: "product",
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
    return {product: (left || 0) * (right || 0)};
  }
}
