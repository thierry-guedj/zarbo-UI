<template>
  <v-form novalidate @submit.stop.prevent="submit">
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">mail</i
      >{{ $t('contact.contact') }}</v-card-title
    >
    <v-alert
      v-if="form.errors.has('name')"
      color="#e53935"
      dark
      icon="person_add_disabled"
      border="right"
      :form="form"
      class="mb-2"
    >
      {{ form.errors.get('name') }}
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
      class="alert-success"
      dark
      icon="mark_email_unread"
      border="right"
      :form="form"
      >{{ $t('contact.emailSent') }}</v-alert
    >
    <div v-if="!this.$v.form.$model.successful">
      <v-text-field
        v-model.trim="$v.form.name.$model"
        :error-messages="nameErrors"
        :label="$t('contact.name')"
        required
        @input="$v.form.name.$touch()"
        @blur="$v.form.name.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="$v.form.email.$model"
        :error-messages="emailErrors"
        :label="$t('contact.email')"
        required
        @input="$v.form.email.$touch()"
        @blur="$v.form.email.$touch()"
      ></v-text-field>
      <v-text-field
        v-model.trim="form.subject"
        :label="$t('contact.subject')"
        required
      ></v-text-field>
      <v-textarea
        v-model.trim="$v.form.message.$model"
        :error-messages="messageErrors"
        :counter="3000"
        :form="form"
        :placeholder="$t('contact.message')"
        field="message"
        outlined
        class="mb-1"
        @input="$v.form.message.$touch()"
        @blur="$v.form.message.$touch()"
      ></v-textarea>
      <v-spacer class="mb-3" />
      <v-btn
        class="mr-4 float-right"
        :loading="loadingSubmit"
        :disabled="$v.form.$invalid"
        :type="$t('contact.submit')"
        >{{ $t('contact.submit') }}</v-btn
      >
      <v-btn @click="clear">{{ $t('contact.cancel') }}</v-btn>
    </div>
  </v-form>
</template>

<script>
import { required, maxLength, minLength, email } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
export default {
  name: 'ContactForm',
  middleware: ['guest'],
  props: {
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
  validations: {
    form: {
      name: {
        required,
        maxLen: maxLength(120),
      },
      email: {
        required,
        email,
      },
      subject: {
        required,
        maxLen: maxLength(120),
      },
      message: {
        required,
        maxLen: maxLength(3000),
      },
    },
  },

  data() {
    return {
      form: this.$vform({
        email: '',
        name: '',
        subject: '',
        message: '',
      }),
      loader: null,
      loadingSubmit: false,
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.maxLen && errors.push('validation.nameMaxLength')
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
    subjectErrors() {
      const errors = []
      if (!this.$v.form.subject.$dirty) return errors
      !this.$v.form.subject.maxLen &&
        errors.push(this.$i18n.t('validation.subjectMaxLength'))
      !this.$v.form.subject.required &&
        errors.push(this.$i18n.t('validation.subjectRequired'))
      return errors
    },
    messageErrors() {
      const errors = []
      if (!this.$v.form.message.$dirty) return errors
      !this.$v.form.message.required &&
        errors.push(this.$i18n.t('validation.messageRequired'))
      !this.$v.form.message.maxLen &&
        errors.push(this.$i18n.t('validation.messageMaxLength'))
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
        console.log(this.form.username)
        this.form
          .post(`contact`)
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
