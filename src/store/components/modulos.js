export default {
  id: "modulos",
  name: "Modulos",
  outputs: {
    "modulos":{
      id: "modulos",
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
    return {modulos: left % right};
  }
}
