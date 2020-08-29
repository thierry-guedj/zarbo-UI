<template>
  <v-row justify="center">
    <v-card width="100%" class="card-design">
      <v-card-title>
        {{ $t('settingsDesigns.artwork') }}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :options.sync="options"
        :server-items-length="totalDesigns"
        :items="designs"
        :items-per-page="5"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item.image="{ item }">
          <div class="px-2 my-2 align-middle">
            <v-img
              :src="item.images.thumbnail"
              :alt="item.title"
              width="120px"
            ></v-img>
          </div>
        </template>

        <template v-slot:item.is_live="{ item }">
          <div class="mr-3">
            <is-live :id="item.id" :is_live="item.is_live"></is-live>
          </div>
        </template>
        <template v-slot:item.id="{ item }">
          <div class="ml-3 float-right">
            <nuxt-link :to="{ name: 'designs.edit', params: { id: item.id } }"
              ><v-btn
                class="my-2 align-middle"
                fab
                dark
                small
                color="transparent"
              >
                <v-icon dark>edit</v-icon></v-btn
              >
            </nuxt-link>
          </div>
        </template>
        <template v-slot:item.description="{ item }">
          <div class="ml-3 float-right">
            <v-btn
              class="my-2 align-middle"
              fab
              dark
              small
              color="transparent"
              @click.native="destroy(item.id)"
            >
              <v-icon dark>delete_forever</v-icon></v-btn
            >
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar
      :value="visibleSnackbar"
      class="v-snackbar"
      multi-line
      timeout="2000"
      color="teal darken-4"
      top
      vertical
      @input="hideSnackbar()"
      @close="hideSnackbar()"
    >
      Your design has been deleted
      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="hideSnackbar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  middleware: ['auth'],
  layout: 'page2',
  data() {
    return {
      designs: [],
      loading: true,
      search: '',
      dialog: true,
      totalDesigns: 0,
      options: {},
      headers: [
        {
          text: this.$i18n.t('settingsDesigns.image'),
          value: 'image',
          sortable: false,
          width: '15%',
        },
        {
          text: this.$i18n.t('settingsDesigns.title'),
          align: 'start',
          sortable: true,
          value: 'title',
        },
        /* {
          text: 'Uploaded',
          align: 'start',
          sortable: true,
          value: 'created_at_dates.created_at_human',
        }, */
        {
          text: this.$i18n.t('settingsDesigns.status'),
          value: 'is_live',
          width: '20%',
        },
        {
          text: this.$i18n.t('settingsDesigns.edit'),
          value: 'id',
          width: '8%',
        },
        {
          text: this.$i18n.t('settingsDesigns.delete'),
          value: 'description',
          width: '8%',
        },
        // { text: 'Actions', value: '' },
      ],

      loadingSubmit: false,
    }
  },
  watch: {
    options: {
      handler() {
        this.fetchUserDesigns().then((data) => {
          this.designs = data
          this.totalDesigns = data.length
        })
      },
      deep: true,
    },
  },
  mounted() {
    this.hideSnackbar()
    this.getDataFromApi().then((data) => {
      this.designs = data
      this.totalDesigns = data.length
    })
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'visibleSnackbar']),
  },
  /*   created() {
    this.fetchUserDesigns()
  }, */
  methods: {
    async fetchUserDesigns() {
      //this.designs = []
      const dataTemp = await this.$axios.$get(`/users/${this.$auth.user.id}/designs`)
      console.log(dataTemp)
      this.designs = dataTemp.data
      return this.designs
      // return dataTemp
      /*   this.designs = data
      this.loading = false
      this.loadingSubmit = false */
    },
    async destroy(id) {
      this.loading = true
      try {
        const res = await this.$axios.$delete(`/designs/${id}`)
      } catch (err) {
        console.log(err)
      } finally {
        await this.fetchUserDesigns()
        this.showSnackbar()
        this.loading = false
      }
    },
    getDataFromApi() {
      this.loading = true
      return new Promise((resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options

       
        let items = this.fetchUserDesigns()
        const total = items.length

        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]]
            const sortB = b[sortBy[0]]

            if (sortDesc[0]) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }

        if (itemsPerPage > 0) {
          items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        }

        setTimeout(() => {
          this.loading = false
          resolve({
            items,
            total,
          })
        }, 1000)
      })
    },
    ...mapActions(['showModal', 'hideModal', 'showSnackbar', 'hideSnackbar']),
    goTo(to, folderName) {
      this.hideModal()
      setTimeout(
        () => this.showModal({ componentName: to, folder: folderName }),
        300
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.v-chip.v-size--default {
  height: 25px;
}
.v-data-table {
  line-height: 0.5;
  padding: 6px;
}
.card-designs {
  background-color: rgba(23, 22, 18, 0.85);
  padding: 12px;
  border-radius: 12px;
}
.v-data-table__wrapper {
  background-color: rgba(23, 22, 18, 0.5);
}
.theme--dark.v-data-table {
  background-color: #0f1219;
}
.modal {
  max-height: 60%;
}
.v-dialog:not(.v-dialog--fullscreen) {
  height: 70%;
}
.container {
  max-width: 100%;
}
.theme--dark.v-sheet {
  background-color: #0f1219;
}
.v-sheet.v-list:not(.v-sheet--outlined) {
  background-color: #0f1219;

  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);
}
</style>
