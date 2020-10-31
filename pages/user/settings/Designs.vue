<template>
  <section>
    <template v-if="noArtworkYet === true">
      <v-alert
        v-model="alert"
        border="left"
        close-text="Close Alert"
        class="alert-success"
        dismissible
        transition="scale-transition"
      >
        <v-row align="center">
          <v-col class="grow">
            {{ message }}
          </v-col>
          <v-col class="shrink">
            <template v-if="$auth.loggedIn">
              <nuxt-link :to="localePath({ name: 'designs.upload' })">
                <v-btn v-bind="size" small class="upload-button mr-2"
                  ><v-icon v-bind="size" class="mr-2">mdi-cloud-upload</v-icon
                  >{{ $t('navbar.upload') }}</v-btn
                >
              </nuxt-link>
            </template>
            <template v-else>
              <v-btn
                v-bind="size"
                toggle-modal
                component-name="LoginForm"
                folder-name="auth"
                button-class="upload-button mr-2"
                icon="mdi-cloud-upload"
                >{{ $t('navbar.upload') }}</v-btn
              >
            </template>
          </v-col>
        </v-row>
      </v-alert>
    </template>
    <template v-else>
      <v-alert
        v-model="alert"
        border="left"
        close-text="Close Alert"
        class="alert-success"
        dismissible
        transition="scale-transition"
      >
        {{ message }}
      </v-alert>
      <v-data-table
        :headers="headers"
        :items="designs"
        class="elevation-1"
        mobile-breakpoint="0"
        :search="search"
        :loading="loading"
        :loading-text="$t('settingsDesigns.loading')"
        :footer-props="{
          showFirstLastPage: true,

          itemsPerPageText: $t('settingsDesigns.rowsPerPage'),
        }"
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
            <v-btn v-bind="size" color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
              >New Item</v-btn
            >
          </template> -->
              <v-card class="modalEditDelete">
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-divider class="mx-4"></v-divider>
                <v-card-text>
                  <v-container>
                    <!-- <img
                      v-if="editedItem"
                      :src="editedItem.images.minithumbnail"
                      class="text-center"
                    /> -->
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
                        v-model="form.tag"
                        :tags="editedItem.tags"
                        class="tags-input"
                        :placeholder="$t('tag.placeholder')"
                        :autocomplete-items="filteredItems"
                        @tags-changed="(newTags) => (tags = newTags)"
                      >
                        <template slot="autocomplete-header">
                          <strong>{{ $t('tag.selectTag') }} ↓</strong>
                        </template>
                        <template slot="autocomplete-footer">
                          <small>
                            <em>{{ $t('tag.keepYours') }}</em>
                          </small>
                        </template>
                      </vue-tags-input>
                    </client-only>

                    <v-checkbox
                      id="is_live"
                      v-model="form.is_live"
                      field="is_live"
                      :label="$t('editDesign.publishDesign')"
                    ></v-checkbox>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-bind="size" @click="close">{{
                    $t('editDesign.cancel')
                  }}</v-btn>
                  <!-- <v-btn v-bind="size"
                    color="blue darken-1"
                    :loading="loadingSubmit"
                    :disabled="$v.form.$invalid"
                    text
                    @click="save"
                    >{{ $t('editDesign.save') }}</v-btn
                  > -->
                  <v-btn
                    v-bind="size"
                    :loading="loadingSubmit"
                    :disabled="$v.form.$invalid"
                    @click="save"
                    >{{ $t('editDesign.save') }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:body="props">
        <tbody>
          <tr v-for="item in props.items" :key="item">
            <td class="d-block d-sm-table-cell">
              <div class="px-0 my-0 align-middle">
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
            </td>
            <td class="d-block d-sm-table-cell">
              <div class="px-2 my-2 align-middle">
            <p
              style="white-space: pre-wrap; max-width: 130px"
              class="text-truncate"
            >
              {{ item.title }}
            </p>
          </div>
            </td>
             </td>
            <td class="d-block d-sm-table-cell">
              <div class="px-2 my-2 align-middle d-block d-sm-table-cell">
            <p
              style="white-space: pre-wrap; max-width: 130px"
              class="text-truncate"
            >
              {{ item.description }}
            </p>
          </div>
            </td>
            <td class="d-block d-sm-table-cell">
              <div class="mr-3">
            <v-btn
              v-for="(tag, i) in item.tags"
              :key="`${i}-${tag}`"
              class="mr-1"
              style="align-self: center"
              x-small
              color="#662200"
              @click="goToTag(`${item.normalized[i]}`)"
              >{{ tag }}</v-btn
            >
            <!-- <v-chip
            v-for="(tag, i) in item.tags"
            :key="`${i}-${tag}`"
            class="ma-1"
            color="#ffffff"
            label
            outlined
          >
            {{ tag }}
          </v-chip> -->
          </div>
            </td>
            <td class="d-block d-sm-table-cell">
              <div class="mr-3">
            <is-live :item="item" @toggleIsLive="updateItem(item)"></is-live>
          </div>
            </td>
            <td class="d-block d-sm-table-cell">
              <v-icon v-bind="size" small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon v-bind="size" small @click="confirmDeleteItem(item)">
            mdi-delete
          </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
       
        <template v-slot:no-data>
          <v-btn v-bind="size" color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
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
          @closeDialog="hideModal()"
          @destroyItem="deleteItem()"
        />
      </keep-alive>
    </template>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
export default {
  /* components: {
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
        normalized: [],
        slug: '',
        assign_to_team: false,
        team: null,
      }),
      dialog: false,
      snackbar: false,
      mobileBreakpoint: 600,
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
        tag: '',
        tags: [],
        normalized: [],
        assign_to_team: false,
        team: null,
        images: {},
      },
      defaultItem: {
        title: '',
        description: '',
        is_live: false,
        tag: '',
        tags: [],
        normalized: [],
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
      tags: [],
      message: '',
      chip4: true,
      noArtworkYet: false,
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
  mounted() {
    this.getAllTags()
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
        return i.text.toLowerCase().includes(this.form.tag.toLowerCase())
      })
    },
    simpleStringArrayTags() {
      return this.tags.map((tag) => tag.text)
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

  watch: {
    dialog(val) {
      val || this.close()
    },
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
      this.message = this.$i18n.t('settingsDesigns.uploadDoneMessage')
    }
  },

  methods: {
    ...mapActions(['showModal', 'hideModal']),
    async getAllTags() {
      this.allTags = []
      const response = await this.$axios.$get('tags')
      // console.log(response)
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
        design.normalized = design.tag_list.normalized
        this.designs[index] = design
      })
      if (this.designs.length < 1) {
        this.noArtworkYet = true
        this.message = this.$i18n.t('settingsDesigns.noArtworkYetMessage')
        this.alert = true
      }
      this.loading = false
    },

    editItem(item) {
      this.editedIndex = this.designs.indexOf(item)
      this.editedItem = Object.assign({}, item)
      // this.editedItem.tags = this.editedItem.tag_list.tags
      this.editedItem.tag = ''
      this.editedItem.tags = this.editedItem.tags.map((string) => ({
        text: string,
      }))
      this.tags = this.editedItem.tags
      // this.editedItem.tags = this.editedItem.tag_list.tags
      this.form = {
        title: this.editedItem.title,
        description: this.editedItem.description,
        is_live: this.editedItem.is_live,
        tags: this.editedItem.tags,
        tag: '',
        assign_to_team: false,
        team: null,
      }
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
      this.loadingSubmit = true
      let design = await this.$axios.$get(`/designs/${item.id}/byUser`)
      design = design.data
      design.tags = design.tag_list.tags
      design.normalized = design.tag_list.normalized
      if (design.is_live === 1) {
        design.link = true
      } else {
        design.link = false
      }
      // this.editedItem = design
      this.designs[this.designs.indexOf(item)] = design
      this.loadingSubmit = false
    },
    deleteItem() {
      const index = this.designs.indexOf(this.itemToDelete)
      this.designs.splice(index, 1)
      const res = this.$axios.$delete(`/designs/${this.itemToDelete.id}`)
      this.alert = true
      this.message = this.$i18n.t('settingsDesigns.deleteDoneMessage')
      // this.initialize()

      this.hideModal()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.form = Object.assign({}, this.defaultItem)
        this.tags = []
        // this.initialize()
      })
    },
    closeDelete() {
      this.dialogDelete = false
    },

    async save() {
      // this.tags = this.editedItem.tags
      if (this.editedIndex > -1) {
        const editedForm = {
          title: this.form.title,
          description: this.form.description,
          is_live: this.form.is_live,
          tags: this.simpleStringArrayTags,
          normalized: this.simpleStringArrayTags,
          assign_to_team: false,
          team: null,
          tag_list: {
            tags: this.simpleStringArrayTags,
            normalized: this.simpleStringArrayTags,
          },
        }
        Object.assign(this.designs[this.editedIndex], editedForm)
        if (!editedForm.tags) {
          editedForm.tags = []
          editedForm.normalized = []
        }
      } else {
        this.designs.push(this.editedForm)
      }

      const form = {
        title: this.form.title,
        description: this.form.description,
        is_live: this.form.is_live,
        tags: this.simpleStringArrayTags,
        assign_to_team: false,
        team: null,
      }

      const res = await this.$axios
        .put(`/designs/${this.editedItem.id}`, form)
        .then((response) => {
          this.alert = true
          this.message = this.$i18n.t('settingsDesigns.editDoneMessage')
          this.updateItem(this.editedItem)
        })
      this.close()
    },
    goToTag(tagParam) {
      this.$router.push({ name: 'designs.tag', params: { tag: tagParam } })
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
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).upload-button {
  background-color: rgba(31, 124, 142, 0.65);
}
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
