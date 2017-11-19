export default
   {
    id: "global",
    name: "Global",
    outputs: {
      "value":{
        id: "value",
        type: "dynamic"
      }
    },
    custom: "builder:extra-constant",
    staticIzer() {
      return "dynamic";
    },
    calculate(item, _, globals) {
      return {value: (item.data && item.data.value && globals[item.data.value]) || 0};
    }
  }
