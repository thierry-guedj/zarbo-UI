<template>
  <section>
    <v-card width="60%" class="mx-auto">
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
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import Slim from '@/components/slim/slim.vue'
export default {
  name: 'Create',
  middleware: ['auth'],
  layout: 'designs-listing',
  components: {
    'slim-cropper': Slim,
  },
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
      this.$axios
        .post('/designs', formdata)
        .then((res) => {
          setTimeout(
            this.$router.push(
              this.localePath({
                name: 'designs.edit',
                params: { id: res.data.id },
              })
            ),
            4000
          )
        })
        .catch((err) => {
          const message = err.response.data.errors
          this.error = message[Object.keys(message)[0]][0]
          failure(500)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.theme--dark.v-card > .v-card__text,
.theme--dark.v-card .v-card__subtitle {
  color: black !important;
}
</style>
