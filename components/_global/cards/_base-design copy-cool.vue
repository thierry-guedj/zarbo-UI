<template>
  <v-col class="item" cols="12" md="auto">
    <v-hover v-slot:default="{ hover }">
      <v-card
        class="mr-4 my-2 mx-auto card-design portfolio-item portfolio-effect__item portfolio-item--eff1"
        width="420"
        raised
        hover
        @click="goTo('Show', '', `${design.id}`, 'fullscreen')"
      >
        <v-img
          :src="`${design.images.thumbnail}`"
          style="max-width: 100%; max-height: 100vh; height: auto;"
        >
          <v-expand-transition>
            <div
              v-if="hover"
              class="d-flex transition-fast-in-fast-out blue-grey darken-2 v-card--reveal display-3 white--text"
              style="height: 100%;"
            >
              <v-card-text class="align-self-center text-center">
                <div>
                  <v-btn
                    v-for="(icon, index) in icons"
                    :key="index"
                    :class="{ 'show-btns': hover }"
                    color="transparent"
                    icon
                  >
                    <v-icon :class="{ 'show-btns': hover }" color="transparent">
                      {{ icon }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-img>

        <v-list-item>
          <v-list-item-content class="design-info pb-0 pt-1">
            <v-list-item-title class="headline design-info">{{
              design.title
            }}</v-list-item-title>

            <v-list-item-subtitle class="design-info pb-0 pt-0">
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
          </v-list-item-content>
        </v-list-item>
        <v-card-actions>
          <v-spacer></v-spacer>
          <span class="mr-2 caption text-orange lighten-5"
            >Uploaded {{ design.created_at_dates.created_at_human }}</span
          >
          <span class="mr-2"
            ><v-icon class="like mr-1 text-orange lighten-1">mdi-heart</v-icon
            >{{ design.likes_count }}</span
          >

          <span class="mr-2"
            ><v-icon class="mr-1">mdi-comment</v-icon
            >{{ design.comments_count }}</span
          >
        </v-card-actions>
      </v-card>
    </v-hover>
  </v-col>
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
  data() {
    return {
      icons: ['mdi-rewind', 'mdi-play', 'mdi-fast-forward'],
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getStyle']),
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goTo(to, folderName, id, modalStyle) {
      // this.$emit('showDesign')
      this.hideModal()

      this.showModal({
        componentName: to,
        folder: folderName,
        idDesign: id,
        style: modalStyle,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.6;
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

  border: 1px solid #000000;
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
  font-family: 'Ek Mukta', sans-serif;
  font-size: 12px;
  transition-property: opacity;
  transition-duration: 0.35s;
  line-height: 1.6em;
  text-rendering: optimizelegibility;
  color: #fff3e0;
}
.theme--dark.v-list-item__content {
}
.theme--dark.v-list-item .v-list-item__subtitle,
.theme--dark.v-list-item .v-list-item__action-text {
  color: #fff3e0;
}
.theme--dark.v-list-item.design-info {
  color: #fff3e0 !important;
  font-size: 0.8em !important;
  padding-top: 0;
  padding-bottom: 0;
}
.design-info {
  color: #fff3e0;
}
.theme--dark.v-btn.v-btn--icon {
  color: #fff3e0;
}
.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
.v-application .headline {
  font-size: 1.2 rem;
}
</style>
