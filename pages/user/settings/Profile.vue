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

      <!-- <div class="form-group">
              <base-input
                v-model="form.name"
                :form="form"
                field="name"
                placeholder="Full name"
              ></base-input>
            </div> -->

      <!--  <div
          class="slim"
          data-label="Drop your avatar here"
          data-fetcher="fetch.php"
          data-size="240,240"
          data-ratio="1:1"
        >
          <input type="file" name="slim[]" required />
        </div> -->
      <div>
        <slim-cropper
          :options="slimOptions"
          class="text-black slim-avatar"
          data-did-upload="imageUpload"
          data-status-upload-success="Saved successfully"
        >
          <input type="file" name="image" />
        </slim-cropper>
      </div>
      <!-- <button type="submit">Upload now!</button> -->
      <form class="auth-form avatar" @submit.prevent="submit">
        <v-text-field
          v-model.trim="form.name"
          :form="form"
          field="name"
          :label="$t('profile.name')"
        ></v-text-field>
        <v-text-field
          v-model.trim="form.tagline"
          :label="$t('profile.tagline')"
          :form="form"
          field="tagline"
        ></v-text-field>

        <v-textarea
          v-model.trim="form.about"
          :form="form"
          :placeholder="$t('profile.someInfo')"
          field="about"
          outlined
          class="mb-1"
        ></v-textarea>

        <div class="text-right">
          <v-spacer class="mb-3" />
          <v-btn
            class="slim-btn2 slim-btn-upload2 ml-8 float-right"
            title="Upload"
            type="button"
            data-action="upload"
            style="opacity: 1;"
            :loading="loadingSubmit"
            @click="submit"
            >{{ $t('profile.updateProfile') }}</v-btn
          >

          <v-btn @click="clear">{{ $t('profile.clear') }}</v-btn>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
import Slim from '@/components/slim/slim.vue'
export default {
  name: 'Profile',
  components: {
    'slim-cropper': Slim,
    Circle8,
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
      slimOptions: {
        service: this.slimService,
        post: 'output',
        defaultInputName: 'image',
        // minSize: '800,600',
        // size: '800,600',
        label: this.$i18n.t('create.selectImage'),
        ratio: '1:1',
        maxFileSize: 2, // value is 2MB
        // forceType: 'jpg',
        // serviceFormat: 'file',
      },
      uploading: false,
    }
  },

  mounted() {
    Object.keys(this.form).forEach((k) => {
      if (this.$auth.user.hasOwnProperty(k)) {
        this.form[k] = this.$auth.user[k]
      }
    })

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
    update() {
      this.form
        .put(`/settings/profile`)
        .then((res) => console.log(res))
        .catch((e) => console.log(e))
    },
    handleAddress(data) {
      this.form.formatted_address = data.formatted_address
      this.form.location = {
        latitude: data.latitude,
        longitude: data.longitude,
      }
    },
    slimService(formdata, failure) {
      this.uploading = true
      console.log(formdata)

      /* formdata.append('name', this.form.name)
      formdata.append('about', this.form.about)
      formdata.append('tagline', this.tagline) */

      console.log(formdata)
      const url = `/user/${this.$auth.user.id}`
      this.$axios
        .put(url, formdata)
        .then((res) => {
          this.update()
        })
        .catch((err) => {
          const message = err.response.data.errors
          this.error = message[Object.keys(message)[0]][0]
          failure(500)
        })
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
}
.slim-avatar {
  width: 240px;
  border-radius: 50%;
  color: black;
}
</style>
