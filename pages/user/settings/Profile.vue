<template>
  <section>
    <div class="profile">
      <v-card-title class="headline text-center"
        ><i class="material-icons md-24 mr-2">face</i
        >{{ $t('profile.profile') }}</v-card-title
      >
      <alert-success :form="form">{{
        $t('profile.profileUpdated')
      }}</alert-success>
      <v-row class="row-md-12">
        <v-col class="col-md-4">
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
            <div v-if="uploading" class="text-success caption-sm mt-2">
              <i class="fas fa-spinner fa-spin"></i>
              <div class="loader">
                <Circle8></Circle8>
              </div>
            </div>
            <v-spacer class="mb-3" />
            <v-btn
              class="slim-btn2 slim-btn-upload2 ml-8 float-right"
              title="Upload"
              type="button"
              data-action="upload"
              style="opacity: 1;"
              :loading="loadingSubmit"
              @click="submit"
              >{{ $t('profile.updateAvatar') }}</v-btn
            >
          </div>
        </v-col>
        <v-col class="col-md-8">
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
                :disabled="$v.form.$invalid"
                @click="update"
                >{{ $t('profile.updateProfile') }}</v-btn
              >

              <v-btn @click="clear">{{ $t('profile.clear') }}</v-btn>
            </div>
          </form>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script>
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
import { required, maxLength } from 'vuelidate/lib/validators'
import Slim from '@/components/slim/slim.vue'
// called when slim has initialized
function slimInit(data, slim) {
  // slim instance reference
  console.log(slim)

  // current slim data object and slim reference
  console.log(data)
}

function imageLoad(file, image, meta) {
  // average image color
  const averageColor = averagePixelColor(image)

  // color to HSL
  const color = rgbToHsl(averageColor)

  // does the hue part fall in the warm range
  // and is the image not too dark or bright
  if ((color.h > 300 || color.h < 60) && color.l > 10 && color.l < 90) {
    return true
  }

  return 'This image is just not hot enough.'
}
function imageUpload(error, data, response) {
  console.log(error, data, response)
}
export default {
  name: 'Profile',
  components: {
    'slim-cropper': Slim,
    Circle8,
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
  /*  async fetch() {
    const res = await this.$axios.$get(`/user/${this.$auth.user.id}/findById`)
    this.user = res.data
  }, */
  /*   async asyncData({ $axios, context, error, redirect }) {
    try {
      const user = await $axios.$get(`/user/${context.$auth.user.id}/findById`)
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
  }, */
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
      slimOptions: {
        service: this.slimService,
        post: 'output',
        defaultInputName: 'image',
        // minSize: '800,600',
        // size: '800,600',
        label: this.$i18n.t('profile.label'),
        ratio: '1:1',
        maxFileSize: 2, // value is 2MB
        // didLoad: 'imageLoad',
        uploadMethod: 'PUT',
        statusUploadSuccess: 'Saved successfully',
        // forceType: 'jpg',
        // serviceFormat: 'file',
        didInit: slimInit,
      },
      uploading: false,
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.maxLen &&
        errors.push('Name must be less than 120 characters long')
      !this.$v.form.name.required && errors.push('Name is required.')
      return errors
    },
    taglineErrors() {
      const errors = []
      if (!this.$v.form.tagline.$dirty) return errors
      !this.$v.form.tagline.maxLen &&
        errors.push('Tagline must be less than 300 characters long')
      return errors
    },
    aboutErrors() {
      const errors = []
      if (!this.$v.form.about.$dirty) return errors
      !this.$v.form.about.maxLen &&
        errors.push('Description must be less than 3000 characters long')
      return errors
    },
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]
    },
  },
  mounted() {
    if (this.user) {
      Object.keys(this.form).forEach((k) => {
        if (this.user.hasOwnProperty(k)) {
          this.form[k] = this.user[k]
        }
      })
    }

    if (this.$auth.user.location) {
      this.form.location = {
        longitude: this.$auth.user.location.coordinates[0],
        latitude: this.$auth.user.location.coordinates[1],
      }
    } else {
      this.form.location = {}
    }
  },
  methods: {
    slimService(formdata, failure) {
      this.uploading = true
      console.log(formdata)

      /* formdata.append('name', this.form.name)
      formdata.append('about', this.form.about) */
      formdata.append('_method', 'put')

      console.log(formdata)
      const url = `user/${this.$auth.user.id}`
      /*     let config = {
  headers: {
    Content-Type: "application/x-www-form-urlencoded",
  }
} */
      // this.$axios.setHeader('Content-Type', 'application/x-www-form-urlencoded')
      this.$axios
        .$post(url, formdata)
        .then((res) => {
          console.log(res)
          setTimeout(() => {
            this.$router.push(
              this.localePath({
                name: 'designs.user',
                params: { id: this.$auth.user.id },
              })
            )
          }, 4000)
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
    update() {
      this.form
        .put(`/settings/profile`)
        .then((res) => {
          console.log(res)
          setTimeout(() => {
            this.$router.push({ name: 'settings.designs' })
          }, 4000)
          this.uploading = false
        })
        .catch((e) => console.log(e))
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
  },
}
</script>

<style lang="scss" scoped>
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
  margin-bottom: 5px;
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
