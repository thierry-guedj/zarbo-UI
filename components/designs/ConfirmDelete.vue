<template>
  <section>
    <v-card flat>
      <v-card-title class="message">{{
        $t('confirmDelete.confirmMessage')
      }}</v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn v-bind="size" @click="close()">
          {{ $t('confirmDelete.cancel') }}
        </v-btn>

        <v-btn v-bind="size" @click="agree()">
          {{ $t('confirmDelete.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ConfirmDelete',
  /*   props: {
    item: {
      type: Object,
      default: null,
    },
  
  }, */
  data() {
    return {
      loadingSubmit: false,
    }
  },

  computed: {
    ...mapGetters(['getItem']),

    item() {
      return this.getItem
    },
    size() {
      const size = { xs: 'x-small', sm: 'small', lg: 'large', xl: 'x-large' }[
        this.$vuetify.breakpoint.name
      ]
      return size ? { [size]: true } : {}
    },
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
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
    close() {
      this.hideModal()
    },
    agree() {
      this.$emit('destroyItem')
    },
  },
}
</script>

<style lang="scss" scoped>
.message {
  font-size: 18px;
}
.theme--dark.v-card {
  background-color: #0f1219;
}
</style>
