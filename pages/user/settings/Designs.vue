<template>
  <section>
    <v-data-table
      :headers="headers"
      :items="designs"
      sort-by="calories"
      class="elevation-1"
      :search="search"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t('settingsDesigns.artwork') }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('settingsDesigns.search')"
            single-line
            hide-details
          ></v-text-field>

          <v-dialog v-model="dialog" max-width="600px" class="editItem">
            <!-- <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
              >New Item</v-btn
            >
          </template> -->
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>
              <v-card-text>
                <v-container>
                  <v-text-field
                    v-model="editedItem.title"
                    :label="$t('editDesign.title')"
                    field="title"
                  ></v-text-field>

                  <v-textarea
                    v-model.trim="editedItem.description"
                    :counter="155"
                    :label="$t('editDesign.description')"
                    outlined
                    class="mb-1"
                    field="description"
                  ></v-textarea>

                  <client-only>
                    <input-tag
                      v-model="editedItem.tags"
                      :tags="editedItem.tags"
                      field="tags"
                      class="mb-1"
                      :placeholder="$t('editDesign.tagsLabel')"
                      on-paste-delimiter=","
                      outlined
                    ></input-tag>
                  </client-only>

                  <v-checkbox
                    id="is_live"
                    v-model="editedItem.is_live"
                    field="is_live"
                    :label="$t('editDesign.publishDesign')"
                  ></v-checkbox>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.image="{ item }">
        <div class="px-2 my-2 align-middle">
          <v-img
            :src="item.images.thumbnail"
            :lazy-src="item.images.minithumbnail"
            :alt="item.title"
            max-width="120px"
          >
          </v-img>
        </div>
      </template>
      <template v-slot:item.is_live="{ item }">
        <div class="mr-3">
          <is-live :item="item" @toggleIsLive="updateItem(item)"></is-live>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <!-- <confirm-delete :item="item" :dialog.sync="dialogDelete" /> -->
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </section>
</template>

<script>
export default {
  components: {
    InputTag: () => import('vue-input-tag'),
  },
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: this.$i18n.t('settingsDesigns.image'),
          value: 'image',
          sortable: false,
          align: 'start',
          width: '15%',
        },
        {
          text: this.$i18n.t('settingsDesigns.title'),
          align: 'start',
          sortable: true,
          value: 'title',
        },
        {
          text: this.$i18n.t('settingsDesigns.description'),
          align: 'start',
          sortable: true,
          value: 'description',
        },
        {
          text: this.$i18n.t('settingsDesigns.tags'),
          align: 'start',
          sortable: true,
          value: 'tags',
        },
        {
          text: this.$i18n.t('settingsDesigns.status'),
          value: 'is_live',
          // width: '20%',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      designs: [],
      editedIndex: -1,
      editedItem: {
        title: '',
        description: '',
        is_live: false,
        tags: [],
        assign_to_team: false,
        team: null,
      },
      defaultItem: {
        title: '',
        description: '',
        is_live: false,
        tags: [],
        assign_to_team: false,
        team: null,
      },
      /*  form: {
        title: '',
        description: '',
        is_live: false,
        tags: [],
        assign_to_team: false,
        team: null,
      }, */
      loading: true,
      search: '',
      dialogDelete: false,
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$i18n.t('editDesign.newItem')
        : this.$i18n.t('editDesign.editItem')
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.designs = []
      const { data } = await this.$axios.$get(
        `/users/${this.$auth.user.id}/designs`
      )
      this.designs = data

      this.designs.forEach((design, index) => {
        design.tags = design.tag_list.tags
        this.designs[index] = design
      })
      this.loading = false
    },

    editItem(item) {
      this.editedIndex = this.designs.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.tags = this.editedItem.tag_list.tags
      this.dialog = true
    },
    async updateItem(item) {
      let design = await this.$axios.$get(`/designs/${item.id}/byUser`)
      design = design.data
      design.tags = design.tag_list.tags
      this.editedItem = design
      this.designs[this.designs.indexOf(item)] = design
    },
    deleteItem(item) {
      /* confirm('Are you sure you want to delete this item?') &&
        this.designs.splice(index, 1) */
      const options = {
        loader: true, // set to true if you want the dailog to show a loader after click on "proceed"

        okText: this.$i18n.t('settingsDesigns.delete'),
        cancelText: this.$i18n.t('settingsDesigns.cancel'),
        animation: 'zoom', // Available: "zoom", "bounce", "fade"
        customClass: 'custom-dialog', // Custom class to be injected into the parent node for the current dialog instance
      }
      this.$dialog
        .confirm(this.$i18n.t('settingsDesigns.confirmDelete'), options)
        .then((dialog) => {
          console.log('Clicked on confirm')

          const res = this.$axios.$delete(`/designs/${item.id}`)
          const index = this.designs.indexOf(item)
          this.designs.splice(index, 1)

          dialog.loader = false
          dialog.close()
        })
        .catch(function () {
          console.log('Clicked on cancel')
        })
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete() {
      this.dialogDelete = false
    },

    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.designs[this.editedIndex], this.editedItem)
      } else {
        this.designs.push(this.editedItem)
      }
      if (!this.editedItem.tags) {
        this.editedItem.tags = []
      }

      const form = {
        title: this.editedItem.title,
        description: this.editedItem.description,
        is_live: this.editedItem.is_live,
        tags: this.editedItem.tags,
        assign_to_team: false,
        team: null,
      }

      const res = await this.$axios.put(`/designs/${this.editedItem.id}`, form)
      /* this.form
        .put(`/designs/${this.editedItem.id}`)
        .then((res) => {
          setTimeout(() => {
            this.$router.push({ name: 'settings.designs' })
          }, 1000)
        })
        .catch((err) => console.log(err.response))
        .finally(() => {
          
          this.loader = null
          this.loadingSubmit = false
        }) */

      this.close()
    },
  },
}
</script>

<style lang="scss">
.theme--dark.v-sheet.v-card {
  background-color: #0f1219;
}
.vue-input-tag-wrapper {
  background-color: #0f1219 !important;
  border-radius: 4px;
  border: 1px thin;
  border-color: rgba(255, 255, 255, 0.24);
  color: whitesmoke;
}
.vue-input-tag-wrapper .input-tag {
    background-color: #004D40 !important;
    border-radius: 4px !important;
    border: 1px solid #a5d24a;
    color: whitesmoke !important;
    display: inline-block;
    font-size: 15px !important;
    font-weight: 400;
    margin-bottom: 4px;
    margin-right: 4px;
    padding: 3px;
}
img {
  max-width: 100%;
  height: auto;
  width: auto\9; /* ie8 */
}
.container {
  max-width: 100% !important;
}
.editItem {
  background-color: #0f1219;
}
.theme--dark.v-data-table {
  background-color: #0f1219;
}
.custom-dialog {
  font-family: 'Josefin Sans', sans-serif;
  color: whitesmoke;
}
.dg-btn--cancel {
  color: whitesmoke;
  background-color: transparent;
  border: none;
}
.dg-btn--ok {
  color: whitesmoke;
  background-color: transparent;
  border: none;
}
.dg-content-cont {
  width: 100%;
  font-family: 'Josefin Sans', sans-serif;
  color: whitesmoke;
}
.dg-main-content {
  width: 98%;
  /*width: calc(98% - 30px);*/
  max-width: 400px;
  padding: 15px;
  border-radius: 5px;
  margin: 25px auto;
  background-color: #0f1219;
}
</style>
