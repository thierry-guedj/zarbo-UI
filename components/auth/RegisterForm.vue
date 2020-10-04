<template>
  <v-form novalidate @submit.stop.prevent="submit">
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">brush</i
      >{{ $t('register.register') }}</v-card-title
    >
    <v-alert
      v-if="form.errors.has('name')"
      class="alert-error mb-2"
      dark
      icon="person_add_disabled"
      border="right"
      :form="form"
    >
      {{ form.errors.get('name') }}
    </v-alert>
    <v-alert
      v-if="form.errors.has('email')"
      class="alert-error mb-2"
      dark
      icon="mark_email_unread"
      border="right"
      :form="form"
    >
      {{ form.errors.get('email') }}
    </v-alert>
    <v-alert
      v-if="form.errors.has('invitation_code')"
      class="alert-error mb-2"
      dark
      icon="person_add_disabled"
      border="right"
      :form="form"
    >
      {{ form.errors.get('invitation_code') }}
      <base-link component-name="ContactForm" folder-name="user">{{
        $t('register.contactUs')
      }}</base-link>
    </v-alert>
    <v-alert
      v-if="this.$v.form.$model.successful"
      class="alert-success"
      dark
      icon="mark_email_unread"
      border="right"
      :form="form"
      >{{ $t('register.emailSent') }}</v-alert
    >
    <div v-if="!this.$v.form.$model.successful">
      <v-text-field
        v-model.trim="$v.form.name.$model"
        :error-messages="nameErrors"
        :counter="120"
        :label="$t('register.name')"
        required
        @input="$v.form.name.$touch()"
        @blur="$v.form.name.$touch()"
      ></v-text-field>
      <!-- <v-text-field
        v-model.trim="$v.form.username.$model"
        :error-messages="usernameErrors"
        :counter="35"
        :label="$t('register.username')"
        required
        @input="$v.form.username.$touch()"
        @blur="$v.form.username.$touch()"
      ></v-text-field> -->
      <v-text-field
        v-model.trim="$v.form.email.$model"
        :error-messages="emailErrors"
        :label="$t('register.email')"
        required
        @input="$v.form.email.$touch()"
        @blur="$v.form.email.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.password.$model"
        :error-messages="passwordErrors"
        :label="$t('register.password')"
        type="password"
        required
        @input="$v.form.password.$touch()"
        @blur="$v.form.password.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.password_confirmation.$model"
        :error-messages="password_confirmationErrors"
        :label="$t('register.confirmPassword')"
        type="password"
        required
        @input="$v.form.invitation_code.$touch()"
        @blur="$v.form.invitation_code.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.invitation_code.$model"
        :error-messages="invitation_codeErrors"
        :label="$t('register.invitationCode')"
        required
        type="password"
        @input="$v.form.password_confirmation.$touch()"
        @blur="$v.form.password_confirmation.$touch()"
      ></v-text-field>
      <v-spacer class="mb-3" />
      <v-btn
        class="mr-4 float-right"
        :loading="loadingSubmit"
        :disabled="$v.form.$invalid"
        :type="$t('register.submit')"
        >{{ $t('register.submit') }}</v-btn
      >
      <v-btn @click="clear">{{ $t('register.clear') }}</v-btn>
      <div class="font-14 fw-400 text-center mt-4 right">
        {{ $t('register.haveAccount') }}

        <base-link component-name="LoginForm" folder-name="auth">{{
          $t('register.login')
        }}</base-link>
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
      /* username: {
        required,
        minLen: minLength(3),
        maxLen: maxLength(25),
      }, */
      name: {
        required,
        minLen: minLength(3),
        maxLen: maxLength(120),
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
      invitation_code: {
        required,
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
        invitation_code: '',
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
        errors.push(this.$i18n.t('validation.nameMinLength'))
      !this.$v.form.name.maxLen &&
        errors.push(this.$i18n.t('validation.nameMaxLength'))
      !this.$v.form.name.required &&
        errors.push(this.$i18n.t('validation.nameRequired'))
      return errors
    },
    /* usernameErrors() {
      const errors = []
      if (!this.$v.form.username.$dirty) return errors
      !this.$v.form.username.minLen &&
        errors.push(`Username must be at least 3 characters long`)
      !this.$v.form.username.maxLen &&
        errors.push(`Username must be at most 25 characters long`)
      !this.$v.form.username.required && errors.push('Username is required.')
      return errors
    }, */
    emailErrors() {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.email &&
        errors.push(this.$i18n.t('validation.emailValid'))
      !this.$v.form.email.required &&
        errors.push(this.$i18n.t('validation.emailRequired'))
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.minLen &&
        errors.push(this.$i18n.t('validation.passwordMinLength'))
      !this.$v.form.password.required &&
        errors.push(this.$i18n.t('validation.passwordRequired'))
      return errors
    },
    password_confirmationErrors() {
      const errors = []
      if (!this.$v.form.password_confirmation.$dirty) return errors
      !this.$v.form.password_confirmation.required &&
        errors.push(this.$i18n.t('validation.passwordConfirmRequired'))
      !this.$v.form.password_confirmation.sameAs &&
        errors.push(this.$i18n.t('validation.passwordMatch'))
      return errors
    },
    invitation_codeErrors() {
      const errors = []
      if (!this.$v.form.invitation_code.$dirty) return errors
      !this.$v.form.password_confirmation.required &&
        errors.push(this.$i18n.t('validation.codeInvitationRequired'))
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
        this.form.username = this.form.email.replace(/[@.]/g, '')
        console.log(this.form.username)
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
a.color-white {
  color: #ffffff;
}
</style>
