<template>
  <v-form novalidate @submit.stop.prevent="submit">
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">fingerprint</i>Reset
      password</v-card-title
    >
    <v-card-text>
      <v-alert
        v-if="this.$v.form.$model.successful"
        class="alert-success"
        dark
        icon="mark_email_unread"
        border="right"
        :form="form"
      >
        {{ status }}
        <p>
          <base-link component-name="LoginForm" folder-name="auth" redirect
            >Proceed to login</base-link
          >
        </p></v-alert
      >
      <v-alert
        v-if="form.errors.has('email')"
        dark
        icon="announcement"
        border="right"
        :form="form"
        class="alert-error mb-2"
      >
        {{ form.errors.get('email') }}
      </v-alert>
      <template v-if="!this.$v.form.$model.successful">
        <v-text-field
          v-model="form.email"
          label="E-mail"
          readonly
        ></v-text-field>
        <v-text-field
          v-model="$v.form.password.$model"
          :error-messages="passwordErrors"
          type="password"
          label="New password"
          required
          @input="$v.form.password.$touch()"
          @blur="$v.form.password.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="$v.form.password_confirmation.$model"
          :error-messages="passwordConfirmationErrors"
          type="password"
          label="New password confirmation"
          required
          @input="$v.form.password_confirmation.$touch()"
          @blur="$v.form.password_confirmation.$touch()"
        ></v-text-field>
        <v-spacer class="mb-3" />

        <v-btn
          class="mr-4"
          type="submit"
          :loading="loadingSubmit"
          :disabled="$v.form.$invalid"
        >
          submit</v-btn
        >
        <v-btn @click="clear">clear</v-btn>
        <div class="font-14 fw-400 text-center mt-4 right">
          Don't have an account yet?

          <base-link component-name="RegisterForm" folder-name="auth" redirect
            >Create an account</base-link
          >
        </div>
      </template>
    </v-card-text>
  </v-form>
</template>

<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
export default {
  name: 'PasswordResetForm',
  middleware: ['guest'],
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
    },
    status: {
      type: String,
      default: '',
    },
  },
  validations: {
    form: {
      password: {
        required,
        minLen: minLength(8),
      },
      password_confirmation: {
        required,
        // sameAs: sameAs('password')
        sameAs: sameAs((vm) => {
          return vm.password
        }),
      },
    },
  },
  data() {
    return {
      form: this.$vform({
        email: '',
        password: '',
        password_confirmation: '',
      }),
      loader: null,
      loadingSubmit: false,
    }
  },
  computed: {
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.minLen &&
        errors.push('Password must be at least 8 characters long')
      !this.$v.form.password.required && errors.push('Password is required.')
      return errors
    },
    passwordConfirmationErrors() {
      const errors = []
      if (!this.$v.form.password_confirmation.$dirty) return errors
      !this.$v.form.password_confirmation.required &&
        errors.push('Password confirmation is required.')
      !this.$v.form.password_confirmation.sameAs &&
        errors.push('Password confirmation needs to match password')
      return errors
    },
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]
    },
    modalClosed() {
      this.clear()
    },
    value(newVal) {
      this.openModal = newVal
    },
  },
  created() {
    this.form.email = this.$route.query.email
    this.form.token = this.$route.params.token
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    submit() {
      this.$v.form.$touch()
      this.form.busy = true
      this.loader = 'loadingSubmit'
      this.form
        .post('/password/reset')
        .then((res) => {
          this.status = res.data.status
        })
        .catch((e) => {})
        .finally(() => {
          this.form.reset()
          this.$v.form.$reset()
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
.alert-error {
  background-color: rgba(229, 57, 53, 0.7);
}
.alert-success {
  background-color: rgb(56, 142, 60, 0.7);
}
a.color-white {
  color: #ffffff;
}
</style>
