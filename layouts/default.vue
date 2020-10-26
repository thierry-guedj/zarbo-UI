<template>
  <section>
    <v-app dark>
      <div id="grad1" class="line"></div>
      <v-navigation-drawer
        v-if="$vuetify.breakpoint.xs"
        v-model="drawer"
        :mini-variant="miniVariant"
        :clipped="clipped"
        width="100%"
        height="100%"
        bottom
        class="nav-drawer mt-16 hidden-sm-and-up"
        app
      >
        <v-list class="drawerList">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
          <template v-if="!$auth.loggedIn" class="hidden-sm-and-up">
            <v-list-item to="" router exact @click="goTo('LoginForm', 'auth')">
              <v-list-item-action>
                <v-icon>face</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{
                  $t('navigationDrawer.signin')
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              to=""
              router
              exact
              @click.stop="goTo('RegisterForm', 'auth')"
            >
              <v-list-item-action>
                <v-icon>brush</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{
                  $t('navigationDrawer.signup')
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item :to="{ name: 'settings.designs' }" router exact>
              <v-list-item-action>
                <v-icon>looks</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{
                  $t('navigationDrawer.yourDesigns')
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'settings.profile' }" router exact>
              <v-list-item-action>
                <v-icon>face</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{
                  $t('navigationDrawer.yourProfile')
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="" router exact @click.stop="logout()">
              <v-list-item-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{
                  $t('navigationDrawer.signout')
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item router exact @click="goTo('ContactForm', 'user')">
            <v-list-item-action>
              <v-icon>mail</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{
                $t('navigationDrawer.contact')
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ name: 'cgu' }" router exact>
            <v-list-item-action>
              <v-icon>policy</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{
                $t('navigationDrawer.cgu')
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ name: 'privacy.policy' }" router exact>
            <v-list-item-action>
              <v-icon>mdi-security</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{
                $t('navigationDrawer.privacyPolicy')
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xs"
        @click.stop="drawer = !drawer"
      />
      <v-app-bar
        v-if="!$vuetify.breakpoint.xs"
        id="nav"
        class="bg-transparent line"
        :clipped-left="!clipped"
        fixed
        elevate-on-scroll
        app
      >
        <nuxt-link :to="localePath({ name: 'index' })"
          ><v-btn v-bind="size" text class="mr-2 ml-3"
            ><v-toolbar-title class="text-white" v-text="title" /></v-btn
        ></nuxt-link>
        <nuxt-link :to="localePath({ name: 'designs.search' })"
          ><v-btn
            v-bind="size"
            color="transparent"
            class="mr-2"
            exact-active-class="active"
            >{{ $t('navbar.artwork') }}</v-btn
          ></nuxt-link
        >
        <nuxt-link :to="localePath({ name: 'users.search' })"
          ><v-btn v-bind="size" color="transparent" class="mr-2">{{
            $t('navbar.artists')
          }}</v-btn>
        </nuxt-link>

        <nuxt-link :to="localePath({ name: 'designs.upload' })">
          <v-btn v-bind="size" class="upload-button mr-2"
            ><v-icon v-bind="size" class="mr-2">mdi-cloud-upload</v-icon
            >{{ $t('navbar.upload') }}</v-btn
          >
        </nuxt-link>
        <v-spacer />
        <!-- Before Login -->
        <template v-if="!$auth.loggedIn">
          <v-btn
            v-bind="size"
            color="transparent"
            @click="goTo('LoginForm', 'auth')"
            ><v-icon v-bind="size" class="mr-2">face</v-icon
            >{{ $t('navbar.signin') }}</v-btn
          >
          <v-btn
            v-bind="size"
            color="transparent"
            @click="goTo('RegisterForm', 'auth')"
            ><v-icon v-bind="size" class="mr-2">brush</v-icon>
            {{ $t('navbar.signup') }}</v-btn
          >
        </template>
        <!-- End Before Login -->

        <!-- After Login -->
        <template v-else>
          <nuxt-link :to="localePath({ name: 'settings.profile' })"
            ><avatar
              :username="$auth.user.name"
              :src="$auth.user.avatars.medium"
              class="ml-3 mr-2"
              :size="50"
            ></avatar>
          </nuxt-link>
          <!-- dropdown menu -->
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <!-- <v-btn v-bind="size" text slot="activator"> -->
              <v-btn v-bind="size" text v-on="on">
                <v-icon v-bind="size" left>expand_more</v-icon>
                <span class="text-capitalize">{{ $auth.user.name }}</span>
              </v-btn>
            </template>
            <v-list>
              <!-- v-list-tile is changed to v-list-item -->
              <v-list-item
                v-for="link in menuAccount"
                :key="link.title"
                router
                :to="link.route"
                class="text-white"
              >
                <v-list-item-action class="mr-2 ml-2">
                  <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="link.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <nuxt-link to=""
            ><v-btn
              small
              fab
              color="transparent"
              class="mr-2 ml-3"
              @click.prevent="logout"
              ><v-icon right dark class="mr-2">exit_to_app</v-icon></v-btn
            ></nuxt-link
          >
        </template>
        <!-- End After Login -->
      </v-app-bar>
      <v-parallax :src="backgroundUrl" height="500">
        <div class="mt-18 text-left text-parallax mb-0">
          <h1 class="whitesmoke--text text-left text--lighten-2 mb-0">
            Zarbo,
          </h1>
        </div>
      </v-parallax>

      <div class="line"></div>
      <v-main>
        <v-container class="main-container">
          <nuxt />
        </v-container>
      </v-main>
      <div class="line"></div>
      <v-parallax :src="backgroundUrl" height="600"
        ><div class="mt-18 text-center text-parallax mb-0">
          <p class="subtitle text-center mt-0">{{ $t('index.title') }}</p>
        </div>
      </v-parallax>

      <v-footer :absolute="!fixed" app dark padless>
        <v-col class="line" cols="12"> </v-col>
        <v-row justify="center" no-gutters>
          <nuxt-link
            v-for="footerLink in footerLinks"
            :key="footerLink.icon"
            :to="footerLink.to"
            ><v-btn
              v-bind="size"
              color="white"
              class="footer-links my-2"
              text
              rounded
            >
              <v-icon v-bind="size" size="24px"> {{ footerLink.icon }} </v-icon
              >{{ footerLink.title }}
            </v-btn>
          </nuxt-link>
          <v-btn
            v-bind="size"
            color="white"
            class="footer-links my-2"
            text
            rounded
            @click="goTo('ContactForm', 'user')"
          >
            <v-icon v-bind="size" size="24px"> mail </v-icon
            >{{ $t('footer.contact') }}
          </v-btn>
          <template v-if="!$auth.loggedIn">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }"
                ><v-btn
                  color="white"
                  text
                  rounded
                  class="my-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="goTo('LoginForm', 'auth')"
                  ><v-icon v-bind="size" size="24px"> face </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('footer.signin') }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="white"
                  text
                  rounded
                  class="my-2"
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="goTo('RegisterForm', 'auth')"
                  ><v-icon v-bind="size" size="24px"> brush </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('footer.signup') }}</span>
            </v-tooltip>
          </template>
          <nuxt-link
            v-for="locale in availableLocales"
            :key="locale.code"
            :to="switchLocalePath(locale.code)"
            >{{ locale.name }}</nuxt-link
          >
          <a href="https://www.buymeacoffee.com/zarbo">
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              class="my-2 ml-2 float-right"
              style="height: 40px; border: none"
              target="_blank"
            />
          </a>
          <v-col class="footer-bottom py-4 text-center white--text" cols="12">
            {{ new Date().getFullYear() }} — <strong>Zarbo</strong>
          </v-col>
        </v-row>
      </v-footer>
      <client-only>
        <Cookie />
      </client-only>
    </v-app>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Avatar from 'vue-avatar'
import Cookie from '@/components/Cookie.vue'
export default {
  name: 'Default',
  scrollToTop: true,
  components: {
    Avatar,
    Cookie,
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: this.$i18n.t('navigationDrawer.welcome'),
          to: this.localePath({ name: 'index' }),
        },
        {
          icon: 'mdi-looks',
          title: this.$i18n.t('navigationDrawer.artwork'),
          to: this.localePath({ name: 'designs.search' }),
        },
        {
          icon: 'mdi-chart-bubble',
          title: this.$i18n.t('navigationDrawer.artists'),
          to: this.localePath({ name: 'users.search' }),
        },
        {
          icon: 'mdi-cloud-upload',
          title: this.$i18n.t('navigationDrawer.publishArtwork'),
          to: this.localePath({ name: 'designs.upload' }),
        },
      ],
      menuAccount: [
        {
          title: this.$i18n.t('menuAccount.yourDesigns'),
          route: this.localePath({ name: 'settings.designs' }),
          icon: 'mdi-looks',
        },
        {
          title: this.$i18n.t('menuAccount.yourProfile'),
          route: this.localePath({ name: 'settings.profile' }),
          icon: 'mdi-face',
        },
      ],
      footerLinks: [
        {
          icon: 'mdi-apps',
          title: this.$i18n.t('footer.home'),
          to: this.localePath({ name: 'index' }),
        },
        {
          icon: 'mdi-looks',
          title: this.$i18n.t('footer.artwork'),
          to: this.localePath({ name: 'designs.search' }),
        },
        {
          icon: 'mdi-chart-bubble',
          title: this.$i18n.t('footer.artists'),
          to: this.localePath({ name: 'users.search' }),
        },
        {
          icon: 'mdi-security',
          title: this.$i18n.t('footer.privacyPolicy'),
          to: this.localePath({ name: 'privacy.policy' }),
        },
        {
          icon: 'policy',
          title: this.$i18n.t('footer.cgu'),
          to: this.localePath({ name: 'cgu' }),
        },
      ],

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'zarbo',
      bgImage: 'bg' + Math.floor(Math.random() * 39) + '.jpg',
      scrollPosition: null,
      locale: this.$i18n.locale,
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'login') {
      this.goTo('loginForm', 'auth')
      from()
    } else {
      next()
    }
  },

  watch: {
    locale(newVal) {
      console.log(newVal)
      // require(`moment/locale/${newVal}.js`)
      this.$moment().locale(newVal)
      this.$i18n.setLocale(newVal)
    },
  },
  computed: {
    backgroundUrl() {
      return require(`~/assets/images/bg/${this.bgImage}`)
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
    ...mapGetters(['visible', 'modalComponent', 'folder']),
    size() {
      const size = {
        xs: 'x-small',
        sm: 'x-small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.hideModal()
      console.log(this.locale)
      if (this.$i18n.locale !== 'en') {
        require(`moment/locale/${this.$i18n.locale}.js`)
      }

      const url = `locale/${this.$i18n.locale}`
      this.$axios.$get(`${url}`)

      window.addEventListener('scroll', function () {
        const navbar = document.getElementById('nav')
        const navClasses = navbar.classList
        if (document.documentElement.scrollTop >= 100) {
          if (navClasses.contains('bg-dark') === false) {
            navClasses.toggle('bg-dark')
            navClasses.toggle('bg-transparent')
          }
        } else if (navClasses.contains('bg-transparent') === false) {
          navClasses.toggle('bg-transparent')
          navClasses.toggle('bg-dark')
        }
      })
    })
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),

    logout() {
      this.$auth.logout()
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
    goTo(to, folderName) {
      setTimeout(
        () => this.showModal({ componentName: to, folder: folderName }),
        300
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.drawerList {
  margin-left: 6px;
}
.v-parallax__image {
  translate: none !important;
}
.footer-links {
  font-size: 10px;
}
.nav-drawer {
  min-height: 100%;
}
.footer-bottom {
  background-color: #0f1219;
}
footer {
  position: inherit;
  bottom: 0;
}
.layout {
  display: contents;
}
.vue-avatar--wrapper {
  min-width: 50px;
}
.subtitle {
  font-size: 26px;
  margin-left: 20px;
}
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined).upload-button {
  background-color: rgba(31, 124, 142, 0.65);
}
.v-application a {
  text-decoration: none;
  color: whitesmoke;
}
/* .theme--dark.v-list {
  background: #0f1219;
} */
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,400;0,500;0,600;1,100&display=swap');

.text-parallax {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 5rem;
}
.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0;
}

.theme--dark.v-application {
  background-color: #0f1219;
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 300;
  font-size: 15px;
  transition-property: opacity;
  transition-duration: 0.35s;
  line-height: 1.6em;
  text-rendering: optimizelegibility;
  color: whitesmoke;
}

.theme--dark.v-navigation-drawer {
  background-color: rgba(23, 22, 18, 0.64);
  top: 64px;
}
#nav.bg-dark {
  background: #0f1219;
  transition: 0.75s ease;
}
#nav.bg-transparent {
  opacity: 0.75;
  background-color: #424242;
  transition: 0.75s ease;
}

