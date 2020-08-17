<template>
  <section>
    <v-card width="60%" class="mx-auto">
      <v-card-title class="headline"
        ><i class="material-icons md-24 mr-4">cloud_upload</i>Upload a
        design</v-card-title
      >

      <v-card-text>
        <div v-if="error" class="alert alert-danger">
          <p>An error occurred during the upload process</p>
          <p>{{ error }}</p>
        </div>
        <slim-cropper :options="slimOptions" class="text-black">
          <input type="file" name="image" />
        </slim-cropper>
        <div v-if="uploading" class="text-success caption-sm mt-2">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
      </v-card-text>
      <div class="upload-para mt-2 ml-4">
        <p class="font-14 fw-400">
          Your image dimensions must be at least 800px x 600px in size. Also the
          image size should be a maximum of 2MB. Please resize your file
          accordingly before you upload.
        </p>
      </div>
    </v-card>
    <!-- </v-dialog> -->
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import Slim from '@/components/slim/slim.vue'
export default {
  middleware: ['auth'],
  layout: 'page2',
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
        minSize: '800,600',
        // size: '800,600',
        label: 'Select Image...',
        ratio: 'input',
        maxFileSize: 10, // value is 2MB
        // forceType: 'jpg',
        // serviceFormat: 'file',
      },

      uploading: false,
      error: '',
      dialog: true,
    }
  },

  methods: {
    ...mapActions(['showModal', 'hideModal']),

    slimService(formdata, failure) {
      this.uploading = true
      this.$axios
        .post('/designs', formdata)
        .then((res) => {
          this.$router.push({
            name: 'designs.edit',
            params: { id: res.data.id },
          })
        })
        .catch((err) => {
          const message = err.response.data.errors
          this.error = message[Object.keys(message)[0]][0]
          failure(500)
        })
        .finally(() => (this.uploading = false))
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
