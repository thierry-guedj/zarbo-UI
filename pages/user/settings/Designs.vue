<template>
  <section>
    <v-alert
      v-model="alert"
      border="left"
      close-text="Close Alert"
      class="alert-success"
      dismissible
    >
      {{ $t('settingsDesigns.uploadDoneMessage') }}
    </v-alert>
    <template v-if="designs.length < 1"> </template>
    <template v-else>
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
            <!-- <img src="/settingsArtworksIcon.png" class="iconTitle ml-3 mr-2" /> -->
            <v-toolbar-title>{{
              $t('settingsDesigns.artwork')
            }}</v-toolbar-title>
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
              <v-card class="modalEditDelete">
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-divider class="mx-4"></v-divider>
                <!--  <img
                  :src="editedItem.images.thumbnail"
                  :lazy-src="editedItem.images.minithumbnail"
                  :alt="editedItem.title"
                  max-width="80px"
                /> -->
                <v-card-text>
                  <v-container>
                    <v-text-field
                      v-model.trim="$v.form.title.$model"
                      :error-messages="titleErrors"
                      :counter="120"
                      :label="$t('editDesign.title')"
                      field="title"
                      outlined
                      class="mb-1"
                      @input="$v.form.title.$touch()"
                      @blur="$v.form.title.$touch()"
                    ></v-text-field>

                    <v-textarea
                      v-model.trim="$v.form.description.$model"
                      :error-messages="descriptionErrors"
                      :counter="3000"
                      :label="$t('editDesign.description')"
                      outlined
                      class="mb-1"
                      field="description"
                      @input="$v.form.description.$touch()"
                      @blur="$v.form.description.$touch()"
                    ></v-textarea>

                    <!-- <client-only>
                    <input-tag
                      v-model="editedItem.tags"
                      :tags="editedItem.tags"
                      field="tags"
                      class="mb-1"
                      :placeholder="$t('editDesign.tagsLabel')"
                      on-paste-delimiter=","
                      outlined
                    ></input-tag>
                  </client-only> -->
                    <client-only>
                      <vue-tags-input
                        v-model="editedItem.tag"
                        :tags="editedItem.tags"
                        class="tags-input"
                        :autocomplete-items="filteredItems"
                        @tags-changed="(newTags) => (tags = newTags)"
                      >
                        <template slot="autocomplete-header">
                          <strong>Select a tag here ↓</strong>
                        </template>
                        <template slot="autocomplete-footer">
                          <small>
                            <em>Or keep going with yours...</em>
                          </small>
                        </template>
                      </vue-tags-input>
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
                  <v-btn color="blue darken-1" text @click="close">{{
                    $t('editDesign.cancel')
                  }}</v-btn>
                  <v-btn
                    color="blue darken-1"
                    :loading="loadingSubmit"
                    :disabled="$v.form.$invalid"
                    text
                    @click="save"
                    >{{ $t('editDesign.save') }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.image="{ item }">
          <div v-if="item.is_live" class="px-2 my-2 align-middle">
            <nuxt-link
              :to="{ name: 'design.details', params: { id: item.id } }"
            >
              <img
                :src="item.images.thumbnail"
                :lazy-src="item.images.minithumbnail"
                :alt="item.title"
                max-width="80px"
              />
            </nuxt-link>
          </div>
          <div v-else>
            <img
              :src="item.images.thumbnail"
              :lazy-src="item.images.minithumbnail"
              :alt="item.title"
              max-width="80px"
            />
          </div>
        </template>
        <!--  <template v-slot:item.tags="{ item }">
        <div class="mr-3">
          <ul class="ti-tag ti-valid">
            <li :key="tag" :v-for="tag in item.tags" class="ti-tag ti-valid">
              {{ tag }}
            </li>
          </ul>
        </div>
      </template> -->
        <template v-slot:item.is_live="{ item }">
          <div class="mr-3">
            <is-live :item="item" @toggleIsLive="updateItem(item)"></is-live>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="confirmDeleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </template>
    <!-- <confirm-delete
          :item="item"
          :dialog.sync="dialogDelete"
          @deleteItem="deleteItem(item)"
        /> -->
    <!-- Modal  -->
    <keep-alive>
      <base-modal
        class="modalEditDelete"
        :dialog.sync="visible"
        @showDesign="styleModal()"
        @closeDialog="hideModal()"
        @destroyItem="deleteItem()"
      />
    </keep-alive>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
export default {
  /*  components: {
    InputTag: () => import('vue-input-tag'),
  }, */
  data() {
    return {
      form: this.$vform({
        title: ' ',
        description: '',
        is_live: '',
        tag: '',
        tags: [],
        slug: '',
        /*  assign_to_team: false,
        team: null, */
      }),
      dialog: false,
      snackbar: false,
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
        images: {},
        tag: '',
        tags: [],
        assign_to_team: false,
        team: null,
      },
      defaultItem: {
        title: '',
        description: '',
        is_live: false,
        tag: '',
        tags: [],
        assign_to_team: false,
        team: null,
      },
      loading: true,
      search: '',
      dialogDelete: false,
      alert: false,
      loadingSubmit: false,
      autocompleteItems: [],
      allTags: [],
    }
  },
  validations: {
    form: {
      title: {
        maxLen: maxLength(120),
      },
      description: {
        maxLen: maxLength(3000),
      },
    },
  },

  computed: {
    titleErrors() {
      const errors = []
      if (!this.$v.form.title.$dirty) return errors
      !this.$v.form.title.maxLen &&
        errors.push(this.$i18n.t('validation.titleMaxLength'))
      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.form.description.$dirty) return errors
      !this.$v.form.description.maxLen &&
        errors.push(this.$i18n.t('validation.descriptionMaxLength'))

      return errors
    },
    formTitle() {
      return this.$i18n.t('editDesign.editItem')
    },
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getItem']),
    itemToDelete() {
      return this.getItem
    },
    slug() {
      const slug = this.sanitizeTitle(this.form.title)
      return slug
    },
    filteredItems() {
      return this.autocompleteItems.filter((i) => {
        return i.text.toLowerCase().includes(this.editedItem.tag.toLowerCase())
      })
    },
    simpleStringArrayTags() {
      return this.tags.map((tag) => tag.text)
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  mounted() {
    this.getAllTags()
  },
  beforeRouteUpdate(to, from, next) {
    if (from.params.upload) {
      this.snackbar = true
    }

    next()
  },
  created() {
    this.initialize()
    if (this.$route.params.upload) {
      this.alert = true
    }
  },

  methods: {
    ...mapActions(['showModal', 'hideModal']),
    async getAllTags() {
      this.allTags = []
      const response = await this.$axios.$get('tags')
      console.log(response)
      this.allTags = response
      this.autocompleteItems = this.allTags.map((item) => {
        return {
          text: item.name,
        }
      })
    },
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
      // this.editedItem.images = item.images
      const tempTags = this.editedItem.tags
      /* this.tags = tempTags.map((item) => {
        return {
          text: item.name,
        }
      }) */
      console.log(this.designs)
      console.log(this.editedItem.tags)
      console.log(this.tags)

      /* this.form = {
        title: this.editedItem.title,
        description: this.editedItem.description,
        is_live: this.editedItem.is_live,
        tags: this.tags,
        images: this.editedItem.images,
        assign_to_team: false,
        team: null,
      } */
      this.dialog = true
    },
    confirmDeleteItem(item) {
      this.showModal({
        componentName: 'ConfirmDelete',
        folder: 'designs',
        item,
      })
    },
    async updateItem(item) {
      let design = await this.$axios.$get(`/designs/${item.id}/byUser`)
      design = design.data
      design.tags = design.tag_list.tags
      this.editedItem = design
      this.designs[this.designs.indexOf(item)] = design
    },
    deleteItem() {
      const index = this.designs.indexOf(this.itemToDelete)
      this.designs.splice(index, 1)
      const res = this.$axios.$delete(`/designs/${this.itemToDelete.id}`)

      this.hideModal()
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
        const editedForm = {
          title: this.$v.form.title.$model,
          description: this.$v.form.description.$model,
          is_live: this.editedItem.is_live,
          tags: this.simpleStringArrayTags,

          images: this.editedItem.images,
          assign_to_team: false,
          team: null,
        }
        editedForm.tag_list.tags = editedForm.tags
        /* if (!editedForm.tags) {
          editedForm.tags = []
        } else {
          editedForm.tags = this.simpleStringArrayTags
        } */
        console.log(editedForm.tags)
        Object.assign(this.designs[this.editedIndex], editedForm)
      } else {
        this.designs.push(this.editedForm)
      }

      const form = {
        title: this.$v.form.title.$model,
        description: this.$v.form.description.$model,
        is_live: this.editedItem.is_live,
        tags: this.simpleStringArrayTags,

        images: this.editedItem.images,
        assign_to_team: false,
        team: null,
      }
      console.log(form.tags)
      const res = await this.$axios
        .put(`/designs/${this.editedItem.id}`, form)
        .then((response) => {
          this.alert = true
          this.tags = []
          this.editedItem = {}
        })
      this.close()
    },
    sanitizeTitle(title) {
      let slug = ''
      // Change to lower case
      const titleLower = title.toLowerCase()
      // Letter "e"
      slug = titleLower.replace(/e|é|è|ẽ|ẻ|ẹ|ê|ế|ề|ễ|ể|ệ/gi, 'e')
      // Letter "a"
      slug = slug.replace(/a|á|à|ã|ả|ạ|ă|ắ|ằ|ẵ|ẳ|ặ|â|ấ|ầ|ẫ|ẩ|ậ/gi, 'a')
      // Letter "o"
      slug = slug.replace(/o|ó|ò|õ|ỏ|ọ|ô|ố|ồ|ỗ|ổ|ộ|ơ|ớ|ờ|ỡ|ở|ợ/gi, 'o')
      // Letter "u"
      slug = slug.replace(/u|ú|ù|ũ|ủ|ụ|ư|ứ|ừ|ữ|ử|ự/gi, 'u')
      // Letter "d"
      slug = slug.replace(/đ/gi, 'd')
      // Trim the last whitespace
      slug = slug.replace(/\s*$/g, '')
      // Change whitespace to "-"
      slug = slug.replace(/\s+/g, '-')

      return slug
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/tags.scss';
/* .vue-input-tag-wrapper {
  background-color: #0f1219 !important;
  border-radius: 4px;
  border: 1px thin;
  border-color: rgba(255, 255, 255, 0.24);
  color: whitesmoke;
}
.vue-input-tag-wrapper .input-tag {
  background-color: #004d40 !important;
  border-radius: 4px !important;
  color: whitesmoke !important;
  display: inline-block;
  font-size: 15px !important;
  font-weight: 400;
  margin-bottom: 4px;
  margin-right: 4px;
  padding: 3px;
} */
img {
  max-width: 100%;
  height: auto;
  width: auto\9; /* ie8 */
}
.container {
  // max-width: 100% !important;
  text-align: left;
}
.editItem {
  background-color: #0f1219;
}
/* .theme--dark.v-data-table {
  background-color: #0f1219;
} */
.modalEditDelete {
  background-color: #0f1219 !important;
}
</style>
