<template>
  <section>
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">mark_email_read</i
      >{{ $t('verifyForm.emailVerification') }}</v-card-title
    >
    <v-card-text>
      <div v-if="success">
        <v-alert
          class="alert-success text-center"
          transition="scale-transition"
          border="right"
        >
          {{ status }}

          <base-link component-name="LoginForm" folder-name="auth" redirect>{{
            $t('verifyForm.proceedToLogin')
          }}</base-link>
        </v-alert>
      </div>
      <div v-else>
        <v-alert
          class="alert-error"
          icon="announcement"
          transition="scale-transition"
          border="right"
        >
          <div>
            {{ status }}
            <p v-if="status === 'Email address already verified'">
              <base-link component-name="LoginForm" folder-name="auth">{{
                $t('verifyForm.proceedToLogin')
              }}</base-link>
            </p>
            <p v-else>
              <base-link
                component-name="ResendForm"
                folder-name="auth"
                redirect
                >{{ $t('verifyForm.resendVerificationEmail') }}</base-link
              >
            </p>
          </div>
          <v-spacer class="mb-3" />
          <div class="text-center">
            <v-btn v-bind="size" @click="hideModal">{{
              $t('contact.closeWindow')
            }}</v-btn>
          </div>
        </v-alert>
      </div>
    </v-card-text>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'VerifyForm',
  layout: 'default',
  middleware: ['guest'],
  props: {
    value: {
      type: Boolean,
    },
    success: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: '',
    },
    modalClosed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    size() {
      const size = {
        xs: 'x-small',
        sm: 'small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
    },
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
  },
}
</script>

<style lang="scss" scoped>
a.color-white {
  color: #ffffff;
}
</style>
