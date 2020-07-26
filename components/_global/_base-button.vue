<template>
  <nuxt-link :to="to">
    <v-btn small :class="buttonClass" :color="color" @click.native="goTo()"
      ><v-icon v-if="icon" right dark :class="iconClass">{{ icon }}</v-icon
      ><slot
    /></v-btn>
  </nuxt-link>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    needsAuth: {
      type: Boolean,
      default: false,
    },
    toggleModal: {
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
      default: 'mr-2 ml-3',
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
    return {
      needsRedirect: ['password.reset', 'verify'],
      redirectPage: false,
      componentFile: this.componentName,
      folderPath: this.folderName,
      linkTo: '',
    }
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goTo() {
      if (this.needsAuth) {
        if (!this.$auth.loggedIn) {
          this.componentFile = 'LoginForm'
          this.folderPath = 'auth'
        }
      }
      const currentRoute = this.$route.name
      if (this.needsRedirect.includes(currentRoute)) {
        this.redirectPage = true
      }
      if (this.toggleModal) {
        this.hideModal()
        if (this.redirect || this.redirectPage)
          this.$router.replace({ path: '/' })
        setTimeout(
          () =>
            this.showModal({
              componentName: this.componentFile,
              folder: this.folderPath,
            }),
          400
        )
      }
    },
    /* get getTo() {
    return {
        to: '/upload',
    }
} */
  },
}
</script>

<style lang="scss" scoped>
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).upload-button {
  background-color: rgba(31, 124, 142, 0.65);
}
</style>
