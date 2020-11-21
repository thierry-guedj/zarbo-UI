<template>
  <section>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      v-bind="size"
      fab
      dark
      fixed
      bottom
      right
      color="accent"
      @click="toTop"
    >
      <v-icon v-bind="size">keyboard_arrow_up</v-icon>
    </v-btn>
    <v-container class="p-0 m-0 row-designs">
      <section class="hero text-white">
        <!-- <v-container> -->
        <v-row class="row-md-12">
          <v-col class="col-md-2 text-center iconTitle">
            <img src="/artistIcon.png" class="ml-3 mr-2"
          /></v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col class="col-md-9">
            <p class="titlePage text-white">
              {{ $t('userIndex.memberArtists') }}
            </p>
            <v-container fluid class="search-control">
              <form @submit.prevent="fetchData">
                <v-row
                  class="filters d-flex justify-content-between align-items-center"
                >
                  <v-col cols="auto"
                    ><v-select
                      v-model="filters.orderBy"
                      :items="itemsOrderBy"
                      item-text="title"
                      item-value="value"
                      :label="$t('search.orderBy')"
                      outlined
                      width="250px"
                      @change="fetchData"
                    ></v-select
                  ></v-col>
                  <v-col>
                    <v-text-field
                      id="q"
                      v-model="filters.q"
                      field="q"
                      class="combobox"
                      outlined
                      @input="fetchData"
                    >
                      <template v-slot:append>
                        <v-btn
                          v-bind="size"
                          :disabled="searching"
                          class="searchBtn"
                          height="auto"
                          text
                          :loading="searching"
                          type="submit"
                        >
                          <v-icon v-bind="size">mdi-magnify</v-icon>
                          {{ $t('search.search') }}
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </form>
            </v-container>
          </v-col>
        </v-row>
      </section>

      <v-container class="p-0 m-0 row-designs">
        <div v-if="searching" class="loader p-0">
          <Circle8></Circle8>
        </div>
        <div v-else class="pt-8 pl-0 pb-6 pr-0">
          <template v-if="!users.length" class="pb-6">
            <v-alert
              border="right"
              color="accent"
              dark
              transition="scale-transition"
              width="60%"
              class="alert"
            >
              {{ $t('user.noCriteriaResult') }}
              <v-spacer />
              <nuxt-link :to="{ name: 'users.search' }">
                <v-btn v-bind="size" class="mt-3"
                  ><v-icon v-bind="size" right dark class="mx-2">reply</v-icon
                  >{{ $t('user.back') }}</v-btn
                >
              </nuxt-link>
            </v-alert>
          </template>
          <template v-else id="row-designs">
            <v-row
              transition-duration="0.3s"
              item-selector=".item"
              class="mb-6 row-design"
              justify="center"
              no-gutters
            >
              <lazy-component
                v-for="(user, i) in users"
                :key="`${i}-${user.id}`"
                :user="user"
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
              <div slot="no-more">Plus de résultat</div>
              <div slot="no-results">Pas de résultat</div>
            </infinite-loading>
          </template>
        </div>
      </v-container>
      <!-- Modal  -->
      <!-- <keep-alive> -->
      <base-modal :dialog.sync="visible" @closeDialog="hideModal()" />
    </v-container>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import RingLoader from 'vue-spinner/src/RingLoader.vue'
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
export default {
  name: 'UserIndex',
  layout: 'designs-listing',
  components: {
    // RingLoader,
    lazyComponent: () => import('@/components/user/UserCard.vue'),
    Circle8,
  },
  data() {
    return {
      users: [],
      searching: true,
      loader: null,
      loadingSubmit: false,
      filters: {
        // has_team: 0,
        q: '',
        orderBy: 'latest',
        page: 0,
      },
      itemsOrderBy: [
        { title: this.$i18n.t('search.latestFirstUsers'), value: 'latest' },
        { title: this.$i18n.t('search.az'), value: 'az' },
        { title: this.$i18n.t('search.za'), value: 'za' },
      ],
      fullscreen: false,
      identifier: new Date(),
      fab: false,
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
      return `/users?${this.queryString}`
    },
    size() {
      const size = {
        xs: 'small',
        sm: 'small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    async fetchData() {
      this.searching = true
      this.identifier = new Date()
      this.filters.page = 1
      const response = await this.$axios.$get(this.url)
      this.users = response.data
      this.searching = false
      this.filters.page += 1
    },

    infiniteHandler($state) {
      this.$axios
        .$get(this.url)
        .then((response) => {
          if (response.data.length > 0) {
            if (response.meta.current_page <= response.meta.last_page) {
              response.data.forEach((item) => this.users.push(item))

              $state.loaded()
            } else {
              $state.loaded()

              $state.complete()
            }
          } else {
            $state.loaded()
            $state.complete()
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.filters.page += 1
    },
    /*  search() {
      this.searching = true
      this.loadingSubmit = true
      this.loader = 'loadingSubmit'
      this.$axios
        .$get(`/users?${this.queryString}`)
        .then((res) => {
          this.users = res.data
          this.users = Object.freeze(this.users)
        })
        .catch((e) => console.log(e))
        .finally(() => {
          this.searching = false
          this.loadingSubmit = false
          this.loader = null
        })
    }, */

    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
    /*    goTo(to, folderName) {
      this.hideModal()
      setTimeout(
        () => this.showModal({ componentName: to, folder: folderName }),
        300
      )
    }, */
  },
}
</script>

<style lang="scss" scoped>
.alert {
  text-align: center;
  margin: auto;
}
.v-application a {
  text-decoration: none;
}
.v-select__selections input {
  display: none;
}
.container {
  max-width: 100%;
  text-align: left;
}
.search-control {
  max-width: 100% !important;
  margin-top: 25px;
  margin-bottom: 0;
}
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
