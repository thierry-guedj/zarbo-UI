<template>
  <v-container v-if="searching">
    <div class="loader"><Circle8></Circle8></div>
  </v-container>
  <v-container v-else class="px-3">
    <v-row>
      <v-col v-for="design in designs" :key="design.id" cols="12" md="6">
        <lazy-component :design="design"></lazy-component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
export default {
  name: 'Search',
  components: {
    lazyComponent: () => import('@/components/designs/DesignCardMini.vue'),
    // RingLoader,
    Circle8,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
    designId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      designs: [],
      searching: true,
      loader: null,
      loadingSubmit: false,
      loaderPage: false,
      filters: {
        idUser: this.user.id,
        whereNotIn: [this.designId],
        page: 1,
      },
      fullscreen: false,

      identifier: new Date(),
    }
  },

  computed: {
    queryString() {
      return Object.keys(this.filters)
        .map((k) => `${k}=${this.filters[k]}`)
        .join('&')
    },
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getIdDesign']),
    url() {
      return `/search/designs?${this.queryString}`
    },
    designIdComp() {
      return parseInt(this.getIdDesign)
    },
  },
  watch: {
    getIdDesign(val) {
      this.filters.whereNotIn = val
      this.fetchData()
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    async fetchData() {
      this.identifier = new Date()
      this.filters.page = 1
      const response = await this.$axios.$get(`search/designs`, {
        params: {
          idUser: this.filters.idUser,
          whereNotIn: [this.designIdComp],
        },
      })
      this.designs = response.data
      this.searching = false
    },

    styleModal() {
      this.fullscreen = true
    },

    infiniteHandler($state) {
      this.$axios
        .$get(`search/designs`, {
          params: {
            whereNotIn: this.filters.whereNotIn.reduce((f, s) => `[${f},${s}]`),
          },
        })
        .then((response) => {
          if (response.data.length > 1) {
            response.data.forEach((item) => this.designs.push(item))

            $state.loaded()
          } else {
            $state.loaded()
            $state.complete()
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.filters.page = this.filters.page + 1
    },
  },
}
</script>
<style lang="scss" scoped>
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
