<template>
  <div class="slim">
    <client-only>
      <slot></slot>
    </client-only>
  </div>
</template>

<script>
import Slim from './slim.module.js'

let instance = null

export default {
  name: 'SlimCropper',
  props: ['options'],
  mounted() {
    if (this.options.initialImage) {
      const img = document.createElement('img')
      img.setAttribute('alt', '')
      img.src = this.options.initialImage
      this.$el.appendChild(img)
    }
    instance = new Slim(this.$el, this.options)
  },
  beforeDestroy() {
    instance.destroy()
  },
}
</script>
<style lang="css">
@import './slim.min.css';
</style>