#grad1 {
  background: red; /* For browsers that do not support gradients */
  background: -webkit-linear-gradient(
    left,
    orange,
    yellow,
    green,
    cyan,
    blue,
    violet
  ); /* For Safari 5.1 to 6.0 */
  background: -o-linear-gradient(
    right,
    orange,
    yellow,
    green,
    cyan,
    blue,
    violet
  ); /* For Opera 11.1 to 12.0 */
  background: -moz-linear-gradient(
    right,
    orange,
    yellow,
    green,
    cyan,
    blue,
    violet
  ); /* For Firefox 3.6 to 15 */
  background: linear-gradient(
    to right,
    orange,
    yellow,
    green,
    cyan,
    blue,
    violet
  ); /* Standard syntax (must be last) */
}
.line {
  height: 1px;
  border-radius: 0px;
  background: whitesmoke;
  padding: 0;
}
@media screen and (min-width: 320px) {
  html {
    font-size: calc(16px + 6 * ((100vw - 320px) / 680));
  }
}
@media screen and (min-width: 1000px) {
  html {
    font-size: 22px;
  }
}
.container {
  max-width: 100%;
  text-align: left;
}
.v-main {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.main-container {
  max-width: 100%;
  padding: 5px 26px;
}
.cookie {
  width: 100%;
}
.v-list-item {
  min-height: 48px;
  outline: none;
  padding: 0 0 !important;
}
</style>
