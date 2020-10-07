<template>
  <section>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      fab
      dark
      fixed
      bottom
      right
      color="accent"
      @click="toTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
    <v-container class="p-0 m-0 row-designs">
      <section class="hero text-white">
        <!-- <v-container> -->
        <v-row class="row-md-12">
          <v-col class="col-md-2 text-center iconTitle">
            <img src="/createIcon.png" class="ml-3 mr-2"
          /></v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col class="col-md-9">
            <p class="titlePage text-white">
              {{ $t('create.uploadArtwork') }}
            </p>
            <p>
              Vous pouvez, ci-dessous, séléctionner une image sur votre
              ordinateur ou la déposer directement. Vous pouvez compléter
              également les informations suivantes: titre, description,
              mots-clé.
            </p>
          </v-col>
        </v-row>
      </section>
    </v-container>
    <v-container>
      <v-row>
        <v-col class="col-md-6 edit-info">
          <v-card width="100%" class="mx-auto">
            <!--  <v-card-title class="headline"
              ><i class="material-icons md-24 mr-4">cloud_upload</i
              >{{ $t('create.uploadArtwork') }}</v-card-title
            > -->

            <v-card-text>
              <div v-if="error" class="alert alert-danger">
                <p>An error occurred during the upload process</p>
                <p>{{ error }}</p>
              </div>

              <div>
                <p v-if="dialog_msg !== ''" class="alert alert-warning">
                  {{ dialog_msg }}
                </p>
                <div v-if="uploading" class="text-success caption-sm mt-2">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-success"
                    :style="{ width: uploadPercentage + '%' }"
                  ></div>
                </div>
                <slim-cropper :options="slimOptions" class="text-black">
                  <input type="file" name="image" />
                </slim-cropper>
                <div id="progress" class="progress">
                  <div
                    class="progress-bar progress-bar-success"
                    :style="{ width: uploadPercentage + '%' }"
                  ></div>
                </div>
                <p v-if="dialog_msg !== ''" class="alert alert-warning">
                  {{ dialog_msg }}
                </p>
                <div v-if="uploading" class="text-success caption-sm mt-2">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </div>

              <!-- <div v-if="uploading" class="text-success caption-sm mt-2">
             
              <div class="loader">
                <Circle8></Circle8>
              </div>
            </div> -->
            </v-card-text>
            <div class="upload-para mt-2 ml-4">
              <p class="font-14 fw-400">
                {{ $t('create.uploadNotice') }}
              </p>
            </div>
          </v-card>
        </v-col>
        <v-col class="col-md-5 edit-info ml-2">
          <v-card flat>
            <v-card-text>
              <form class="auth-form" @submit.prevent="submit">
                <!-- <v-alert
                  v-if="this.$v.form.$model.successful"
                  color="#388E3C"
                  dark
                  icon="mark_email_unread"
                  border="right"
                  :form="form"
                  >Design successfully updated</v-alert
                > -->
                <v-text-field
                  v-model.trim="$v.form.title.$model"
                  :error-messages="titleErrors"
                  :counter="120"
                  :label="$t('create.title')"
                  field="title"
                  outlined
                  class="mb-1"
                  @input="$v.form.title.$touch()"
                  @blur="$v.form.title.$touch()"
                ></v-text-field>
                <has-error :form="form" field="title"></has-error>
                <v-textarea
                  v-model.trim="$v.form.description.$model"
                  :error-messages="descriptionErrors"
                  :counter="3000"
                  :label="$t('create.description')"
                  outlined
                  class="mb-1"
                  field="description"
                  @input="$v.form.description.$touch()"
                  @blur="$v.form.description.$touch()"
                ></v-textarea>
                <has-error :form="form" field="description"></has-error>
                <!--  <v-textarea
                  v-model.trim="$v.form.description"
                  :counter="155"
                  :label="$t('editDesign.description')"
                  outlined
                  class="mb-1"
                  field="description"
                ></v-textarea> -->
                <p class="tags-notice">{{ $t('create.tagsNotice') }}</p>
                <p class="tags-notice">{{ $t('create.tagsNotice2') }}</p>
                <!-- <client-only>
                  <input-tag
                    v-model="form.tags"
                    :tags="form.tags"
                    field="tags"
                    class="mb-1"
                    :placeholder="$t('create.tagsLabel')"
                    on-paste-delimiter=","
                    outlined
                  ></input-tag>
                </client-only> -->
                <no-ssr>
                  <vue-tags-input
                    v-model="form.tag"
                    :tags="form.tags"
                    :autocomplete-items="filteredItems"
                    @tags-changed="(newTags) => (tags = newTags)"
                  />
                </no-ssr>
                <v-checkbox
                  id="is_live"
                  v-model="form.is_live"
                  field="is_live"
                  :label="$t('create.publishDesign')"
                ></v-checkbox>

                <v-spacer class="mb-3" />
                <v-btn :disabled="uploading" @click="clear">{{
                  $t('create.clear')
                }}</v-btn>
                <v-btn
                  class="slim-btn2 slim-btn-upload2"
                  title="Upload"
                  type="button"
                  data-action="upload"
                  style="opacity: 1;"
                  :loading="loadingSubmit"
                  :disabled="!uploadButton"
                  @click="submit"
                  >{{ $t('create.upload') }}</v-btn
                >
              </form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
