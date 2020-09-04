<template>
  <div>
    <h2 class="ml-3">{{ $t('widgetTitle.lastPublishedDesigns') }}</h2>
    <div v-if="searching" class="loader">
      <Circle8></Circle8>
    </div>
    <div v-else class="pt-8 pl-0 pb-6 pr-0">
      <v-row
        transition-duration="0.3s"
        item-selector=".item"
        class="mb-6 row-design"
        justify="center"
        no-gutters
      >
        <CoolLightBox
          :items="itemsDesigns"
          :index="index !== null ? parseInt(`${index}`) : index"
          :use-zoom-bar="true"
          :effect="'fade'"
          @close="index = null"
        >
        </CoolLightBox>
        <masonry
          :cols="{ default: 6, 1000: 3, 700: 2, 400: 1 }"
          :gutter="{ default: '0px', 700: '15px' }"
          ><lazy-component
            v-for="(design, i) in designs"
            :key="`${i}-${design.id}`"
            :design="design"
            @lightbox="index = parseInt(`${i}`)"
          ></lazy-component
        ></masonry>
      </v-row>
    </div>
  </div>
</template>

<script>
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
import { mapActions, mapGetters } from 'vuex'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
export default {
  name: 'LastDesigns',
  components: {
    Circle8,
    lazyComponent: () => import('@/components/designs/DesignCard.vue'),
    CoolLightBox,
  },
  data() {
    return {
      designs: [],
      searching: true,
      loader: null,
      loadingSubmit: false,
      loaderPage: false,     
      fab: false,
      identifier: new Date(),
      index: null,
      itemsDesigns: [],
    }
  },

  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getIdDesign']),
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    async fetchData() {
      this.itemsDesigns = []
      this.searching = true
      this.identifier = new Date()
      const url = 'search/designs/last'
      const response = await this.$axios.$get(url)
      this.designs = response.data
      this.designs.forEach((design) => {
        this.itemsDesigns.push({
          title: design.title === '' ? design.title : 'Sans Titre',
          description: design.description,
          src: design.images.extralarge,
        })
      })
      this.searching = false
    },
  },
}
</script>
<style lang="scss" scoped>
.loader {
  position: fixed;

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
