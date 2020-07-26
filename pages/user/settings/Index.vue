<template>
  <div class="user-account-setting">
    <div class="container">
      <div class="row">
        <!-- LEFT -->
        <div id="myScrollspy" class="col-sm-3">
          <v-list>
            <v-list-item-group>
              <v-list-item v-for="link in links" :key="link.route">
                <v-list-item-icon>
                  <v-icon v-text="link.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <nuxt-link :to="{ name: link.route }"
                    ><v-list-item-title v-text="link.title"></v-list-item-title
                  ></nuxt-link>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>

        <!-- RIGHT -->
        <div class="col-sm-9">
          <router-view></router-view>
        </div>
        <!-- END RIGHT -->
      </div>
    </div>
    <!-- END CONTAINER -->
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      links: [
        {
          title: 'Dashboard',
          route: 'settings.dashboard',
        },
        {
          title: 'Update profile',
          route: 'settings.profile',
        },
        {
          title: 'Designs',
          route: 'settings.designs',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
