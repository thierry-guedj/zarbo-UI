<template>
  <v-row justify="center">
    <section class="hero text-center mb-4 text-white">
      <v-container>
        <h1 class="font-28 fw-600 text-uppercase text-white">
          {{ $t('editDesign.updateDesignInfo') }}
        </h1>
      </v-container>
    </section>
    <!-- End Hero -->

    <!-- Upload Shot -->
    <v-container>
      <v-row>
        <v-col class="col-md-6 edit-info">
          <v-card width="100%" class="mx-auto">
            <v-card-title class="headline"
              ><i class="material-icons md-24 mr-4">cloud_upload</i
              >{{ $t('create.uploadArtwork') }}</v-card-title
            >

            <v-card-text>
              <div v-if="error" class="alert alert-danger">
                <p>An error occurred during the upload process</p>
                <p>{{ error }}</p>
              </div>

              <div>
                <slim-cropper
                  :options="slimOptions"
                  class="text-black"
                  data-did-upload="imageUpload"
                >
                  <input type="file" name="image" />
                </slim-cropper>
              </div>

              <div v-if="uploading" class="text-success caption-sm mt-2">
                <i class="fas fa-spinner fa-spin"></i>
              </div>
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
                  :label="$t('editDesign.title')"
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
                  :label="$t('editDesign.description')"
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

                <client-only>
                  <input-tag
                    v-model="form.tags"
                    :tags="form.tags"
                    field="tags"
                    class="mb-1"
                    :placeholder="$t('editDesign.tagsLabel')"
                    on-paste-delimiter=","
                    outlined
                  ></input-tag>
                </client-only>

                <!--  <template v-if="teams.length">
                  <v-checkbox
                    v-model="form.assign_to_team"
                    :label="$t('editDesign.assignToTeam')"
                    field="assign_to_team"
                    :value="form.assign_to_team"
                  ></v-checkbox>

                  <v-select
                    v-model="form.team"
                    :disabled="!form.assign_to_team"
                    :items="teams"
                    item-text="name"
                    item-value="id"
                    outlined
                    :label="$t('editDesign.selectTeam')"
                  >
                  </v-select>
                  <has-error :form="form" field="team"></has-error>
                </template> -->

                <v-checkbox
                  id="is_live"
                  v-model="$v.form.is_live"
                  field="is_live"
                  :label="$t('editDesign.publishDesign')"
                ></v-checkbox>

                <v-spacer class="mb-3" />
                <v-btn @click="clear">{{ $t('editDesign.clear') }}</v-btn>
                <!-- <v-btn
                  class="mr-4"
                  :loading="loadingSubmit"
                  :disabled="$v.form.$invalid"
                  type="submit"
                  @click="slimService()"
                  >{{ $t('editDesign.updateDesign') }}</v-btn
                > -->
                <v-btn
                  class="slim-btn2 slim-btn-upload2"
                  title="Upload"
                  type="button"
                  data-action="upload"
                  style="opacity: 1;"
                  @click="submit"
                  >Upload</v-btn
                >
              </form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
import Slim from '@/components/slim/slim.vue'

export default {
  name: 'Create',
  middleware: ['auth'],
  layout: 'designs-listing',
  components: {
    InputTag: () => import('vue-input-tag'),
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
  data() {
    return {
      form: this.$vform({
        title: '',
        description: '',
        is_live: false,
        tags: [],
        /*  assign_to_team: false,
        team: null, */
      }),

      loadingSubmit: false,
      dialog: true,
      upload: false,

      slimOptions: {
        service: this.slimService,
        post: 'output',
        defaultInputName: 'image',
        // minSize: '800,600',
        // size: '800,600',
        label: this.$i18n.t('create.selectImage'),
        ratio: 'free',
        maxFileSize: 10, // value is 2MB
        // forceType: 'jpg',
        // serviceFormat: 'file',
      },

      uploading: false,
      error: '',
    }
  },
  computed: {
    titleErrors() {
      const errors = []
      if (!this.$v.form.title.$dirty) return errors
      !this.$v.form.title.maxLen &&
        errors.push('Title must be less than 120 characters long')
      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.form.description.$dirty) return errors
      !this.$v.form.description.maxLen &&
        errors.push('Description must be less than 3000 characters long')
      return errors
    },
    slug() {
      const slug = this.sanitizeTitle(this.form.title)
      return slug
    },
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]
    },
  },
  /*  mounted() {
      if (this.design) {
        Object.keys(this.form).forEach((key) => {
          if (this.design.hasOwnProperty(key)) {
            this.form[key] = this.design[key]
          }
        })
        this.form.tags = this.design.tag_list.tags || []

        if (this.design.team) {
          this.form.team = this.design.team.id
          this.form.assign_to_team = true
        } else {
          this.form.assign_to_team = false
        }
      }
    }, */
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    slimInitialised(data) {
      console.log(data)
    },
    imageUpload(error, data, response) {
      console.log(error, data, response)
    },
    slimService(formdata, failure) {
      this.uploading = true
      console.log(formdata)
      console.log(this.form.title)
      if (this.form.is_live === false) {
        this.form.is_live = 0
      } else {
        this.form.is_live = 1
      }
      console.log(this.form.tags)
      formdata.append('title', this.form.title)
      formdata.append('description', this.form.description)
      formdata.append('tags', this.form.tags)
      formdata.append('slug', this.slug)
      formdata.append('is_live', this.form.is_live)

      console.log(formdata)
      this.$axios
        .post('/designs', formdata)
        .then((res) => {
          this.$router.push(
            this.localePath({
              name: 'designs.edit',
              params: { id: res.data.id },
            })
          )
        })
        .catch((err) => {
          const message = err.response.data.errors
          this.error = message[Object.keys(message)[0]][0]
          failure(500)
        })
    },
    submitSlim() {
      this.slimService(formdata, failure)
    },
    submit() {
      this.form.busy = true
      this.loader = 'loadingSubmit'
      const slibtn = document.getElementsByClassName('slim-btn-upload')
      console.log(slibtn.length)
      slibtn[0].click()

      this.form.busy = false
      this.loader = null
      this.loadingSubmit = false
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
  },
}
</script>

<style lang="scss" scoped>
.theme--dark.v-card > .v-card__text,
.theme--dark.v-card .v-card__subtitle {
  color: black !important;
}
.file-drop-area label {
  display: block;
  padding: 2em;
  background: #eee;
  text-align: center;
  cursor: pointer;
}
@import '@/assets/slim.css';
</style>
