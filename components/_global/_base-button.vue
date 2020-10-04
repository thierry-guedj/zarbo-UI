<template>
  <nuxt-link :to="to">
    <v-btn
      small
      :class="buttonClass"
      :color="color"
      :size="size"
      :component-name="componentName"
      :folder-name="folderName"
      @click.native="goTo()"
      ><v-icon v-if="icon" right dark :class="iconClass">{{ icon }}</v-icon
      ><slot
    /></v-btn>
  </nuxt-link>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'BaseButton',
  props: {
    needsAuth: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: '',
    },
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
    size: {
      type: String,
      default: 'small',
    },
  },
  data() {
    return {
      needsRedirect: ['password.reset', 'verify'],
      redirectPage: false,

      linkTo: '',
    }
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
