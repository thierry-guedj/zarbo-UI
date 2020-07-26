<template>
  <section>
    <v-card-title class="headline"
      ><i class="material-icons md-24 mr-2">mark_email_read</i>Email
      Verification</v-card-title
    >
    <v-card-text>
      <div v-if="success">
        <v-alert class="alert-success text-center" border="right">
          {{ status }}

          <base-link component-name="LoginForm" folder-name="auth" redirect
            >Proceed to Login</base-link
          >
        </v-alert>
      </div>
      <div v-else>
        <v-alert class="alert-error" icon="announcement" border="right">
          <div>
            {{ status }}
            <p v-if="status === 'Email address already verified'">
              <base-link component-name="LoginForm" folder-name="auth"
                >Proceed to Login</base-link
              >
            </p>
            <p v-else>
              <base-link component-name="ResendForm" folder-name="auth" redirect
                >Resend verification email</base-link
              >
            </p>
          </div>
        </v-alert>
      </div>
    </v-card-text>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
export default {
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
  methods: {
    ...mapActions(['showModal', 'hideModal']),
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
