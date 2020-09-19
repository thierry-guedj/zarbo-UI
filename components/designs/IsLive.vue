<template>
  <v-btn
    :loading="loadingSubmit"
    class="ma-0 is-live pl-0 pr-3"
    :color="getColor"
    text-color="white"
    small
    rounded
    @click.native="
      loadingSubmit = true
      toggleIsLive(item.is_live, item.id)
    "
  >
    <v-avatar left class="avatar-is-live">
      <v-icon>mdi-checkbox-marked-circle</v-icon>
    </v-avatar>
    {{
      item.is_live === true
        ? $t('settingsDesigns.published')
        : $t('settingsDesigns.draft')
    }}</v-btn
  >
</template>

<script>
export default {
  name: 'IsLive',
  props: {
    /* id: {
      type: Number,
      default: null,
    },
    isLive: {
      type: Boolean,
      default: false,
    }, */
    item: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      loadingSubmit: false,
      // isLive: this.is_live,
    }
  },

  computed: {
    getColor() {
      if (this.item.is_live === false) return 'orange darken-3'
      else return 'teal darken-3'
    },
  },
  methods: {
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
          this.item.is_live = !this.item.is_live
        })
        .catch((err) => console.log(err.response))
        .finally(() => {
          this.loadingSubmit = false
          this.$emit('isLiveToggle', this.item)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar-is-live {
  padding: 0;
}
.is-live {
  cursor: pointer;
  font-size: 11px;
  min-width: 120px !important;
}
</style>
