<template>
  <section>
    <v-parallax :src="backgroundUrl" height="800"></v-parallax>
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
        </v-list>
      </v-navigation-drawer>
      <v-app-bar :clipped-left="!clipped" fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-btn icon @click.stop="miniVariant = !miniVariant">
          <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
        </v-btn>
        <!-- <v-btn icon @click.stop="clipped = !clipped">
          <v-icon>mdi-application</v-icon>
        </v-btn> -->
        <!-- <v-btn icon @click.stop="fixed = !fixed">
          <v-icon>mdi-minus</v-icon>
        </v-btn> -->
        <nuxt-link :to="{ name: 'index' }"
          ><v-btn text class="mr-2 ml-3"
            ><v-toolbar-title class="text-white" v-text="title" /></v-btn
        ></nuxt-link>
        <nuxt-link to="/"
          ><v-btn small color="transparent" class="mr-2 ml-3"
            >Zoeuvres</v-btn
          ></nuxt-link
        >
        <nuxt-link to="/"
          ><v-btn small color="transparent" class="mr-2">Zartistes</v-btn>
        </nuxt-link>
        <!-- <base-button
          toggle-modal
          needs-auth
          component-name="CreateForm"
          folder-name="user"
          button-class="upload-button mr-2"
          icon="mdi-cloud-upload"
          >Upload</base-button
        > -->
        <base-button
          to="/upload"
          button-class="upload-button mr-2"
          icon="mdi-cloud-upload"
          >Upload</base-button
        >
        <v-spacer />
        <v-text-field
          solo-inverted
          flat
          hide-details
          label="Search"
          prepend-inner-icon="search"
        ></v-text-field>
        <!-- Before Login -->
        <template v-if="!$auth.loggedIn">
          <base-button
            toggle-modal
            component-name="LoginForm"
            folder-name="auth"
            icon="face"
            color="transparent"
            >Login</base-button
          >
          <base-button
            toggle-modal
            component-name="RegisterForm"
            folder-name="auth"
            icon="brush"
            color="transparent"
            >Sign Up</base-button
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
              >Sign Out</v-btn
            ></nuxt-link
          >
          <v-menu
            bottom
            origin="center center"
            transition="scale-transition"
            color="rgba(23, 22, 18, 0.64)"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Your account
              </v-btn>
            </template>

            <v-list>
              <v-list-item v-for="(item, i) in menuAccount" :key="i">
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
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main>
        <v-container>
          <nuxt />
        </v-container>
      </v-main>
      <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
        <v-list>
          <v-list-item @click.native="right = !right">
            <v-list-item-action>
              <v-icon light>
                mdi-repeat
              </v-icon>
            </v-list-item-action>
            <v-list-item-title>Switch drawer (click me)</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-footer :absolute="!fixed" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
  </section>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-looks',
          title: 'Oeuvres',
          to: '/inspire',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Artistes',
          to: '/inspire',
        },
        {
          icon: 'mdi-face',
          title: 'Sign In',
          to: '/inspire',
        },
        {
          icon: 'mdi-brush',
          title: 'Sign Up',
          to: '/inspire',
        },
      ],
      menuAccount: [
        {
          title: 'Dashboard',
          route: 'settings.dashboard',
        },
        {
          title: 'Update profile',
          route: 'settings.profile',
        },
      ],

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'zarbo',
      bgImage: Math.floor(Math.random() * 21) + '_resultat.jpg',
    }
  },
  computed: {
    backgroundUrl() {
      return require(`~/assets/images/bg1280-hauteur/${this.bgImage}`)
    },

    // ...mapGetters(['visible', 'modalComponent', 'folder']),
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    logout() {
      this.$auth.logout()
    },
    goTo() {},
  },
}
</script>

<style lang="scss" scoped>
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  opacity: 1;
  background-color: rgba(23, 22, 18, 0.64);
}
.v-application {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

.theme--dark.v-navigation-drawer {
  background-color: rgba(23, 22, 18, 0.64);
  top: 64px;
}
</style>
