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
        <v-row class="row-md-12">
          <v-col class="col-md-3 text-center avatar-col">
            <div>
              <slim-cropper
                :options="slimOptions"
                class="text-black slim-avatar"
                data-did-upLoad="imageUpload"
                data-did-init="slimInitialised"
                data-download="true"
              >
                <img :src="$auth.user.avatars.large" />
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

              <v-spacer class="mb-3" />
              <v-btn
                title="Upload"
                type="button"
                data-action="upload"
                style="opacity: 1;"
                :loading="loadingSubmit"
                :disabled="disabledButton"
                @click="submit"
                >{{ $t('profile.updateAvatar') }}</v-btn
              >
            </div></v-col
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col class="col-md-7">
            <p class="titlePage text-white">
              {{ $t('profile.profile') }}
            </p>
            <v-container fluid class="search-control">
              <v-alert
                v-model="alert"
                border="left"
                :form="form"
                close-text="Close Alert"
                class="alert-success"
                dismissible
                >{{ $t('profile.profileUpdated') }}</v-alert
              >
              <v-row>
                <v-col class="col-md-12 edit-info">
                  <form class="auth-form avatar" @submit.prevent="submit">
                    <input type="hidden" name="_method" value="PUT" />
                    <v-text-field
                      v-model.trim="$v.form.name.$model"
                      :error-messages="nameErrors"
                      :counter="120"
                      :form="form"
                      field="name"
                      :label="$t('profile.name')"
                      outlined
                      class="mb-1"
                      @input="$v.form.name.$touch()"
                      @blur="$v.form.name.$touch()"
                    ></v-text-field>
                    <has-error :form="form" field="name"></has-error>
                    <v-text-field
                      v-model.trim="$v.form.tagline.$model"
                      :error-messages="taglineErrors"
                      :counter="300"
                      :label="$t('profile.tagline')"
                      :form="form"
                      field="tagline"
                      @input="$v.form.tagline.$touch()"
                      @blur="$v.form.tagline.$touch()"
                    ></v-text-field>
                    <has-error :form="form" field="tagline"></has-error>
                    <v-textarea
                      v-model.trim="$v.form.about.$model"
                      :error-messages="aboutErrors"
                      :counter="3000"
                      :form="form"
                      :placeholder="$t('profile.someInfo')"
                      field="about"
                      outlined
                      class="mb-1"
                      @input="$v.form.about.$touch()"
                      @blur="$v.form.about.$touch()"
                    ></v-textarea>
                    <has-error :form="form" field="about"></has-error>
                    <div class="text-right">
                      <v-spacer class="mb-3" />
                      <v-btn
                        class="ml-8 float-right"
                        title="Upload"
                        type="button"
                        data-action="upload"
                        style="opacity: 1;"
                        :loading="loadingSubmit"
                        @click="update"
                        >{{ $t('profile.updateProfile') }}</v-btn
                      >

                      <v-btn :disabled="upload" @click="clear">{{
                        $t('profile.clear')
                      }}</v-btn>
                    </div>
                  </form>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </section>
    </v-container>
    <v-divider class="mx-4" inset vertical></v-divider>
  </section>
</template>

<script>
// import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
import { required, maxLength } from 'vuelidate/lib/validators'
import Slim from '@/components/slim/slim.vue'

