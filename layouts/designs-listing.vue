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
                  $t('navigationDrawer.profile')
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
              <v-list-item-title>{{ $t('navigationDrawer.contact') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ name: 'cgu' }" router exact>
            <v-list-item-action>
              <v-icon>policy</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ $t('navigationDrawer.cgu') }}</v-list-item-title>
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
          ><v-btn text class="mr-2 ml-3"
            ><v-toolbar-title class="text-white" v-text="title" /></v-btn
        ></nuxt-link>
        <nuxt-link :to="localePath({ name: 'designs.search' })"
          ><v-btn
            small
            color="transparent"
            :class="{ active: isRouteActive }"
            exact-active-class="active"
            >{{ $t('navbar.artwork') }}</v-btn
          ></nuxt-link
        >
        <nuxt-link :to="localePath({ name: 'users.search' })"
          ><v-btn small color="transparent" class="mr-2">{{
            $t('navbar.artists')
          }}</v-btn>
        </nuxt-link>

        <nuxt-link :to="localePath({ name: 'designs.upload' })">
          <v-btn small class="upload-button mr-2"
            ><v-icon class="mr-2">mdi-cloud-upload</v-icon
            >{{ $t('navbar.upload') }}</v-btn
          >
        </nuxt-link>
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
              <!-- <v-btn text slot="activator"> -->
              <v-btn text v-on="on">
                <v-icon left>expand_more</v-icon>
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
      <v-main>
        <v-container style="max-width: 100%">
          <nuxt />
        </v-container>
      </v-main>

      <v-footer :absolute="!fixed" app dark padless>
        <v-col class="line" cols="12"> </v-col>
        <v-row justify="center" no-gutters>
          <nuxt-link
            v-for="footerLink in footerLinks"
            :key="footerLink.icon"
            :to="footerLink.to"
            ><v-btn color="white" class="footer-links my-2" text rounded>
              <v-icon size="24px"> {{ footerLink.icon }} </v-icon
              >{{ footerLink.title }}
            </v-btn>
          </nuxt-link>
          <v-btn
            color="white"
            class="footer-links my-2"
            text
            rounded
            @click="goTo('ContactForm', 'user')"
          >
            <v-icon size="24px"> mail </v-icon>{{ $t('footer.contact') }}
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
                  ><v-icon size="24px"> face </v-icon>
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
                  ><v-icon size="24px"> brush </v-icon>
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
    ...mapGetters(['visible', 'modalComponent', 'folder']),
    isRouteActive() {
      if (
        this.$nuxt.$route.name === this.localePath({ name: 'designs.search' })
      ) {
        return true
      } else {
        return false
      }
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },

  mounted() {
    this.$nextTick(function () {
      this.hideModal()
      if (this.$i18n.locale !== 'en') {
        require(`moment/locale/${this.$i18n.locale}.js`)
      }
      const url = `locale/${this.$i18n.locale}`
      this.$axios.$get(`${url}`)
      this.$auth.fetchUser()
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
.line {
  height: 1px;
  border-radius: 0px;
  background: whitesmoke;
  padding: 0;
}
.active {
  background-color: #0f1219 !important;
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

.theme--dark.v-main {
  opacity: 0.65;
  background-color: #0f1219;
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
.cookie {
  width: 100%;
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
</style>
