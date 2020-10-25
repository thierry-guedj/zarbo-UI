<template>
  <div v-if="loading" class="loading-page">
    <Circle8></Circle8>
  </div>
</template>

<script>
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
export default {
  components: {
    Circle8,
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  background: transparent;
  color: whitesmoke;
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  z-index: 1000;
}
</style>
