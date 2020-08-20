<template>
  <v-row justify="center">
    <!-- <v-dialog
      v-model="dialog"
      persistent
      max-width="100%"
      hide-overlay
      transition="dialog-bottom-transition"
      color="transparent"
      content-class="mx-12 pt-18"
      height="300px"
    > -->
    <section class="hero text-center mb-4 text-white">
      <v-container>
        <h1 class="font-28 fw-600 text-uppercase text-white">
          Update Design Information
        </h1>
      </v-container>
    </section>
    <!-- End Hero -->

    <!-- Upload Shot -->
    <v-container>
      <v-row>
        <v-col class="col-md-6 edit-info">
          <div v-if="design.images" class="card-body p-0 m-0">
            <img
              :src="design.images.large"
              class="mb-4"
              style="
                max-width: 100%;
                max-height: 100vh;
                height: auto;
                border: 6px solid blanchedalmond;
              "
            />
          </div>
        </v-col>
        <v-col class="col-md-5 edit-info ml-2">
          <v-card flat>
            <v-card-text>
              <form class="auth-form" @submit.prevent="submit">
                <v-alert
                  v-if="this.$v.form.$model.successful"
                  color="#388E3C"
                  dark
                  icon="mark_email_unread"
                  border="right"
                  :form="form"
                  >Design successfully updated</v-alert
                >
                <v-text-field
                  v-model.trim="$v.form.title.$model"
                  :error-messages="titleErrors"
                  :counter="155"
                  label="Title"
                  required
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
                  :counter="155"
                  label="Description"
                  required
                  outlined
                  class="mb-1"
                  field="description"
                  @input="$v.form.description.$touch()"
                  @blur="$v.form.description.$touch()"
                ></v-textarea>
                <has-error :form="form" field="description"></has-error>
                <client-only>
                  <input-tag
                    v-model="form.tags"
                    :tags="form.tags"
                    field="tags"
                    class="mb-1"
                    placeholder="Tags separated by commas"
                    on-paste-delimiter=","
                    outlined
                  ></input-tag>
                </client-only>

                <template v-if="teams.length">
                  <v-checkbox
                    v-model="form.assign_to_team"
                    label="Assign to team"
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
                    label="Select a team"
                  >
                  </v-select>
                  <has-error :form="form" field="team"></has-error>
                </template>

                <v-checkbox
                  id="is_live"
                  v-model="form.is_live"
                  field="is_live"
                  label="Publish this design"
                ></v-checkbox>

                <v-spacer class="mb-3" />
                <v-btn
                  class="mr-4"
                  :loading="loadingSubmit"
                  :disabled="$v.form.$invalid"
                  type="submit"
                  >Update design</v-btn
                >
                <v-btn @click="clear">clear</v-btn>
              </form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
// import InputTag from 'vue-input-tag'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  middleware: ['auth'],
  layout: 'designs-listing',
  components: {
    InputTag: () => import('vue-input-tag'),
  },
  validations: {
    form: {
      title: {
        required,
        minLen: minLength(3),
        maxLen: maxLength(35),
      },
      description: {
        minLen: minLength(6),
        maxLen: maxLength(450),
      },
    },
  },

  async asyncData({ $axios, params, error, redirect }) {
    try {
      const design = await $axios.$get(`/designs/${params.id}/byUser`)
      const teams = await $axios.$get(`/users/teams`)

      return { design: design.data, teams: teams.data }
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
        title: '',
        description: '',
        is_live: false,
        tags: [],
        assign_to_team: false,
        team: null,
      }),
      loader: null,
      loadingSubmit: false,
      dialog: true,
    }
  },
  computed: {
    titleErrors() {
      const errors = []
      if (!this.$v.form.title.$dirty) return errors
      !this.$v.form.title.minLen &&
        errors.push('Title must be at least 6 characters long')
      // !this.$v.form.name.required && errors.push('Name is required.')
      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.form.description.$dirty) return errors
      !this.$v.form.description.minLen &&
        errors.push(`Description must be at least 3 characters long`)
      !this.$v.form.description.maxLen &&
        errors.push(`Description must be at most 35 characters long`)
      // !this.$v.form.username.required && errors.push('Username is required.')
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
  },
  methods: {
    submit() {
      this.form.busy = true
      this.loader = 'loadingSubmit'
      this.form
        .put(`/designs/${this.$route.params.id}`)
        .then((res) => {
          setTimeout(() => {
            this.$router.push({ name: 'settings.designs' })
          }, 4000)
        })
        .catch((err) => console.log(err.response))
        .finally(() => {
          this.form.busy = false
          this.loader = null
          this.loadingSubmit = false
        })
    },
    clear() {
      this.form.reset()
      this.$v.form.$reset()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 900;
}
.edit-info {
  background-color: transparent;
  border-radius: 8px;
}
.v-text-field--filled {
  border-radius: 6px 6px 0;
  background-color: #333333;
}
.bg-secondary {
  background-color: rgba(23, 22, 18, 0.94);
  height: 64px;
}
.vue-input-tag-wrapper {
  background-color: transparent;
  border-radius: 4px;
  border: 1px thin;
  border-color: rgba(255, 255, 255, 0.24);
}
.theme--dark.v-card {
  background-color: transparent;
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background-color: rgba(23, 22, 18, 0.94);
}
/* .v-sheet.v-card {
  background-color: rgba(23, 22, 18, 0.85);
} */
</style>
