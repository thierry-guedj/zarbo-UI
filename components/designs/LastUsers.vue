<template>
  <section>
    <v-container class="p-0 m-0 row-users">
      <div v-if="searching" class="loader p-0">
        <Circle8></Circle8>
      </div>
      <div v-else class="pt-8 pl-0 pb-6 pr-0">
        <v-row
          transition-duration="0.3s"
          item-selector=".item"
          class="mb-6 row-user"
          justify="center"
          no-gutters
        >
          <masonry
            :cols="{
              default: 6,
              1500: 5,
              1400: 4,
              1000: 3,
              700: 2,
              500: 1,
            }"
            :gutter="{ default: '0px', 700: '15px' }"
            ><lazy-component
              v-for="(user, i) in users"
              :key="`${i}-${user.id}`"
              :user="user"
              @lightbox="index = parseInt(`${i}`)"
            ></lazy-component
          ></masonry>
        </v-row>
      </div>
    </v-container>
  </section>
</template>

<script>
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LastUsers',
  components: {
    Circle8,
    lazyComponent: () => import('@/components/user/UserCard.vue'),
  },
  data() {
    return {
      users: [],
      searching: true,
      loader: null,
      loadingSubmit: false,
      loaderPage: false,
      fab: false,
      identifier: new Date(),
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
      this.searching = true
      this.identifier = new Date()
      const url = 'search/users/last'
      const response = await this.$axios.$get(url)
      this.users = response.data
      this.searching = false
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  max-width: 100%;
  padding: 0;
  text-align: left;
  width: 100%;
}
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
.row.row-user {
  display: contents !important;
}
</style>
