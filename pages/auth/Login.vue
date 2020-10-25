<template>
  <section>
    <!-- <v-snackbar
      v-model="snackbar"
      color="success"
      multi-line
      timeout="5000"
      top
      vertical
      @loginSuccess="snackbar = true"
    >
      You're logged in
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="size" dark text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar> -->

    <!-- Modal  -->
    <!-- <keep-alive> -->
    <base-modal :value="visible" :width="width" @closeDialog="hideModal()" />
    <!-- </keep-alive> -->
    <!-- End Modal -->
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  layout: 'default',
  middleware: ['guest'],
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      snackbar: true,
      snackbarValue: false,
      width: '500px',
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder']),
    size() {
      const size = { xs: 'x-small', sm: 'small', lg: 'large', xl: 'x-large' }[
        this.$vuetify.breakpoint.name
      ]
      return size ? { [size]: true } : {}
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.hideModal()
      this.goTo('LoginForm', 'auth')
    })
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goTo(to, folderName) {
      setTimeout(
        () => this.showModal({ componentName: to, folder: folderName }),
        300
      )
    },
  },
}
</script>
<style lang="scss" scoped>
.alert-error {
  background-color: rgba(229, 57, 53, 0.7);
}
a.color-white {
  color: #ffffff;
}
</style>
