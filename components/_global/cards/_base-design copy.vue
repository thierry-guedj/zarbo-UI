<template>
  <div>
    <v-col md="auto">
      <v-hover v-slot:default="{ hover }">
        <v-card
          class="pa-1 mx-auto card-design"
          width="420"
          outlined
          rounded
          hover
          @click="goTo('Show', '', `${design.slug}`)"
        >
          <v-img :src="`${design.images.thumbnail}`">
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out v-card--reveal display-3 white--text"
                style="height: 100%;"
              >
                <v-card-text>
                  {{ design.description }}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-img>

          <v-list-item>
            <v-list-item-avatar
              color="grey"
              style="width: 30px; height: 30px; min-width: 30px;"
              ><img :src="design.user.photo_url"
            /></v-list-item-avatar>
            <v-list-item-content class="design-info">
              <v-list-item-title class="headline design-info">{{
                design.title
              }}</v-list-item-title>

              <v-list-item-subtitle class="design-info">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ design.user.name }}</span>
                  </template>
                  <span>Tooltip</span>
                </v-tooltip>
                <span
                  v-if="design.team"
                  class="badge badge-pill badge-secondary text-white font-10 pr-1 pl-1 fw-300"
                  >+ team</span
                ></v-list-item-subtitle
              >
              <v-list-item class="design-info"
                >Uploaded
                {{ design.created_at_dates.created_at_human }}</v-list-item
              >
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn icon>
              <v-icon>remove_red_eye</v-icon>
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn icon class="mr-2 ml-0 like">
              <v-icon class="like">mdi-heart</v-icon>{{ design.likes_count }}
            </v-btn>
            <v-btn icon class="mr-0 comment">
              <v-icon>mdi-comment</v-icon>{{ design.comments_count }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-col>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    design: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getDesignModal']),
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goTo(to, folderName, slug) {
      this.hideModal()
      setTimeout(
        () =>
          this.showModal({
            componentName: to,
            folder: folderName,
            slugDesign: slug,
          }),
        3000
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 8.1%,
    rgba(0, 0, 0, 0.001) 15.5%,
    rgba(0, 0, 0, 0.003) 22.5%,
    rgba(0, 0, 0, 0.005) 29%,
    rgba(0, 0, 0, 0.008) 35.3%,
    rgba(0, 0, 0, 0.011) 41.2%,
    rgba(0, 0, 0, 0.014) 47.1%,
    rgba(0, 0, 0, 0.016) 52.9%,
    rgba(0, 0, 0, 0.019) 58.8%,
    rgba(0, 0, 0, 0.022) 64.7%,
    rgba(0, 0, 0, 0.025) 71%,
    rgba(0, 0, 0, 0.027) 77.5%,
    rgba(0, 0, 0, 0.029) 84.5%,
    rgba(0, 0, 0, 0.03) 91.9%,
    rgba(0, 0, 0, 0.03) 100%
  );
}

.theme--dark.v-card {
  background-color: rgba(23, 22, 18, 0.85);
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 25.1%,
    rgba(0, 0, 0, 0.001) 15.5%,
    rgba(0, 0, 0, 0.003) 22.5%,
    rgba(0, 0, 0, 0.005) 29%,
    rgba(0, 0, 0, 0.008) 35.3%,
    rgba(0, 0, 0, 0.011) 41.2%,
    rgba(0, 0, 0, 0.014) 47.1%,
    rgba(0, 0, 0, 0.016) 52.9%,
    rgba(0, 0, 0, 0.019) 58.8%,
    rgba(0, 0, 0, 0.022) 64.7%,
    rgba(0, 0, 0, 0.025) 71%,
    rgba(0, 0, 0, 0.027) 77.5%,
    rgba(0, 0, 0, 0.029) 84.5%,
    rgba(0, 0, 0, 0.03) 91.9%,
    rgba(0, 0, 0, 0.03) 100%
  );
}

.theme--dark.v-list-item .v-list-item__subtitle,
.theme--dark.v-list-item .v-list-item__action-text {
  color: rgba(23, 22, 18, 0.85);
}
.theme--dark.v-list-item.design-info {
  color: rgba(23, 22, 18, 0.85) !important;
  font-size: 0.8em !important;
}
.design-info {
  color: rgba(23, 22, 18, 0.85);
}
.theme--dark.v-btn.v-btn--icon {
  color: rgba(23, 22, 18, 0.65);
}
</style>
