<template>
  <base-modal :value="visible" :status="status" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PasswordReset',
  middleware: ['guest'],
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      email: '',
      token: '',
      status: '',
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder']),
  },
  mounted() {
    this.$nextTick(function () {
      this.goTo('PasswordResetForm', 'auth')
    })
  },
  created() {
    this.email = this.$route.query.email
    this.token = this.$route.params.token
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goTo(to, folderName) {
      // this.hideModal()
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
