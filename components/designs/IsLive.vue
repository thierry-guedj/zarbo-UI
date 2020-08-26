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
      toggleIsLive(isLive, id)
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
    isLive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingSubmit: false,
      // isLive: this.is_live,
    }
  },
  methods: {
    getColor(isLive) {
      if (isLive) return 'green'
      else return 'orange'
    },
    async toggleIsLive(isLive, id) {
      this.loadingSubmit = true
      const url = `/designs/${id}/updateIsLive`
      if (isLive === true) isLive = 0
      else if (isLive === false) isLive = 1
      else isLive = 0
      console.log(isLive)
      this.loader = 'loadingSubmit'

      await this.$axios
        .put(url, {
          id: parseInt(`${id}`),
          isLive: `${isLive}`,
        })
        .then((res) => {
          this.isLive = !this.isLive
        })
        .catch((err) => console.log(err.response))
        .finally(() => {
          this.loadingSubmit = false
          this.$emit('isLiveToggle')
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
