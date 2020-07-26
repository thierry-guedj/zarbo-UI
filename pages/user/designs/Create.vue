<template>
  <div>
    <section class="hero text-center bg-secondary text-white">
      <div class="container">
        <h1 class="font-28 fw-600 text-uppercase">
          Upload a design
        </h1>
      </div>
    </section>
    <div class="upload-shot">
      <div class="container">
        <div class="row justify-content-center align-items-center text-center">
          <div class="col-md-6">
            <div class="card bg-white shadow-sm">
              <div class="d-flex flex-column justify-content-center p-1">
                <div v-if="error" class="alert alert-danger">
                  <p>An error occurred during the upload process</p>
                  <p>{{ error }}</p>
                </div>
                <slim-cropper :options="slimOptions">
                  <input type="file" name="image" />
                </slim-cropper>
                <div v-if="uploading" class="text-success caption-sm mt-2">
                  <i class="fas fa-spinner fa-spin"></i>
                </div>
              </div>
            </div>
            <div class="upload-para mt-2">
              <p class="font-14 fw-400">
                Your image dimensions must be at least 800px x 600px in size.
                Also the image size should be a maximum of 2MB. Please resize
                your file accordingly before you upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Slim from '@/components/slim/slim.vue'
export default {
  middleware: ['auth'],
  layout: 'default-content',
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
        label: 'Select Image...',
        maxFileSize: 2, // value is 2MB
        didInit: this.slimInit,
        didUpload: this.imageUpload,
        didReceiveServerError: this.handleServerError,
        didThroError: this.handleError,
        // forceType: 'jpg',
        // serviceFormat: 'file',
      },

      uploading: false,
      error: '',
    }
  },

  methods: {
    ...mapActions(['showModal', 'hideModal']),
    // called when slim has initialized
    slimInit(data, slim) {
      // slim instance reference
      console.log(slim)

      // current slim data object and slim reference
      console.log(data)
    },
    slimService(formdata, progress, success, failure, slim) {
      /* // "formdata" is a FormData object ready to be send to the server
      // more on working with formdata can be found here:
      // https://developer.mozilla.org/en-US/docs/Web/API/FormData

      // "progress(current, total)" is a function you can call to update the progress indicator
      // it expects the uploaded amount of bytes and the total bytes as parameters
      progress(500, 1000) // will put the progress indicator at 50%

      // "success(response)" should be called after the upload is done, expects a response object or string
      success('upload done')

      // "error(message)" should be called in case of upload problems, expects a string
      failure('something went wrong')

      console.log(slim)

      // form data to post to server
      // set serviceFormat to "file" to receive an array of files
      console.log(formdata)

      // call these methods to handle upload state
      console.log(progress, success, failure) */
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
    imageUpload(error, data, response) {
      console.log(error, data, response)
    },
    handleServerError(error, defaultError) {
      // the error parameter is equal to string set
      // to message property of server response object
      // in this case 'The server is having a bad day'
      console.log(error)

      // the defaultError parameter contains the
      // message set to data-status-unknown-response
      console.log(defaultError)

      return error
    },
    handleError(error) {
      console.log(error)
    },
  },
}
</script>

<style lang="scss" scoped></style>
