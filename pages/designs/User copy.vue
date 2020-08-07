<template>
  <section>
    <v-container fluid class="search-control">
      <form @submit.prevent="search">
        <v-row
          class="filters d-flex justify-content-between align-items-center"
        >
          <v-col cols="auto"
            ><v-select
              v-model="filters.orderBy"
              :items="itemsOrderBy"
              item-text="title"
              item-value="value"
              label="Order by"
              outlined
              width="250px"
              @change="search"
            ></v-select
          ></v-col>

          <v-col cols="auto" class="d-flex align-items-center">
            <!-- <input
                id="hasComments"
                type="checkbox"
                class="custom-control-input"
              />
              <label class="custom-control-label" value="1" for="hasComments"
                >Has Comments</label
              > -->
            <v-checkbox
              id="has_comments"
              v-model="filters.has_comments"
              field="has_comments"
              label="Has Comments"
              class="mr-3"
              true-value="1"
              false-value="0"
              @change="search"
            ></v-checkbox>

            <!-- <input
                id="hasTeam"
                type="checkbox"
                class="custom-control-input"
              />
              <label class="custom-control-label" value="1" for="hasTeam"
                >By Team</label
              > -->
            <v-checkbox
              id="has_team"
              v-model="filters.has_team"
              field="has_team"
              label="By team"
              true-value="1"
              false-value="0"
              class="mr-3"
              @change="search"
            ></v-checkbox>

            <!-- <div class="input-group mb-0">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search..."
                />
                <div class="input-group-append">
                  <button
                    class="btn rounded primary-bg-color text-white"
                    type="submit"
                  >
                    Search
                  </button>
                </div>
              </div> -->
            <!-- <v-text-field
                label="Search"
                prepend-inner-icon="search" style="margin-right: 15px; max-width: 460px"
              ><template slot="append"><base-button type="submit" color="transparent"
                >Search</base-button
              ></template></v-text-field
              > -->
          </v-col>
          <v-col>
            <v-text-field
              id="q"
              v-model="filters.q"
              field="q"
              class="combobox"
              outlined
              @input="search"
            >
              <template v-slot:append>
                <v-btn
                  :disabled="searching"
                  class="searchBtn"
                  height="auto"
                  text
                  :loading="searching"
                  type="submit"
                >
                  <v-icon>mdi-magnify</v-icon>
                  Search
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </form>
    </v-container>
    <v-container class="p-0 m-0">
      <div v-if="searching" class="loader p-0">
        <RingLoader></RingLoader>
      </div>
      <div v-else class="pt-8 pl-6 pb-6 pr-6">
        <template v-if="(!designs.length)" class="pb-6">
          <v-alert border="left" color="#0f1219" dark>
            No results found
          </v-alert>
        </template>
        <template v-else>
          <v-row
            transition-duration="0.3s"
            item-selector=".item"
            class="mb-6"
            justify="center"
            no-gutters
          >
            <design-card
              v-for="design in designs"
              :key="design.id"
              :design="design"
            ></design-card>
          </v-row>
        </template>
      </div>
    </v-container>
    <!-- Modal  -->
    <!-- <keep-alive> -->
    <base-modal
      :dialog.sync="visible"
      :fullscreen="fullscreen"
      @showDesign="styleModal()"
      @closeDialog="hideModal"
    />
    <!-- </keep-alive> -->
    <!-- End Modal -->
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
export default {
  name: 'Search',
  layout: 'page2',
  components: {
    RingLoader,
  },
  async asyncData({ $axios, params, error, redirect }) {
    try {
      const url = `/search/designs/${params.id}/user`
      const response = await $axios.$get(url)
      console.log(response.data)
      return { designs: response.data, idUser: `${params.id}` }
    } catch (err) {
      if (err.response.status === 404) {
        error({ statusCode: 404, message: 'Design not found' })
      } else if (err.response.status === 401) {
        redirect('/login')
      } else {
        error({ statusCode: 500, message: 'Internal server error' })
      }
    }
  },

  data() {
    return {
      searching: false,
      loader: null,
      loadingSubmit: false,
      loaderPage: false,
      filters: {
        has_team: 0,
        has_comments: 0,
        q: '',
        orderBy: 'likes',
        userId: this.idUser,
      },
      itemsOrderBy: [
        { title: 'Latest first', value: 'latest' },
        { title: 'Most liked frst', value: 'likes' },
      ],
      fullscreen: false,
    }
  },

  computed: {
    queryString() {
      this.filters.userId = this.idUser
      return Object.keys(this.filters)
        .map((k) => `${k}=${this.filters[k]}`)
        .join('&')
    },
    ...mapGetters(['visible', 'modalComponent', 'folder']),
  },
  created() {
    this.search()
  },

  methods: {
    ...mapActions(['showModal', 'hideModal']),
    search() {
      this.searching = true
      this.loadingSubmit = true
      this.loader = 'loadingSubmit'
      const url = `/search/designs?${this.queryString}`
console.log(url)
      this.$axios
        .$get(url)
        .then((res) => (this.designs = res.data))
        .catch((e) => console.log(e))
        .finally(() => {
          this.searching = false
          this.loadingSubmit = false
          this.loader = null
        })
    },
    styleModal() {
      this.fullscreen = true
    },
  },
}
</script>

<style lang="scss" scoped>
.v-select__selections input {
  display: none;
}
.container {
  max-width: 100%;
  padding: 0;
}
.search-control {
  max-width: 75%;
}
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
