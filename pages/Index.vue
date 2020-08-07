<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to the Vuetify + Nuxt.js template
        </v-card-title>
        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a
              href="https://vuetifyjs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation </a
            >.
          </p>
          <p>
            If you have questions, please join the official
            <a
              href="https://chat.vuetifyjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="chat"
            >
              discord </a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              rel="noopener noreferrer"
              title="contribute"
            >
              issue board </a
            >.
          </p>
          <p>
            Thank you for developing with Vuetify and I look forward to bringing
            more exciting features in the future.
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; John Leider</small></em>
          </div>
          <hr class="my-3" />
          <a
            href="https://nuxtjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nuxt Documentation
          </a>
          <br />
          <a
            href="https://github.com/nuxt/nuxt.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nuxt GitHub
          </a>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
      <!-- Modal  -->
      <!-- <keep-alive> -->
      <base-modal
        :dialog.sync="visible"
        :success="false"
        :status="''"
        @closeDialog="hideModal"
      />
      <!-- </keep-alive> -->
      <!-- End Modal -->
      <v-snackbar
        :value="visibleSnackbar"
        class="v-snackbar"
        multi-line
        timeout="2000"
        top
        vertical
        @input="hideSnackbar()"
        @close="hideSnackbar()"
      >
        You're logged in
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="hideSnackbar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  layout: "default",
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'visibleSnackbar']),
  },
  methods: {
    ...mapActions(['showModal', 'hideModal', 'showSnackbar', 'hideSnackbar']),
    goTo(to, folderName) {
      this.hideModal()
      setTimeout(
        () => this.showModal({ componentName: to, folder: folderName }),
        300
      )
    },
    goToUpload() {
      if (!this.$auth.loggedIn) {
        this.goTo('LoginForm', 'auth')
      } else {
        this.goTo('CreateForm', 'user')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  opacity: 1;
  background-color: rgba(23, 22, 18, 0.64);
}
.v-application {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).upload-button {
  background-color: rgba(31, 124, 142, 0.65);
}
.theme--dark.v-navigation-drawer {
  background-color: rgba(23, 22, 18, 0.64);
  top: 64px;
}
.v-snackbar {
  color: rgba(23, 22, 18, 0.54);
  border-radius: 6px;
}
</style>
