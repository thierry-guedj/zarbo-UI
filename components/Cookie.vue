<template>
  <div v-if="isOpen" class="cookie">
    <v-alert prominent type="info" color="#212121">
      <v-row align="center">
        <v-col class="grow">
          <slot name="message">
            {{ $t('cookie.label1') }}
            <nuxt-link
              class="cookie__link"
              :to="localePath({ name: 'privacy.policy' })"
              >{{ $t('cookie.privacyPolicy') }}</nuxt-link
            >{{ $t('cookie.label2') }}
          </slot>
        </v-col>
        <v-col class="shrink d-flex justify-end" cols="12" md="3">
          <v-btn v-bind="size" class="ma-2" @click="accept">{{
            buttonTextAccept
          }}</v-btn>
          <v-btn v-bind="size" class="ma-2" text @click="deny">{{
            buttonTextDeny
          }}</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'Cookie',
  props: {
    /* buttonTextAccept: {
      type: String,
      default: 'Accept',
    },
    buttonTextDeny: {
      type: String,
      default() {
        this.$t('cookie.deny')
      },
    },
    message: {
      type: String,
      default() {
        this.$i18n.t('cookie.label1')
      },
    }, */
    position: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      isOpen: false,
      buttonTextAccept: this.$i18n.t('cookie.accept'),
      buttonTextDeny: this.$i18n.t('cookie.deny'),
      message: this.$i18n.t('cookie.label1'),
    }
  },
  computed: {
    containerPosition() {
      return `cookie--${this.position}`
    },
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
  z-index: 4
  position: fixed
  bottom: 0
  &__link
    color: #ffffff
    text-decoration: underline
    transition: all .25s
    &:hover
      color: #ffffff
      text-decoration: none
</style>
