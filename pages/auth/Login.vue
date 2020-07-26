<template>
  <section>
    <v-snackbar
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
        <v-btn dark text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <base-modal :value="visible" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
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
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder']),
  },
  mounted() {
    this.$nextTick(function () {
      this.showModal({
        componentName: 'LoginForm',
        folder: 'auth',
      })
    })
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
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
