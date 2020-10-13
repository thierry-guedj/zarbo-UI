<template>
  <section>
    <nuxt-link to="" class="color-white" @click.native="goTo()">
      <slot
    /></nuxt-link>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'BaseLink',
  props: {
    folderName: {
      type: String,
      default: null,
    },
    componentName: {
      type: String,
      default: null,
    },
    redirect: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goTo() {
      this.hideModal()
      if (this.redirect) this.$router.replace({ path: '/' })
      setTimeout(
        () =>
          this.showModal({
            componentName: this.componentName,
            folder: this.folderName,
          }),
        400
      )
    },
  },
}
</script>

<style lang="scss" scoped>
a.color-white {
  color: #ffffff;
}
.v-application a {
  text-decoration: underline;
}
</style>
