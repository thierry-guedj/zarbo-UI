<template>
  <section class="filters-block shadow-sm">
    <v-container fluid>
      <form @submit.prevent="search">
        <div class="filters d-flex justify-content-between align-items-center">
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

          <div class="d-flex align-items-center">
            <div class="custom-control mr-3 custom-checkbox">
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
                true-value="1"
                false-value="0"
                @change="search"
              ></v-checkbox>
            </div>

            <div class="custom-control custom-checkbox mr-3">
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
                @change="search"
              ></v-checkbox>
            </div>

            <div>
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
              <v-combobox
                v-model="filters.q"
                class="combobox"
                outlined
                @change="search"
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
              </v-combobox>
            </div>
          </div>
        </div>
      </form>
    </v-container>
    <v-container class="grey lighten-5">
      <v-row class="mb-6" justify="center" no-gutters>
        <base-design
          v-for="design in designs"
          :key="design.id"
          :design="design"
        ></base-design>
      </v-row>
    </v-container>
    <!-- Modal  -->
    <!-- <keep-alive> -->
    <base-modal
      :dialog.sync="visible"
      :success="false"
      :status="''"
      @closeDialog="hideModal"
    />
    <!-- </keep-alive> -->
    <!-- End Modal -->
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Search',
  data() {
    return {
      designs: [],
      searching: false,
      loader: null,
      loadingSubmit: false,
      filters: {
        has_team: 0,
        has_comments: 0,
        q: '',
        orderBy: 'likes',
      },
      itemsOrderBy: [
        { title: 'Latest first', value: 'latest' },
        { title: 'Most liked frst', value: 'likes' },
      ],
    }
  },
  computed: {
    queryString() {
      return Object.keys(this.filters)
        .map((k) => `${k}=${this.filters[k]}`)
        .join('&')
    },
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getSlugDesign']),
  },
  beforeMount() {
    this.search()
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    search() {
      this.searching = true
      this.$axios
        .$get(`/search/designs?${this.queryString}`)
        .then((res) => (this.designs = res.data))
        .catch((e) => console.log(e))
        .finally(() => (this.searching = false))
    },
    /* goTo(to, folderName, slug) {
      this.hideModal()
      setTimeout(
        () =>
          this.showModal({
            componentName: to,
            folder: folderName,
            slugDesign: slug,
          }),
        300
      )
    }, */
  },
}
</script>

<style lang="scss" scoped>
.v-select__selections input {
  display: none;
}
.container {
  max-width: 100%;
}
</style>
