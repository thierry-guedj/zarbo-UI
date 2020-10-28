<template>
  <v-form novalidate @submit.stop.prevent="submit">
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">mark_email_unread</i
      >{{ $t('resendForm.resendVerificationEmail') }}</v-card-title
    >
    <v-alert
      v-if="form.errors.has('message')"
      dark
      transition="scale-transition"
      icon="announcement"
      border="right"
      :form="form"
      class="alert-error mb-2"
    >
      {{ form.errors.get('message') }}
      <p
        v-if="
          form.errors.get('message') === $t('Email address already verified')
        "
        class="font-14 fw-400 text-center mt-4"
      >
        <base-link component-name="LoginForm" folder-name="auth">{{
          $t('resendForm.proceedToLogin')
        }}</base-link>
      </p>
      <p v-else class="font-14 fw-400 text-center mt-4">
        {{ $t('resendForm.noAccount') }}

        <base-link component-name="RegisterForm" folder-name="auth">
          {{ $t('resendForm.createAccount') }}</base-link
        >
      </p>
    </v-alert>
    <v-alert
      v-if="this.$v.form.$model.successful"
      class="alert-success"
      dark
      transition="scale-transition"
      icon="mark_email_unread"
      border="right"
      :form="form"
    >
      {{ $t('resendForm.resentEmail') }}
      <v-spacer class="mb-3" />
      <div class="text-center">
        <v-btn v-bind="size" @click="hideModal">{{
          $t('contact.closeWindow')
        }}</v-btn>
      </div></v-alert
    >
    <div v-if="!this.$v.form.$model.successful">
      <v-text-field
        v-model="$v.form.email.$model"
        :error-messages="emailErrors"
        :label="$t('resendForm.email')"
        required
        @input="$v.form.email.$touch()"
        @blur="$v.form.email.$touch()"
      ></v-text-field>
      <v-spacer class="mb-3" />
      <v-btn
        v-bind="size"
        class="mr-4 float-right"
        :loading="loadingSubmit"
        :disabled="$v.form.$invalid"
        type="submit"
        >{{ $t('resendForm.submit') }}</v-btn
      >
      <v-btn v-bind="size" :disabled="loadingSubmit" @click="hideModal">{{
        $t('contact.cancel')
      }}</v-btn>
      <div class="font-14 fw-400 text-center mt-4 right">
        {{ $t('resendForm.noAccount') }}

        <base-link component-name="RegisterForm" folder-name="auth">
          {{ $t('resendForm.createAccount') }}</base-link
        >
      </div>
    </div>
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
    }
  },
  computed: {
    emailErrors() {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      !this.$v.form.email.email &&
        errors.push(this.$i18n.t('validation.emailValid'))
      !this.$v.form.email.required &&
        errors.push(this.$i18n.t('validation.emailRequired'))
      return errors
    },
    size() {
      const size = {
        xs: 'small',
        sm: 'small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
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
      if (!this.$v.form.$anyError) {
        this.form
          .post(`/verification/resend`)
          .then((res) => {})
          .catch((e) => {})
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
