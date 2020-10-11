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
        :cols="{ default: 3, 1700: 2, 1000: 1 }"
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
// import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
export default {
  name: 'MoreFromTags',
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
    tags: {
      type: Array,
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
        idDesign: this.designId,
        page: 1,
        whereNotIn: [this.designId],
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
  },
  mounted() {
    this.fetchData()
  },

  methods: {
    ...mapActions(['showModal', 'hideModal']),
    async fetchData() {
      const tags = this.tags
      this.identifier = new Date()
      this.filters.page = 1
      this.designs = []
      const response = await this.$axios.$get(`search/designs`, {
        params: {
          tags: tags.reduce((f, s) => `[${f},${s}]`),
          whereNotIn: this.filters.whereNotIn,
        },
      })
      if (response.data.length > 0) {
        this.designs = response.data
        this.searching = false
      } else {
        const response2 = await this.$axios.$get(`search/designs`, {
          params: {
            whereNotIn: this.filters.whereNotIn,
          },
        })
        console.log(response2)
        this.designs = response2.data

        this.searching = false
      }
    },

    styleModal() {
      this.fullscreen = true
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
