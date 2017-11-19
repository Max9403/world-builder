import Vue from 'vue'
import Vuex from 'vuex'
// import _ from 'lodash'
import uuid from 'uuid/v4'

import config from '../config'
import components from './components'

Vue.use(Vuex);

let state = {
    components,
    flow: {},
    settings: { show: 'heightmap', border: true, resolution: 513, tiles: {horizontal: 1, vertical: 1}}
};
let mutations = {
    setComponent(state, component) {
        Vue.set(state.components, component.id, component)
    },
    setFlow(state, flow) {
      if (!flow.id) {
        flow.id = uuid();
        while (state.flow[name]) flow.id = uuid();
      }
      Vue.set(state.flow, flow.id, flow)
    },
    moveFlow(state, {id, x, y}) {
      let comp;
      if (!(comp = state.flow[id])) return;

      comp.position.x += x;
      comp.position.y += y;
    },
    setFlowData(state, {id, data}) {
      Vue.set(state.flow[id], "data", data);
    },
    bindFlow(state, {input, output}) {
      let inFlow = state.flow[input.component];
      let outFlow = state.flow[output.component];
      if (!inFlow.binding) {
        Vue.set(inFlow, "binding", {output: {}, input: {}});
      }
      if (!outFlow.binding) {
        Vue.set(outFlow, "binding", {output: {}, input: {}});
      }

      let inAr = inFlow.binding.input[input.input] || []
      inAr.push(output)

      Vue.set(inFlow.binding.input, input.input, inAr)

      let outAr = outFlow.binding.output[output.output] || []
      outAr.push(input)

      Vue.set(outFlow.binding.output, output.output, outAr)
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
    replaceFlow(state, flow) {
      state.flow = flow;
    }
};
let getters = {};
let actions = {};

let store = new Vuex.Store({
    // modules: {
    //     site: ModuleSite
    // },
    state,
    mutations,
    getters,
    actions,
    strict: config.env !== "production"
});

window.WorldBuilder = window.WorldBuilder || {}
window.WorldBuilder.store = store;

export default store;
