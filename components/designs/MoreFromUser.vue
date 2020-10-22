<template>
  <v-container v-if="searching">
    <div class="loader"><Circle8></Circle8></div>
  </v-container>
  <v-container v-else class="px-2">
    <v-row
      transition-duration="0.3s"
      item-selector=".item"
      class="mb-6 row-design"
      justify="center"
      no-gutters
    >
      <masonry
        :cols="{ default: 4, 1800: 3, 1400: 2, 1000: 1 }"
        :gutter="{ default: '0px', 700: '10px' }"
        ><lazy-component
          v-for="(design, i) in designs"
          :key="`${i}-${design.id}`"
          :design="design"
          @lightbox="index = parseInt(`${i}`)"
        ></lazy-component
      ></masonry>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
export default {
  name: 'MoreFromUser',
  components: {
    lazyComponent: () => import('@/components/designs/DesignCardMini.vue'),
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
        userId: this.user.id,
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
    ...mapGetters(['visible', 'modalComponent', 'folder']),
    url() {
      return `/search/designs?${this.queryString}`
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
          whereNotIn: [this.designId],
        },
      })
      this.designs = response.data
      this.searching = false
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
.col-md-2 {
  padding: 0;
}
.image {
  height: 300px;
  width: 300px;
  display: block;
  background-color: red;
}

body,
html {
  height: 100%; /* REMOVING THIS FIXES THE ISSUE */
  scroll-behavior: smooth;
}
.cool-lightbox
  .cool-lightbox__wrapper.cool-lightbox__wrapper--swipe
  .cool-lightbox__slide {
  opacity: 1 !important;
}
.row.row-design {
  display: contents !important;
}
</style>