export default {
  name: 'Profile',
  components: {
    'slim-cropper': Slim,
  },
  validations: {
    form: {
      name: {
        required,
        maxLen: maxLength(120),
      },
      tagline: {
        maxLen: maxLength(300),
      },
      about: {
        maxLen: maxLength(3000),
      },
    },
  },

  async asyncData({ $axios, $auth, error, redirect }) {
    try {
      const id = $auth.user.id
      const user = await $axios.$get(`/user/${id}/findById`)

      console.log(user)

      return { user: user.data }
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
      form: this.$vform({
        name: '',
        about: '',
        tagline: '',
        formatted_address: '',
        location: {},
        available_to_hire: false,
      }),
      loader: null,
      loadingSubmit: false,
      dialog: true,
      uploadButton: false,
      slimOptions: {
        service: this.slimService,
        post: 'output',
        defaultInputName: 'image',
        label: this.$i18n.t('profile.label'),
        ratio: '1:1',
        maxFileSize: 5, // value is 5MB
        uploadMethod: 'PUT',
        statusUploadSuccess: this.$i18n.t('profile.saved'),
        didLoad: this.imageLoaded,
        didRemove: this.imageRemoved,
      },
      uploading: false,
      imageSelectionDone: true,
      progressWidth: 0,
      uploadPercentage: 0,
      dialog_msg: '',
      alert: false,
      uploadIsSuccessful: false,
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.maxLen &&
        errors.push(this.$i18n.t('validation.nameMaxLength'))
      !this.$v.form.name.required &&
        errors.push(this.$i18n.t('validation.nameRequired'))
      return errors
    },
    taglineErrors() {
      const errors = []
      if (!this.$v.form.tagline.$dirty) return errors
      !this.$v.form.tagline.maxLen &&
        errors.push(this.$i18n.t('validation.taglineMaxLength'))

      return errors
    },
    aboutErrors() {
      const errors = []
      if (!this.$v.form.about.$dirty) return errors
      !this.$v.form.about.maxLen &&
        errors.push(this.$i18n.t('validation.descriptionMaxLength'))
      return errors
    },
    disabledButton() {
      if (!this.uploadButton || this.$vform.busy) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]
    },
    uploadIsSuccessful() {
      console.log(this.uploadIsSuccessful)
      if (this.uploadIsSuccessful === true) {
        this.$auth.fetchUser()
      }
    },
  },
  mounted() {
    if (this.user) {
      Object.keys(this.form).forEach((k) => {
        if (this.user.hasOwnProperty(k)) {
          this.form[k] = this.user[k]
        }
      })
      const slibtn = document.getElementsByClassName('slim-btn-upload')
      slibtn[0].style.display = 'none'
    }

    if (this.$auth.user.location) {
      this.form.location = {
        longitude: this.$auth.user.location.coordinates[0],
        latitude: this.$auth.user.location.coordinates[1],
      }
    } else {
      this.form.location = {}
    }
    const slibtn = document.getElementsByClassName('slim-btn-upload')
    slibtn[0].style.display = 'none'
  },
  methods: {
    async slimService(formdata, progress, success, failure) {
      this.uploading = true

      formdata.append('_method', 'put')

      const url = `user/${this.$auth.user.id}`

      await this.$axios
        .$post(url, formdata, {
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
              this.dialog_msg = this.$i18n.t('profile.stillUploading')
            }
          }.bind(this),
        })
        .then((res) => {
          console.log(res)
          this.uploadIsSuccessful = await this.checkUpload(this.$auth.user.id)
          success('upload done')
          this.uploading = false
        })
        .catch((e) => console.log(e))
      /* .catch((err) => {
          console.log('error')
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
      this.dialog_msg = ''
      return true
    },
    imageRemoved(data) {
      console.log(data)
      const slibtn = document.getElementsByClassName('slim-btn-upload')
      slibtn[0].style.display = 'none'
      this.uploadButton = false
      this.dialog_msg = ''
    },
    update() {
      this.form
        .put(`/settings/profile`)
        .then((res) => {
          console.log(res)

          /* setTimeout(() => {
            this.$router.push(
              this.localePath({
                name: 'designs.user',
                params: { id: this.$auth.user.id },
              })
            )
          }, 1000) */
          this.uploading = false
          this.alert = true
        })
        .catch((e) => console.log(e))
    },
    async checkUpload(id) {
      const tempVar = await this.$axios
        .$get(`user/${id}/uploadIsSuccessful`)
        .then((response) => {
          this.dialog_msg = this.$i18n.t('profile.uploadSuccess')

          this.uploading = false
          /* setTimeout(() => {
            this.$auth.fetchUser()
          }, 5000) */
        })
    },
    handleAddress(data) {
      this.form.formatted_address = data.formatted_address
      this.form.location = {
        latitude: data.latitude,
        longitude: data.longitude,
      }
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
.avatar-col {
  max-width: 27%;
}
.titlePage {
  font-size: 44px;
  padding-top: 20px;
  margin-bottom: 30px;
  line-height: 1em;
}
.iconTitle {
  max-width: 180px;
  min-width: 180px;
}
.container {
  max-width: 100% !important;
  text-align: left;
}
.modal {
  background-color: rgba(23, 22, 18, 0.85);
}
.profile {
  max-width: 80%;
  text-align: center;
  margin: 0 auto;
}
.slim-avatar {
  width: 240px;
  border-radius: 50%;
  color: black;
  margin: 0 auto 5px auto;
}
.uploadAvatar {
  margin: 0 auto;
}
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
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
</style>