import { mapActions } from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
// import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
// import $axios from '@nuxtjs/axios'
import Slim from '@/components/slim/slim.vue'

export default {
  name: 'Create',
  middleware: ['auth'],
  layout: 'designs-listing',
  components: {
    // InputTag: () => import('vue-input-tag'),
    'slim-cropper': Slim,
  },
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
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
  /* async asyncData() {
    const url = `tags`
    const response = await this.$axios.$get(url)
    this.allTags = response
    console.log(this.allTags)
    this.autocompleteItems = this.allTags.map((item) => {
      return {
        text: item.name,
      }
    })
  }, */
  data() {
    return {
      form: this.$vform({
        title: '',
        description: '',
        is_live: true,
        tag: '',
        tags: [],
        slug: '',
        /*  assign_to_team: false,
        team: null, */
      }),

      slimOptions: {
        service: this.slimService,
        post: 'output',
        defaultInputName: 'image',
        label: this.$i18n.t('create.selectImage'),
        ratio: 'free',
        maxFileSize: 10,
        didLoad: this.imageLoaded,
        didRemove: this.imageRemoved,
        didUpload: this.imageUploaded,
        statusUploadSuccess: this.$i18n.t('create.saved'),
      },
      loader: null,
      loadingSubmit: false,
      uploadButton: false,
      uploading: false,
      error: '',
      progressWidth: 0,
      uploadPercentage: 0,
      dialog_msg: '',
      design: null,
      successFunction: null,
      uploadIsOk: false,
      fab: false,
      autocompleteItems: [],
      allTags: [],
    }
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
    slug() {
      const slug = this.sanitizeTitle(this.form.title)
      return slug
    },
    filteredItems() {
      return this.autocompleteItems.filter((i) => {
        return i.text.toLowerCase().includes(this.tag.toLowerCase())
      })
    },
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]
    },
    uploadIsOk() {
      this.update(this.design.id)
    },
  },
  mounted() {
    const slibtn = document.getElementsByClassName('slim-btn-upload')
    slibtn[0].style.display = 'none'
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    async getAllTags() {
      await this.$axios.$get('tags').then((response) => {
        return response
      })
    },
    slimService(formdata, progress, success, failure) {
      this.successFunction = success
      this.$axios
        .post('designs', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = parseInt(
              (progressEvent.loaded / progressEvent.total) * 100,
              10
            )
            progress(progressEvent.loaded, progressEvent.total)
            if (this.uploadPercentage === 100) {
              this.dialog_msg = this.$i18n.t('create.stillUploading')
            }
          }.bind(this),
        })
        .then((res) => {
          // this.update(res.data.id)
          this.checkUpload(res.data.id)
          console.log(this.design)
          /* if (this.design) {
            // this.uploadIsOk = true
            this.update(this.design.id)
          } */
        })
        .catch((err) => console.log(err.response))
      /* .catch((err) => {
          const message = err.response.data.errors
          this.error = message[Object.keys(message)[0]][0]
          failure(500)
        }) */
    },
    imageLoaded(error, data, response) {
      console.log(error, data, response)
      const slibtn = document.getElementsByClassName('slim-btn-upload')
      slibtn[0].style.display = 'none'
      this.uploadButton = true
      return true
    },
    imageRemoved(data) {
      console.log(data)
      this.uploadButton = false
    },
    imageUploaded(error, data, response) {
      console.log(error, data, response)
    },
    async checkUpload(id) {
      const upOk = await this.$axios
        .$get(`designs/${id}/uploadIsSuccessful`)
        .then((response) => {
          // setTimeout(this.update(id), 10000)
          // this.design = response.data
          // this.uploadIsOk = true
          console.log(response.data)
          this.design = response.data
          this.update(this.design.id)

          /* const imageUrl = response.data.images.thumbnail
          fetch(imageUrl, { method: 'HEAD' }).then((res) => {
            if (res.ok) {
              this.update(response.data.id)
              return uploadIsOk
            } else {
              console.log('Image does not exist.')
            }
          }) */
          /* const imageUrl = response.data.images.thumbnail
          fetch(imageUrl, { method: 'HEAD' })
            .then((res) => {
              if (res.ok) {
              } else {
                console.log('Image does not exist.')
              }
            })
            .catch((err) => console.log('Error:', err)) */
        })
      /*    .finally(() => {
          setTimeout(this.update(id), 5000)
        }) */
    },

    update(id) {
      // this.uploadMessage(id)
      this.dialog_msg = this.$i18n.t('create.uploadSuccess')
      this.successFunction(this.slimOptions.statusUploadSuccess)
      if (this.form.is_live === false) {
        this.form.is_live = 0
      } else {
        this.form.is_live = 1
      }
      console.log(this.form.tags)

      this.form.slug = this.slug
      this.form
        .put(`designs/${id}`)
        .then((res) => {
          this.uploadDone()
        })
        .catch((err) => console.log(err.response))
    },
    /*     uploadMessage(id) {
      this.dialog_msg = this.$i18n.t('create.uploadSuccess')
      this.successFunction(this.slimOptions.statusUploadSuccess)
    }, */
    uploadDone() {
      this.form.busy = false
      this.loader = null
      this.loadingSubmit = false
      this.uploading = false

      setTimeout(
        this.$router.push({
          name: 'settings.designs',
          params: {
            upload: true,
          },
        }),
        1000
      )
    },
    submit() {
      this.form.busy = true
      this.uploading = true
      this.loader = 'loadingSubmit'
      const slibtn = document.getElementsByClassName('slim-btn-upload')
      slibtn[0].click()
    },
    clear() {
      this.form.reset()
      this.$v.form.$reset()
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
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
  },
}
</script>

