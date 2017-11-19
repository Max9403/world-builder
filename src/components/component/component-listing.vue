<template>
  <div class="component">
    <div class="name has-text-centered">
      {{ item.name }}
    </div>
    <div class="in" v-for="(input, index) in item.inputs" :key="input.id" :style="{background: colours.input[input.type]}" :title="input.type"></div>
    <div class="out" v-for="(output, index) in item.outputs" :key="output.id" :style="{background: colours.output[output.type]}" :title="output.type"></div>
  </div>
</template>

<style lang="scss">
  .component {
    display: grid;
    border-radius: 5px;
    background-color: #A9A9A9;
    margin: 1rem;
    grid-template-columns: 1.5rem 1fr 1.5rem;
    grid-template-rows: 2rem;
    grid-row-gap: 1px;
    grid-auto-rows: 1.5rem;
    padding-bottom: 1px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #4C4E4E;
    .name {
      grid-column:  1 / 4;
      padding: 0.25rem;
      border-bottom: 1px solid #4C4E4E;
      -moz-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .in {
      grid-column: 1;
      border-left: solid 1px #A9A9A9;
      cursor: pointer;
    }
    .out {
      grid-column: 3;
      border-right: solid 1px #A9A9A9;
      cursor: pointer;
    }
  }
</style>

<script>
  import interact from 'interactjs'
  import $ from 'jquery'

  import colours from './colours'

  export default {
    props: ["item"],
    data() {
      return {colours};
    },
    mounted() {
        let el = this.$el;
        let component = this;
        let clone;
        let $clone;
        let clonePos = {x: 0, y: 0};
        interact(el)
            .draggable({
                inertia: false,
                autoScroll: false,
                manualStart: true,
                onmove(event) {
                  $clone.css({top: (clonePos.y += event.dy), left: (clonePos.x += event.dx)})
                },
                onend() {
                  $clone.remove();
                }
            })
            .on('move', function (event) {
              var interaction = event.interaction;

              // if the pointer was moved while being held down
              // and an interaction hasn't started yet
              if (interaction.pointerIsDown && !interaction.interacting()) {
                clonePos.x = event.pageX;
                clonePos.y = event.pageY;
                let original = event.currentTarget;
                let $original = $(original);
                // create a clone of the currentTarget element

                clone = event.currentTarget.cloneNode(true);

                // insert the clone to the page
                // TODO: position the clone appropriately
                document.body.appendChild(clone);

                $clone = $(clone);
                $clone.css({position: "absolute", top: clonePos.y, left: clonePos.x, margin: 0, width: $original.width(), height: $original.height()});
                $clone.data("component", component);
                $clone.addClass("adding");

                // start a drag interaction targeting the clone
                interaction.start(
                  { name: 'drag' },
                  event.interactable,
                  clone);
              }
            });
    },
  }
</script>
