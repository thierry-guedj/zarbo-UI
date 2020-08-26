<template>
  <base-modal :value="visible" :status="status" :success="success" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Verify',
  layout: 'default',
  middleware: ['guest'],
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
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
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder']),
  },
  mounted() {
    this.$nextTick(function () {
      this.showModal({
        componentName: 'VerifyForm',
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
