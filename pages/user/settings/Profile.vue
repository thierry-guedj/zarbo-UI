<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="80%"
      hide-overlay
      transition="dialog-bottom-transition"
      content-class="modal"
    >
      <div class="setting-title font-16 fw-500">Profile</div>

      <div class="setting-body white-bg-color">
        <form class="custom-form" @submit.prevent="update">
          <div class="row">
            <div class="col-md-6">
              <alert-success :form="form"
                >Profile information updated successfully</alert-success
              >

              <!-- <div class="form-group">
              <base-input
                v-model="form.name"
                :form="form"
                field="name"
                placeholder="Full name"
              ></base-input>
            </div> -->
              <v-text-field
                v-model.trim="form.name"
                :form="form"
                field="name"
                label="Name"
              ></v-text-field>
              <!-- <div class="form-group">
              <base-input
                v-model="form.tagline"
                :form="form"
                field="tagline"
                placeholder="Tagline"
              ></base-input>
            </div> -->
              <v-text-field
                v-model.trim="form.tagline"
                label="Tagline"
                :form="form"
                field="tagline"
              ></v-text-field>
              <div class="form-group">
                <base-gmap
                  :initial-value="form.formatted_address"
                  @address-response="handleAddress"
                ></base-gmap>
              </div>

              <!-- <div class="form-group">
              <base-textarea
                v-model="form.about"
                :form="form"
                field="about"
                :rows="4"
                placeholder="Please enter some information about yourself"
              ></base-textarea>
            </div> -->
              <v-textarea
                v-model.trim="form.about"
                :form="form"
                placeholder="Please enter some information about yourself"
                field="about"
                outlined
                class="mb-1"
              ></v-textarea>
              <!-- <div class="form-group custom-control custom-checkbox">
              <input
                id="available_to_hire"
                v-model="form.available_to_hire"
                type="checkbox"
                class="custom-control-input"
              />
              <label
                class="custom-control-label"
                :value="true"
                for="available_to_hire"
                >Available to hire?</label
              >
            </div> -->
              <v-checkbox
                v-model="form.available_to_hire"
                label="Available to hire?"
                field="available_to_hire"
                :form="form"
                :value="form.available_to_hire"
              ></v-checkbox>
              <div class="text-right">
                <v-spacer class="mb-3" />
                <v-btn
                  class="ml-8 float-right"
                  :loading="loadingSubmit"
                  type="submit"
                  >Update profile</v-btn
                >
                <v-btn @click="clear">clear</v-btn>
              </div>
            </div>
          </div>
        </form>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
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
    clear() {
      this.form.reset()
      this.$v.form.$reset()
    },
  },
}
</script>

<style>
.modal {
  background-color: rgba(23, 22, 18, 0.85);
}
</style>
