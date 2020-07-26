<template>
  <v-form novalidate @submit.stop.prevent="submit">
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">brush</i>Register</v-card-title
    >
    <v-alert
      v-if="form.errors.has('username')"
      color="#e53935"
      dark
      icon="person_add_disabled"
      border="right"
      :form="form"
      class="mb-2"
    >
      {{ form.errors.get('username') }}
    </v-alert>
    <v-alert
      v-if="form.errors.has('email')"
      color="#e53935"
      dark
      icon="mark_email_unread"
      border="right"
      :form="form"
      class="mb-2"
    >
      {{ form.errors.get('email') }}
    </v-alert>
    <v-alert
      v-if="this.$v.form.$model.successful"
      color="#388E3C"
      dark
      icon="mark_email_unread"
      border="right"
      :form="form"
      >We have sent you an email to activate your account.</v-alert
    >
    <div v-if="!this.$v.form.$model.successful">
      <v-text-field
        v-model.trim="$v.form.name.$model"
        :error-messages="nameErrors"
        :counter="35"
        label="Name"
        required
        @input="$v.form.name.$touch()"
        @blur="$v.form.name.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.username.$model"
        :error-messages="usernameErrors"
        :counter="35"
        label="Username"
        required
        @input="$v.form.username.$touch()"
        @blur="$v.form.username.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.email.$model"
        :error-messages="emailErrors"
        label="E-mail"
        required
        @input="$v.form.email.$touch()"
        @blur="$v.form.email.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.password.$model"
        :error-messages="passwordErrors"
        label="Password"
        type="password"
        required
        @input="$v.form.password.$touch()"
        @blur="$v.form.password.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.password_confirmation.$model"
        :error-messages="password_confirmationErrors"
        label="Confirm password"
        required
        type="password"
        @input="$v.form.password_confirmation.$touch()"
        @blur="$v.form.password_confirmation.$touch()"
      ></v-text-field>
      <v-spacer class="mb-3" />
      <v-btn
        class="mr-4"
        :loading="loadingSubmit"
        :disabled="$v.form.$invalid"
        type="submit"
        >submit</v-btn
      >
      <v-btn @click="clear">clear</v-btn>
      <div class="font-14 fw-400 text-center mt-4 right">
        Already have an account?

        <base-link component-name="LoginForm" folder-name="auth"
          >Login</base-link
        >
      </div>
    </div>
  </v-form>
</template>

<script>
import {
  required,
  maxLength,
  minLength,
  email,
  sameAs,
} from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
export default {
  name: 'RegisterForm',
  middleware: ['guest'],
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    form: {
      username: {
        required,
        minLen: minLength(3),
        maxLen: maxLength(25),
      },
      name: {
        required,
        minLen: minLength(6),
      },
      email: {
        required,
        email,
      },
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
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
        email: '',
      }),
      loader: null,
      loadingSubmit: false,
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.minLen &&
        errors.push('Name must be at least 6 characters long')
      !this.$v.form.name.required && errors.push('Name is required.')
      return errors
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.form.username.$dirty) return errors
      !this.$v.form.username.minLen &&
        errors.push(`Username must be at least 3 characters long`)
      !this.$v.form.username.maxLen &&
        errors.push(`Username must be at most 25 characters long`)
      !this.$v.form.username.required && errors.push('Username is required.')
      return errors
    },
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
        errors.push('Password must be at least 8 characters long')
      !this.$v.form.password.required && errors.push('Password is required.')
      return errors
    },
    password_confirmationErrors() {
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
  },

  methods: {
    ...mapActions(['showModal', 'hideModal']),
    submit() {
      this.$v.form.$touch()
      this.loader = 'loadingSubmit'
      this.form.busy = true
      if (!this.$v.form.$anyError) {
        this.form
          .post(`/register`)
          .then((res) => {})
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
</style>
