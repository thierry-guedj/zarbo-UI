<template>
  <v-container>
    <h2 class="ml-3">Last published designs</h2>
    <div v-if="searching" class="loader">
      <Circle8></Circle8>
    </div>
    <div v-else class="pt-6">
      <v-row class="px-3 m-0">
        <CoolLightBox
          :items="itemsDesigns"
          :index="index !== null ? parseInt(`${index}`) : index"
          :use-zoom-bar="true"
          :effect="'fade'"
          @close="index = null"
        >
        </CoolLightBox>
        <lazy-component
          v-for="(design, i) in designs"
          :key="`${i}-${design.id}`"
          :design="design"
          @lightbox="index = parseInt(`${i}`)"
        ></lazy-component>
      </v-row>
    </div>
  </v-container>
</template>

<script>
// import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
import { mapActions, mapGetters } from 'vuex'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
export default {
  components: {
    // RingLoader,
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
      fullscreen: false,
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
      this.identifier = new Date()
      const url = 'search/designs/last'
      console.log(url)
      const response = await this.$axios.$get(url)
      this.designs = response.data
      this.designs.forEach((design) => {
        this.itemsDesigns.push({
          title: design.title === '' ? design.title : 'Sans Titre',
          description: design.description,
          src: design.images.large,
        })
      })
      this.searching = false
    },

    styleModal() {
      this.fullscreen = true
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  max-width: 100%;
  padding: 0;
}
.loader {
  position: absolute;
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
</style>
