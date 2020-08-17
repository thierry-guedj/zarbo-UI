<template>
  <div class="user-account-setting">
    <div class="container">
      <div class="row">
        <!-- LEFT -->
       <!--  <div id="myScrollspy" class="col-sm-3">
          <v-list class="list-settings">
            <v-list-item-group>
              <v-list-item v-for="link in links" :key="link.route">
                <v-list-item-icon>
                  <v-icon v-text="link.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <nuxt-link :to="{ name: link.route }"
                    ><v-list-item-title v-text="link.title" class="list-item-settings"></v-list-item-title
                  ></nuxt-link>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div> -->

        <!-- RIGHT -->
        <div class="col-sm-12">
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
  layout:"page2",
  data() {
    return {
      links: [
        {
          title: 'Dashboard',
          route: 'settings.dashboard',
          icon: 'dashboard',
        },
        {
          title: 'Update profile',
          route: 'settings.profile',
          icon: 'assignment_ind',
        },
        {
          title: 'Designs',
          route: 'settings.designs',
          icon: 'collections',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.list-settings {
  background: #0f1219;
  border: 1px solid whitesmoke;
  border-radius: 6px;
}
.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 3px;
}
.list-item-settings {
  color: #ffffff;
  text-decoration: none;
}
.list-item-settings.a {
  color: #ffffff;
  text-decoration: none;
}
</style>
