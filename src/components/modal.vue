<template>
  <div class="modal is-active" :class="{hiding}" v-show="show" @keydown.native.esc="hide">
    <div class="modal-background" @click.prevent="hide"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <button class="modal-close is-large" aria-label="close" @click.prevent="hide"></button>
  </div>
</template>

<style lang="scss">
  .modal {
    .modal-background {
      animation: fade-in 300ms ease-in;
    }
    &.hiding .modal-background {
      animation: fade-out 300ms ease-in;
    }

    &.hiding .modal-content {
      animation: shrink 300ms ease-in, fade-out 300ms ease-in;
      transform: scale(0.8);
    }
    .modal-content {
      animation: grow 300ms ease-in, fade-in 300ms ease-in;
    }
    @keyframes grow {
      100% {
        transform: scale(1);
      },
      0% {
        transform: scale(0.8);
      }
    }
    @keyframes shrink {
      0% {
        transform: scale(1);
      },
      100% {
        transform: scale(0.8);
      }
    }
    @keyframes fade-in {
      100% {
        opacity: 1;
      },
      0% {
        opacity: 0;
      }
    }
    @keyframes fade-out {
      0% {
        opacity: 1;
      },
      100% {
        opacity: 0;
      }
    }
  }
</style>
<script>
  import $ from 'jquery'

  export default {
    props: ['show'],
    data() {
      return {
        hiding: false
      };
    },
    methods: {
      hide() {
        this.hiding = true;
        setTimeout(() => {
          this.hiding = false;
          this.$emit("hide");
        }, 300);
      }
    },
    mounted() {
      $(document).on("keydown", e => {
        if(e.which == 27) {
          this.hide();
        }
      });
    }
  }
</script>
