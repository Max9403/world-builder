import Vue from 'vue'

import customConstant from '../../components/extras/constant.vue'

Vue.component("builder:extra-constant", customConstant);

export default {
  id: "constant",
  name: "Constant",
  outputs: {
    "value":{
      id: "value",
      type: "dynamic"
    }
  },
  custom: "builder:extra-constant",
  staticIzer(item) {
    return (item.data && item.data.type) || "dynamic";
  },
  calculate(item) {
    return {value: (item.data && item.data.value) || 0};
  }
}
