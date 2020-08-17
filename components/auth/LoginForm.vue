<template>
  <section>
    <v-form novalidate @submit.stop.prevent="submit">
      <v-card-title class="headline"
        ><i class="material-icons md-24 mr-2">face</i>Login</v-card-title
      >
      <v-alert
        v-if="form.errors.has('emailNotVerified')"
        dark
        icon="announcement"
        border="right"
        :form="form"
        class="alert-error mb-2"
      >
        {{ form.errors.get('emailNotVerified') }}
        <p>
          <base-link component-name="Resend" folder-name="auth"
            >Resend verification email</base-link
          >
        </p>
      </v-alert>
      <v-alert
        v-if="form.errors.has('email')"
        dark
        icon="announcement"
        border="right"
        :form="form"
        class="alert-error mb-2"
      >
        {{ form.errors.get('email') }}
        <p class="font-14 fw-400 text-center mt-4">
          Don't have an account yet?

          <base-link component-name="RegisterForm" folder-name="auth"
            >Create an account</base-link
          >
        </p>
      </v-alert>
      <v-alert
        v-if="form.errors.has('message')"
        dark
        icon="announcement"
        border="right"
        :form="form"
        class="alert-error mb-2"
      >
        {{ form.errors.get('message') }}
        <p>
          <base-link component-name="ResendForm" folder-name="auth"
            >Resend verification email</base-link
          >
        </p>
      </v-alert>
      <v-text-field
        v-model="$v.form.email.$model"
        :error-messages="emailErrors"
        label="E-mail"
        required
        @input="$v.form.email.$touch()"
        @blur="$v.form.email.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="$v.form.password.$model"
        :error-messages="passwordErrors"
        :counter="8"
        label="Password"
        type="password"
        required
        @input="$v.form.password.$touch()"
        @blur="$v.form.password.$touch()"
      ></v-text-field>
      <v-spacer class="mb-3" />
      <div class="mt-4 mb-4 clearfix">
        <base-link component-name="ResetEmail" folder-name="auth"
          >Forgot password?</base-link
        >
      </div>
      <v-btn
        class="mr-4 float-right"
        type="submit"
        :loading="loadingSubmit"
        :disabled="$v.form.$invalid"
      >
        submit</v-btn
      >
      <v-btn @click="clear">clear</v-btn>
      <div class="font-14 fw-400 text-center mt-4 right">
        Don't have an account yet?

        <base-link component-name="RegisterForm" folder-name="auth"
          >Create an account</base-link
        >
      </div>
    </v-form>
  </section>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
export default {
  name: 'LoginForm',
  middleware: ['guest'],
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLen: minLength(8),
      },
    },
  },
  data() {
    return {
      form: this.$vform({
        email: '',
        password: '',
      }),
      loader: null,
      loadingSubmit: false,
      loginMsg: "You're logged in",
      snackbar: false,
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.email && errors.push('Must be valid e-mail')
      !this.$v.form.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.minLen &&
        errors.push('Password must be at most 8 characters long')
      !this.$v.form.password.required && errors.push('Password is required.')
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

    snackbar(newVal) {
      this.snackbarValue = newVal
    },
  },
  methods: {
    ...mapActions(['showModal', 'hideModal', 'showSnackbar']),
    submit() {
      this.$v.form.$touch()
      this.form.busy = true
      this.loader = 'loadingSubmit'
      if (!this.$v.form.$anyError) {
        this.$auth
          .loginWith('local', {
            data: this.form,
          })
          .then((res) => {
            this.hideModal()
            this.showSnackbar()
            // this.$router.go(0)
            // this.$emit('loginSuccess', this.loginMsg)
          })
          .catch((e) => {
            this.form.errors.set(e.response.data.errors)
          })
          .finally(() => {
            this.form.reset()
            this.$v.form.$reset()
            this.form.busy = false
            this.loader = null
            this.loadingSubmit = false
          })
      }
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
.v-sheet.v-card {
  background-color: rgba(23, 22, 18, 0.85);
}
</style>
