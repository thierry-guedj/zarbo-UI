<template>
  <img class="lazyload" :data-src="src" />
</template>
<script>
export default {
  name: 'LazyImage',
  props: {
    src: { type: String, required: true },
  },
}
</script>
