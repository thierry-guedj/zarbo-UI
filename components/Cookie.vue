<template>
  <div v-if="isOpen" class="cookie">
    <v-alert prominent type="info" color="#6859de">
      <v-row align="center">
        <v-col class="grow">
          <slot name="message">
            {{ $t('cookies.label1') }}
            <nuxt-link
              class="cookie__link"
              :to="localePath({ name: 'privacy.policy' })"
              >{{ $t('cookies.privacyPolicy') }}</nuxt-link
            >{{ $t('cookies.label2') }}
          </slot>
        </v-col>
        <v-col class="shrink d-flex justify-end" cols="12" md="3">
          <v-btn class="ma-2" @click="accept">{{ buttonTextAccept }}</v-btn>
          <v-btn class="ma-2" text @click="deny">{{ buttonTextDeny }}</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'Cookie',
  props: {
    buttonTextAccept: {
      type: String,
      default: this.$i18n.t('cookies.accept'),
    },
    buttonTextDeny: {
      type: String,
      default: this.$i18n.t('cookies.deny'),
    },
    message: {
      type: String,
      default: this.$i18n.t('cookies.label1'),
    },
    position: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    containerPosition() {
      return `cookie--${this.position}`
    },
  },
  created() {
    if (!this.getGDPR() === true) {
      this.isOpen = true
    }
  },
  methods: {
    getGDPR() {
      if (process.browser) {
        return localStorage.getItem('GDPR:accepted', true)
      }
    },
    accept() {
      if (process.browser) {
        this.isOpen = false
        localStorage.setItem('GDPR:accepted', true)
      }
    },
    deny() {
      if (process.browser) {
        this.isOpen = false
        localStorage.setItem('GDPR:accepted', false)
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.cookie
  z-index: 1
  position: fixed
  bottom: 0
  &__link
    color: #ffffff
    text-decoration: underline
    transition: all .25s
    &:hover
      text-decoration: none
</style>
