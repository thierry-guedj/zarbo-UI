<template>
  <section>
    <v-btn
      v-bind="size"
      :loading="loadingSubmit"
      class="mx-2 d-flex d-sm-none"
      fab
      dark
      :color="getColor"
      @click.native="
        loadingSubmit = true
        toggleIsLive(item.is_live, item.id)
      "
    >
      <v-avatar left class="avatar-is-live">
        <v-icon small>{{ getIcon }}</v-icon>
      </v-avatar>
    </v-btn>
    
    <v-btn
      v-bind="size"
      :loading="loadingSubmit"
      class="ma-0 is-live pl-0 pr-3 d-none d-sm-flex"
      :color="getColor"
      text-color="white"
      rounded
      @click.native="
        loadingSubmit = true
        toggleIsLive(item.is_live, item.id)
      "
    >
      <v-avatar left class="avatar-is-live">
        <v-icon v-bind="size">{{ getIcon }}</v-icon>
      </v-avatar>
      {{
        item.is_live === true
          ? $t('settingsDesigns.published')
          : $t('settingsDesigns.draft')
      }}</v-btn
    >
  </section>
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
    },
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
      else return '#006064'
    },
    getIcon() {
      if (this.item.is_live === false) return 'lens'
      else return 'mdi-checkbox-marked-circle'
    },
    size() {
      const size = {
        xs: 'x-small',
        sm: 'small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
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
  min-width: 135px !important;
}
</style>
