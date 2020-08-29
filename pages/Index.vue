<template>
  <v-layout column justify-center align-center>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      fab
      dark
      fixed
      bottom
      right
      color="accent"
      @click="toTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
    <v-flex xs12 sm8 md6>
      <!--  <v-container
        height="50"
        class="gradientBody justify-start align-content-md-start pt-0"
      ></v-container> -->
      {{ $t('hello') }}
      <nuxt-link
        v-for="locale in availableLocales"
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
        >{{ locale.name }}</nuxt-link
      >

      <last-designs></last-designs>
      <div class="text-center" style="max-width: '80%';">
        <!-- Modal  -->
        <!-- <keep-alive> -->
        <base-modal
          :dialog.sync="visible"
          :width="width"
          @closeDialog="hideModal()"
        />
        <!-- </keep-alive> -->
        <!-- End Modal -->
        <v-snackbar
          :value="visibleSnackbar"
          class="v-snackbar"
          multi-line
          timeout="2000"
          color="teal darken-3"
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
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Index',
  layout: 'default',
  data() {
    return {
      width: '500px',
      fab: false,
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'visibleSnackbar']),
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
  methods: {
    ...mapActions(['showModal', 'hideModal', 'showSnackbar', 'hideSnackbar']),
    styleModal() {
      this.fullscreen = false
    },
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
    goTo(to, folderName) {
      // this.hideModal()
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
.v-main {
  padding-top: 0 !important;
}
</style>
