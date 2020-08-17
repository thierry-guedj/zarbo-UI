<template>
  <v-card
    max-width="400"
    class="float-left mr-2 ml-2 my-2 mx-auto portfolio-item portfolio-effect__item portfolio-item--eff1"
    width="420"
    tile
    elevation="5"
  >
    <v-card-title class="white--text grey darken-4">
      More from {{ user.name }}

      <v-spacer></v-spacer>

      <!-- <v-btn color="white" class="text--primary" fab small>
        <v-icon>mdi-plus</v-icon>
      </v-btn> -->
    </v-card-title>

    <!--  <v-card-text class="pt-4">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi nobis a at
      voluptates culpa optio amet! Inventore deserunt voluptatem maxime a veniam
      placeat, eos impedit nulla quos? Officiis, aperiam ducimus.
    </v-card-text> -->

    <v-spacer></v-spacer>

    <v-virtual-scroll :items="designs" :item-height="100" height="300">
      <template v-slot="{ item }">
        <v-list-item
          id="row-designs"
          style="max-height: 100px; max-width: 100vh; width: auto;"
        >
          <v-list-item-content>
            <v-img
              max-height="100px"
              max-width="100px"
              :src="`${item.images.thumbnail}`"
            >
            </v-img>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-action>
        </v-list-item>

        <v-divider></v-divider>
      </template>
    </v-virtual-scroll>
    <infinite-loading
      ref="infiniteLoading"
      slot="append"
      :identifier="identifier"
      spinner="ring-loader"
      force-use-infinite-wrapper="row-designs"
      @infinite="infiniteHandler"
    >
    </infinite-loading>
  </v-card>
  <!-- <v-container class="p-0 m-0 row-designs">
    <div v-if="searching" class="loader p-0">
      <RingLoader></RingLoader>
    </div>
    <div v-else class="pt-8 pl-6 pb-6 pr-6">
      <template v-if="(!designs.length)" class="pb-6 text-center">
        <v-alert
          border="left"
          color="#0f1219"
          dark
          width="60%"
          class="mx-auto deep-orange darken-4"
        >
          No results
        </v-alert>
      </template>
      <template v-else>
        <v-row
          id="row-designs"
          transition-duration="0.3s"
          item-selector=".item"
          class="mb-6"
          justify="center"
          no-gutters
        >
          <lazy-component
            v-for="(design, i) in designs"
            :key="`${i}-${design.id}`"
            :design="design"
          ></lazy-component>
        </v-row>

        <infinite-loading
          ref="infiniteLoading"
          slot="append"
          :identifier="identifier"
          spinner="ring-loader"
          force-use-infinite-wrapper="row-designs"
          @infinite="infiniteHandler"
        >
        </infinite-loading>
      </template>
    </div>
  </v-container> -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import RingLoader from 'vue-spinner/src/RingLoader.vue'
export default {
  name: 'Search',
  /* components: {
    RingLoader,
    lazyComponent: () => import('@/components/designs/DesignCard.vue'),
  }, */
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
        idDesign: this.designId,
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
    designTitle() {
      if (!this.design.title) return 'Sans Titre'
      else return this.design.title
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
      const response = await this.$axios.$get(this.url)
      this.designs = response.data
      this.searching = false
    },

    styleModal() {
      this.fullscreen = true
    },

    infiniteHandler($state) {
      this.$axios
        .$get(this.url)
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
.v-list-item__content {
  max-width: max-content;
}
</style>
