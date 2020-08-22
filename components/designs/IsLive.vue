<template>
  <v-btn
    :loading="loadingSubmit"
    class="ma-0"
    style="cursor: pointer;"
    :color="getColor(isLive)"
    text-color="white"
    small
    rounded
    @click.native="
      loadingSubmit = true
      toggleIsLive(is_live, id)
    "
  >
    <v-avatar left class="avatar-is-live">
      <v-icon>mdi-checkbox-marked-circle</v-icon>
    </v-avatar>
    {{
      isLive ? $t('settingsDesigns.published') : $t('settingsDesigns.draft')
    }}</v-btn
  >
</template>

<script>
export default {
  name: 'IsLive',
  props: {
    id: {
      type: Number,
      default: null,
    },
    is_live: {
      type: Boolean,
      default: 0,
    },
  },
  data() {
    return {
      loadingSubmit: false,
      isLive: this.is_live,
    }
  },
  methods: {
    getColor(is_live) {
      if (is_live) return 'green'
      else return 'orange'
    },
    async toggleIsLive(is_live, id) {
      this.loadingSubmit = true
      const url = `/designs/${id}/updateIsLive`
      if (is_live === true) is_live = 0
      else if (is_live === false) is_live = 1
      else is_live = 0
      console.log(is_live)
      this.loader = 'loadingSubmit'

      await this.$axios
        .put(url, {
          id: parseInt(`${id}`),
          is_live: `${is_live}`,
        })
        .then((res) => {
          this.isLive = !this.isLive
        })
        .catch((err) => console.log(err.response))
        .finally(() => {
          this.loadingSubmit = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-is-live {
  padding: 0;
}
</style>
