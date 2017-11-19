<template>
  <div>
  <input type="text" class="value" placeholder="Some value" @input="updatedValue" :value="item.data && item.data.raw"/>
  </div>
</template>

<style lang="scss">
  .value {
    width: 100%;
  }
</style>

<script>
  import eventBus from '../../event-bus'

  export default {
    props: ["item"],
    data() {
      return {}
    },
    methods: {
      updatedValue(e) {
        let parsers = [
          () => "dynamic",
          value => value.trim() ? "string" : undefined,
          value => {try { JSON.parse(value); return "object"; } catch (e) { return undefined }},
          value => isNaN(parseFloat(value)) ? undefined : "number",
        ]
        let parsing = {
          dynamic(value) {return value },
          string(value) { return value },
          object(value) { return JSON.parse(value) },
          number(value) { return parseFloat(value) }
        }
        let data = {
          raw: e.target.value
        }
        while (!data.type) {
          data.type = parsers.pop()(data.raw);
        }
        data.value = parsing[data.type](data.raw);

        this.$store.commit("setFlowData", {id: this.item.id, data})
        eventBus.$emit('tile-rerender');
      }
    }
  }
</script>
