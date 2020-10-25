<template>
  <v-btn
    v-bind="size"
    :class="buttonClass"
    :color="color"
    :component-name="componentName"
    :folder-name="folderName"
    @click.native="goTo()"
    ><v-icon v-if="icon" v-bind="size" right dark :class="iconClass">{{
      icon
    }}</v-icon
    ><slot
  /></v-btn>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'BaseButton',
  props: {
    folderName: {
      type: String,
      default: null,
    },
    componentName: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: '',
    },
    buttonClass: {
      type: String,
      default: 'mr-2 ml-3 nuxt-link-active nuxt-link-exact-active',
    },
    icon: {
      type: String,
      default: '',
    },
    iconClass: {
      type: String,
      default: 'mr-2',
    },
  },
  data() {
    return {}
  },
  computed: {
    size() {
      const size = { xs: 'x-small', sm: 'small', lg: 'small', xl: 'small' }[
        this.$vuetify.breakpoint.name
      ]
      return size ? { [size]: true } : {}
    },
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goTo() {
      /*  if (this.needsAuth) {
        if (!this.$auth.loggedIn) {
          this.componentFile = 'LoginForm'
          this.folderPath = 'auth'
        }
      }
      const currentRoute = this.$route.name
      if (this.needsRedirect.includes(currentRoute)) {
        this.redirectPage = true
      } */

      this.hideModal()
      /* if (this.redirect || this.redirectPage)
          this.$router.replace({ path: '/' })
        setTimeout(
          () => */
      this.showModal({
        componentName: this.componentName,
        folder: this.folderName,
      })
      /*   400
        ) */
    },
  },
}
</script>

<style lang="scss" scoped>
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).upload-button {
  background-color: rgba(31, 124, 142, 0.65);
}
.theme--dark.v-btn {
  text-decoration: none;
}
.v-application a {
  text-decoration: none;
}
</style>
