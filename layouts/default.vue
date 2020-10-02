<template>
  <section>
    <div id="grad1" class="line"></div>
    <v-parallax :src="backgroundUrl" height="600">
      <div class="mt-18 text-center text-parallax mb-0">
        <h1 class="teal--text text-center text--lighten-2 mb-0">Zarbo,</h1>
        <!-- <p class="subtitle text-center mt-0">{{ $t('index.title') }}</p> -->
      </div>
    </v-parallax>

    <v-app dark>
      <v-navigation-drawer
        v-model="drawer"
        :mini-variant="miniVariant"
        :clipped="clipped"
        class="mt-16"
        app
      >
        <v-list>
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
          <template v-if="!$auth.loggedIn">
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
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        id="nav"
        class="bg-transparent line"
        :clipped-left="!clipped"
        fixed
        elevate-on-scroll
        app
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
          <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
        </v-btn> -->

        <nuxt-link :to="{ name: 'index' }"
          ><v-btn text class="mr-2 ml-3"
            ><v-toolbar-title class="text-white" v-text="title" /></v-btn
        ></nuxt-link>
        <nuxt-link :to="localePath({ name: 'designs.search' })"
          ><v-btn small color="transparent" class="mr-2 ml-3">{{
            $t('navbar.artwork')
          }}</v-btn></nuxt-link
        >
        <nuxt-link :to="localePath({ name: 'users.search' })"
          ><v-btn small color="transparent" class="mr-2">{{
            $t('navbar.artists')
          }}</v-btn>
        </nuxt-link>

        <template v-if="$auth.loggedIn">
          <nuxt-link :to="localePath({ name: 'designs.upload' })">
            <v-btn small class="upload-button mr-2"
              ><v-icon class="mr-2">mdi-cloud-upload</v-icon
              >{{ $t('navbar.upload') }}</v-btn
            >
          </nuxt-link>
        </template>
        <template v-else>
          <base-button
            toggle-modal
            component-name="LoginForm"
            folder-name="auth"
            button-class="upload-button mr-2"
            icon="mdi-cloud-upload"
            >{{ $t('navbar.upload') }}</base-button
          >
        </template>
        <v-spacer />
        <!-- Before Login -->
        <template v-if="!$auth.loggedIn">
          <base-button
            toggle-modal
            component-name="LoginForm"
            folder-name="auth"
            icon="face"
            color="transparent"
            >{{ $t('navbar.signin') }}</base-button
          >
          <base-button
            toggle-modal
            component-name="RegisterForm"
            folder-name="auth"
            icon="brush"
            color="transparent"
            >{{ $t('navbar.signup') }}</base-button
          >
        </template>
        <!-- End Before Login -->

        <!-- After Login -->
        <template v-else>
          <nuxt-link to=""
            ><v-btn
              small
              color="transparent"
              class="mr-2 ml-3"
              @click.prevent="logout"
              ><v-icon right dark class="mr-2">exit_to_app</v-icon
              >{{ $t('navbar.signout') }}</v-btn
            ></nuxt-link
          >
          <!-- <img class="user-thumb" width="30px" :src="$auth.user.photo_url" /> -->
          <avatar
            :username="$auth.user.name"
            :src="$auth.user.avatars.medium"
            class="ml-3 mr-2"
            :size="40"
          ></avatar>
          <v-menu
            offset-y
            bottom
            origin="bottom center"
            transition="scale-transition"
            color="#0f1219"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="transparent" dark v-bind="attrs" v-on="on">
                <span class="user-name font-12 fw-500">
                  {{ $auth.user.name }}
                </span>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in menuAccount"
                :key="i"
                link
                class="text-white"
              >
                <nuxt-link :to="item.route">
                  <v-list-item-title>{{
                    item.title
                  }}</v-list-item-title></nuxt-link
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <!-- End After Login -->

        <nuxt-link
          v-for="locale in availableLocales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
          >{{ locale.name }}</nuxt-link
        >

        <!--  <a
          v-for="locale in availableLocales"
          :key="locale.code"
          href="#"
          @click.prevent.stop="setLocaleCookie(locale.code)"
          >{{ locale.name }}</a
        > -->
      </v-app-bar>
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

      <!--  <v-footer :absolute="!fixed" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer> -->

      <v-footer :absolute="!fixed" app dark padless>
        <v-col class="line" cols="12"> </v-col>
        <v-row justify="center" no-gutters>
          <v-btn
            v-for="footerLink in footerLinks"
            :key="footerLink.icon"
            color="white"
            text
            rounded
            class="my-2"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="24px" v-bind="attrs" v-on="on">
                  {{ footerLink.icon }}
                </v-icon>
              </template>
              <span>Tooltip</span>
            </v-tooltip>
          </v-btn>
          <v-btn
            color="white"
            text
            rounded
            class="my-2"
            @click="goTo('ContactForm', 'user')"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }"
                ><v-icon size="24px" v-bind="attrs" v-on="on">
                  mail
                </v-icon>
              </template>
              <span>Tooltip</span>
            </v-tooltip>
          </v-btn>
          <template v-if="!$auth.loggedIn">
            <v-btn
              color="white"
              text
              rounded
              class="my-2"
              @click="goTo('LoginForm', 'auth')"
              ><v-icon size="24px">
                face
              </v-icon>
            </v-btn>
            <v-btn
              color="white"
              text
              rounded
              class="my-2"
              @click.stop="goTo('RegisterForm', 'auth')"
              ><v-icon size="24px">
                brush
              </v-icon>
            </v-btn>
          </template>
          <template v-else> </template>
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
      ],
      menuAccount: [
        {
          title: this.$i18n.t('menuAccount.yourDesigns'),
          route: this.localePath({ name: 'settings.designs' }),
        },
        {
          title: this.$i18n.t('menuAccount.yourProfile'),
          route: this.localePath({ name: 'settings.profile' }),
        },
      ],
      footerLinks: [
        {
          icon: 'mdi-apps',
          title: this.$i18n.t('navigationDrawer.welcome'),
          to: this.localePath({ name: 'index' }),
          toolTip: 'Accueil',
        },
        {
          icon: 'mdi-looks',
          title: this.$i18n.t('navigationDrawer.artwork'),
          to: this.localePath({ name: 'designs.search' }),
          toolTip: 'Accueil',
        },
        {
          icon: 'mdi-chart-bubble',
          title: this.$i18n.t('navigationDrawer.artists'),
          to: this.localePath({ name: 'users.search' }),
          toolTip: 'Accueil',
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
  },
  mounted() {
    this.$nextTick(function () {
      this.hideModal()
      console.log(this.locale)
      if (this.$i18n.locale !== 'en') {
        require(`moment/locale/${this.$i18n.locale}.js`)
      }

      const url = `setLang/${this.$i18n.locale}`
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
.footer-bottom {
  background-color: #0f1219;
}
.layout {
  display: contents;
}
.vue-avatar--wrapper {
  min-width: 40px;
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
.theme--dark.v-list {
  background: #0f1219;
}
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,400;0,500;0,600;1,100&display=swap');
// @import url('https://fonts.googleapis.com/css2?family=Cabin:wght@600&display=swap');

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

footer {
  position: absolute;
  bottom: 0;
}
.theme--dark.v-application {
  background-color: #0f1219;
  font-family: 'Josefin Sans', sans-serif;

  font-size: 15px;
  transition-property: opacity;
  transition-duration: 0.35s;
  line-height: 1.6em;
  text-rendering: optimizelegibility;
}
.v-toolbar__content,
.v-toolbar__extension {
  padding-top: 40px;
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
/* .transparent.v-btn--contained {
  background-color: #000000;
} */
.theme--dark.v-main {
  opacity: 0.65;
  background-color: #0f1219;
  padding-top: 0;
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
  height: 10px;
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
}
.main-container {
  max-width: 100%;
  padding: 5px 10px;
}
.cookie {
  width: 100%;
}
</style>
