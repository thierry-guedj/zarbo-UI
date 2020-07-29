<template>
  <v-form novalidate @submit.stop.prevent="submit">
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">fingerprint</i>Reset password
      email</v-card-title
    >
    <v-alert
      v-if="this.$v.form.$model.successful"
      class="alert-success"
      dark
      icon="mark_email_unread"
      border="right"
      :form="form"
    >
      {{ status }}</v-alert
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
        <base-link component-name="ResendForm" folder-name="auth"
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

        <base-link component-name="RegisterForm" folder-name="auth">
          Create an account</base-link
        >
      </p>
    </v-alert>
    <template v-if="!this.$v.form.$model.successful">
      <v-text-field
        v-model="$v.form.email.$model"
        :error-messages="emailErrors"
        label="E-mail"
        required
        @input="$v.form.email.$touch()"
        @blur="$v.form.email.$touch()"
      ></v-text-field>

      <v-spacer class="mb-3" />

      <v-btn
        class="mr-4 float-right"
        :loading="loadingSubmit"
        :disabled="$v.form.$invalid"
        type="submit"
        >Send password reset link</v-btn
      >
      <v-btn @click="clear">clear</v-btn>
      <div class="font-14 fw-400 text-center mt-4 right">
        Don't have an account yet?

        <base-link component-name="RegisterForm" folder-name="auth">
          Create an account</base-link
        >
      </div>
    </template>
  </v-form>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
export default {
  name: 'ResendForm',
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
    },
  },
  data() {
    return {
      form: this.$vform({
        email: '',
      }),
      loader: null,
      loadingSubmit: false,
      status: '',
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
      this.form.busy = true
      this.loader = 'loadingSubmit'
      this.form
        .post('/password/email')
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
