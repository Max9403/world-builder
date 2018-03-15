export default {
  id: "render",
  name: "Heightmap",
  inputs: {
    height: {
      id: "height",
      type: "number"
    }
  },
  calculate(item, {height = 0} = {}) {
    return height;
  }
}
