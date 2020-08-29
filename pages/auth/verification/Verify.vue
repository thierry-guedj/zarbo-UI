<template>
  <section class="authentication">
    <div class="auth-body">
      <h1 class="text-uppercase fw-500 mb-4 text-center font-22">
        Email Verification
      </h1>

      <div v-if="success" class="form-group">
        <div class="alert alert-success">
          {{ status }}
        </div>
        <nuxt-link :to="localePath('login')">Proceed to Login</nuxt-link>
      </div>
      <div v-else class="form-group">
        <div class="alert alert-danger">
          {{ status }}
        </div>
      </div>
    </div>
    <!-- Modal  -->
    <!-- <keep-alive> -->
    <base-modal
      :dialog.sync="visible"
    
      :width="width"
      @closeDialog="hideModal()"
    />
    <!-- </keep-alive> -->
    <!-- End Modal -->
  </section>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Verify',
  layout: 'designs-listing',
  middleware: ['guest'],
  async asyncData({ params, query, app }) {
    const q = await Object.keys(query)
      .map((k) => `${k}=${query[k]}`)
      .join('&')

    try {
      const { data } = await app.$axios.post(
        `/verification/verify/${params.id}?${q}`
      )
      return { success: true, status: data.message }
    } catch (e) {
      return { success: false, status: e.response.data.errors.message }
    }
  },
  data() {
    return {
      width: '500px',
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'visibleSnackbar']),
  },
  methods: {
    ...mapActions(['showModal', 'hideModal', 'showSnackbar', 'hideSnackbar']),

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
.alert-error {
  background-color: rgba(229, 57, 53, 0.7);
}
a.color-white {
  color: #ffffff;
}
.auth-body {
  text-align: center;
}
</style>