<style lang="scss" scoped>
.titlePage {
  font-size: 44px;
  padding-top: 20px;
  margin-bottom: 30px;
  line-height: 1em;
}
.iconTitle {
  max-width: 180px;
  min-width: 180px;
  max-width: 20%;
  min-width: 180px;
}
.vue-input-tag-wrapper {
  background-color: transparent !important;
  border-radius: 4px !important;
  border: 1px thin !important;
  border-color: rgba(255, 255, 255, 0.24) !important;
}
.vue-input-tag-wrapper .input-tag {
  background-color: #004d40 !important;
  border-radius: 4px !important;
  color: whitesmoke !important;
  display: inline-block;
  font-size: 15px !important;
  border: none !important;
  font-weight: 400;
  margin-bottom: 4px;
  margin-right: 4px;
  padding: 3px;
}
.text-black {
  color: black !important;
}
.container {
  max-width: 100% !important;
  text-align: left;
}
.loader {
  position: absolute;
  top: 45%;
  left: 45%;
}

.progress {
  height: 5px;
  margin-bottom: 0px;
  margin-top: 0px;
  overflow: hidden;
  background-color: transparent;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
.progress-bar {
  float: left;
  width: 0;
  height: 100%;
  font-size: 12px;
  line-height: 20px;
  color: rgba(31, 124, 142, 1);
  text-align: center;
  background-color: #00c853;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}
.alert-warning {
  margin-top: 20px;
}
.tags-notice {
  font-size: 15px;
  margin-bottom: 2px !important;
}
.application p {
  margin-bottom: 2px !important;
}
</style>
