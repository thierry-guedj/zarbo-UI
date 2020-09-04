<template>
  <div>
    <!-- <v-col class="item" cols="12" md="2"> -->
    <!-- <v-hover v-slot:default="{ hover }"> -->
    <v-card
      class="mr-2 ml-2 my-2 mx-auto portfolio-item portfolio-effect__item portfolio-item--eff1"
      width="auto"
      height="auto"
      tile
      elevation="5"
      hover
      @click="goToDetails(`${design.id}`)"
    >
      <v-img
        :src="`${design.images.thumbnail}`"
        :lazy-src="`${design.images.thumbnail}`"
      >
      </v-img>

      <div class="portfolio-item__info">
        <h3 class="portfolio-item__header">
          {{ designTitle | truncate(17, '...') }}
        </h3>
        <nuxt-link :to="localePath(`/designs/${design.user.id}/user/fr/`)">
          <h4 class="portfolio-item__subheader">
            <span> {{ $t('designCard.by') }} {{ design.user.name }}</span>
          </h4>
        </nuxt-link>
        <div class="portfolio-item__links">
          <div class="portfolio-item__link-block">
            <v-tooltip top content-class="tooltip">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  dark
                  small
                  class="portfolio-item__link image"
                  v-bind="attrs"
                  v-on="on"
                  @click.stop="$emit('lightbox')"
                >
                  <v-icon dark>link</v-icon>
                </v-btn>
                <!--  <a
              class="portfolio-item__link image"
              :title="designTitle"
              @click.stop="$emit('lightbox')"
            >
              <i class="material-icons">link</i>
            </a> -->
              </template>
              <span>{{ $t('designCard.tooltipLightbox') }}</span>
            </v-tooltip>
          </div>

          <div class="portfolio-item__link-block">
            <v-tooltip top content-class="tooltip">
              <template v-slot:activator="{ on, attrs }">
                <nuxt-link
                  :to="
                    localePath({
                      name: 'design.details',
                      params: { id: design.id },
                    })
                  "
                >
                  <v-btn
                    fab
                    dark
                    small
                    class="portfolio-item__link image"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon dark>zoom_out_map</v-icon>
                  </v-btn>
                </nuxt-link>
              </template>
              <span>{{ $t('designCard.tooltipFullscreen') }}</span>
            </v-tooltip>
          </div>
        </div>
        <v-card-actions class="mt-4 ml-3">
          <v-spacer></v-spacer>

          <span class="mr-2"
            ><v-icon class="like mr-1 text-orange lighten-1">mdi-heart</v-icon
            >{{ design.likes_count }}</span
          >

          <span class="mr-2"
            ><v-icon class="mr-1">mdi-comment</v-icon
            >{{ design.comments_count }}</span
          >
        </v-card-actions>
      </div>
    </v-card>
    <!-- </v-hover> -->
    <div class="ml-3 mb-2">
      <h3 class="font-weight-medium mb-0 ellipsis">
        {{ designTitle | capitalize }}
      </h3>
      <h5 class="font-weight-regular">
        {{ $t('designCard.by') }}
        <nuxt-link :to="`/designs/${design.user.id}/user`" class="text-white">
          {{ design.user.name }}</nuxt-link
        >
      </h5>
      <h5>
        <span class="mr-2 text-orange lighten-5"
          >{{ $t('designCard.uploaded') }} {{ computedDate }}</span
        >
      </h5>
    </div>
    <!-- </v-col> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'DesignCard',
  props: {
    design: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      index: null,
    }
  },

  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getStyle']),
    designTitle() {
      if (!this.design.title) return 'Sans Titre'
      else return this.design.title
    },
    computedDate() {
      const date = this.design.created_at_dates.created_at
      return moment(date).format('LL')
    },
  },
  methods: {
    ...mapActions(['showModal', 'hideModal']),
    goToDetails(id) {
      this.$router.push(
        this.localePath({ name: 'design.details', params: { id } })
      )
    },
  },
}
</script>

<style lang="scss" scoped>
/* .ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */
.v-application a {
  text-decoration: none;
}
/* If the screen size is 601px wide or more, set the font-size of <div> to 80px */
@media screen and (min-width: 601px) {
  .portfolio-item__header {
    font-size: 0.8rem;
  }
}

/* If the screen size is 600px wide or less, set the font-size of <div> to 30px */
@media screen and (max-width: 600px) {
  .portfolio-item__header {
    font-size: 0.5rem;
  }
}
.tooltip {
  background-color: #0f1219;
  color: whitesmoke;
}
.v-application a {
  color: whitesmoke;
}
img {
  max-width: 100%;
  height: auto;
  width: auto\9; /* ie8 */
}
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

  border: 1px none #f8b4b4;
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

  font-size: 12px;
  transition-property: opacity;
  transition-duration: 0.35s;
  line-height: 1.6em;
  text-rendering: optimizelegibility;
  color: #fff3e0;
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
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
}

//VARIABLES
$accent-theme-color: #7a306c;
$accent-theme-color2: #8d909b;
$dark-theme-color: #101010;
$light-theme-color: #fff;

$portfolio-item-width: auto;
$portfolio-item-height: auto;

$portfolio-item-info-offset: 7px;

$portfolio-link-dimensions: 35px;
$portfolio-link-offset: 10px;

//MIXINS

//transitions mixin
@mixin transition-mix(
  $property: all,
  $duration: 0.2s,
  $timing: linear,
  $delay: 0s
) {
  transition-property: $property;
  transition-duration: $duration;
  transition-timing-function: $timing;
  transition-delay: $delay;
}

//position absolute mixin
@mixin position-absolute($top: null, $left: null, $right: null, $bottom: null) {
  position: absolute;
  top: $top;
  left: $left;
  right: $right;
  bottom: $bottom;
}

//mixin for image positioning
@mixin img-position($max-width: 200%, $max-height: 200%) {
  position: relative;
  overflow: hidden;

  img {
    @include position-absolute($top: 50%, $left: 50%);

    width: auto;
    height: auto;
    min-width: 100%;
    min-height: 100%;
    max-width: $max-width;
    max-height: $max-height;
    transform: translate(-50%, -50%);
  }
}

/* effects styles !!!YOU NEED THEM */

/* don't forget to add your own colors and parameters */

.portfolio-effect {
  display: flex;
  justify-content: space-between;
}

.portfolio-item {
  @include img-position();

  width: $portfolio-item-width;
  height: $portfolio-item-height;
}

.portfolio-item__info {
  @include position-absolute(
    $top: $portfolio-item-info-offset,
    $left: $portfolio-item-info-offset
  );

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 2 * #{$portfolio-item-info-offset});
  height: calc(100% - 2 * #{$portfolio-item-info-offset});

  // background-color: rgba(15, 150, 150, 0.7);
  // background-color: rgba(65, 102, 114, 0.9);
  background-color: rgba(36, 61, 61, 0.8);
  // background-color: rgba(46, 42, 35, 0.8);
  // border-radius: 1%;
}

.portfolio-item__header {
  position: relative;

  margin: 0 0 10px 0;
  padding: 2px 0;

  font: {
    size: 16px;
  }
  text-transform: uppercase;
  letter-spacing: 2px;

  &:after {
    @include position-absolute($bottom: 0, $left: 0);

    display: block;
    height: 2px;
    width: 100%;

    content: '';

    background-color: $accent-theme-color2;
  }
}

.portfolio-item__subheader {
  position: relative;

  margin: 0 0 2px 0;
  padding: 5px 0 5px;
  display: block;

  font: {
    size: 14px;
  }
  text-transform: capitalize;
  letter-spacing: 2px;

  &:after {
    @include position-absolute($bottom: 0, $left: 0);

    display: block;
    height: 2px;
    width: 100%;

    content: '';

    background-color: $accent-theme-color2;
  }
}
.portfolio-item__links {
  display: flex;
}
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: transparent;
}
.portfolio-item__link-block {
  position: relative;

  width: $portfolio-link-dimensions;
  height: $portfolio-link-dimensions;
  margin-right: $portfolio-link-offset;
  margin-top: 5px;

  &:last-child {
    margin-right: 0;
  }
}

.portfolio-item__link {
  @include transition-mix;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: transparent;

  color: $light-theme-color;
  text-decoration: none;

  border: 1px solid $light-theme-color;
  border-radius: 50%;

  &:hover {
    color: $light-theme-color;

    background-color: $dark-theme-color;
  }
}

/* EFFECT #1 STYLES */
.portfolio-item--eff1 {
  .portfolio-item__info {
    transform: scale(1.1);
    opacity: 0;
  }

  .portfolio-item__header {
    top: -10px;
    opacity: 0;

    &:after {
      transform: scaleX(0);
    }
  }

  .portfolio-item__link-block {
    top: 45px;

    opacity: 0;
  }
}

.portfolio-item--eff1:hover {
  .portfolio-item__info {
    @include transition-mix($duration: 0.4s);

    transform: scale(1);
    opacity: 1;
  }

  .portfolio-item__header {
    @include transition-mix($delay: 0.45s);

    top: 0;
    opacity: 1;

    &:after {
      @include transition-mix(
        $duration: 0.3s,
        $timing: cubic-bezier(0.63, 0.01, 0, 1.39),
        $delay: 0.65s
      );

      transform: scaleX(1);
    }
  }

  .portfolio-item__link-block {
    top: 0;
    opacity: 1;

    &:first-child {
      @include transition-mix($delay: 0.85s);
    }

    &:nth-child(2) {
      @include transition-mix($delay: 0.95s);
    }
  }
}

/* EFFECT #2 STYLES */
.portfolio-item--eff2 {
  .portfolio-item__info {
    top: -100%;
  }

  .portfolio-item__header {
    left: -25px;
    opacity: 0;

    &:after {
      transform: scaleX(0);
      transform-origin: right center;
    }
  }

  .portfolio-item__link-block {
    transform: scale(1.2);

    opacity: 0;
  }
}

.portfolio-item--eff2:hover {
  .portfolio-item__info {
    @include transition-mix(
      $duration: 0.35s,
      $timing: cubic-bezier(0.63, 0.01, 0, 1.39)
    );

    top: $portfolio-item-info-offset;
  }

  .portfolio-item__header {
    @include transition-mix($delay: 0.45s);

    left: 0;
    opacity: 1;

    &:after {
      @include transition-mix($delay: 0.6s);

      transform: scaleX(1);
    }
  }

  .portfolio-item__link-block {
    transform: scale(1);

    opacity: 1;

    &:first-child {
      @include transition-mix($delay: 0.85s);
    }

    &:nth-child(2) {
      @include transition-mix($delay: 0.95s);
    }
  }
}

/* EFFECT #3 STYLES */
.portfolio-item--eff3 {
  .portfolio-item__info {
    @include transition-mix($duration: 0.3s, $property: transform);

    transform: scale(0, 1);
    transform-origin: right top;
  }

  .portfolio-item__header {
    transform: scale(0.4);
    opacity: 0;

    &:after {
      bottom: -20px;
      opacity: 0;
    }
  }

  .portfolio-item__link-block {
    opacity: 0;

    &:first-child {
      transform: translateX(-50%);
    }

    &:nth-child(2) {
      transform: translateX(50%);
    }
  }
}

.portfolio-item--eff3:hover {
  .portfolio-item__info {
    @include transition-mix($duration: 0.3s, $property: transform);

    transform: scale(1, 1);
    transform-origin: left top;
  }

  .portfolio-item__header {
    @include transition-mix($delay: 0.45s);

    transform: scale(1);
    opacity: 1;

    &:after {
      @include transition-mix($delay: 0.6s);

      bottom: 0;
      opacity: 1;
    }
  }

  .portfolio-item__link-block {
    @include transition-mix($delay: 0.85s);

    transform: translateX(0);
    opacity: 1;
  }
}

/* EFFECT #4 STYLES */
.portfolio-item--eff4 {
  .portfolio-item__info {
    transform: scale(0.4);
    opacity: 0;
  }

  .portfolio-item__header {
    transform: scale(1.3);
    opacity: 0;

    &:after {
      transform: scaleX(1.3);
      opacity: 0;
    }
  }

  .portfolio-item__link-block {
    transform: scale(0);
    opacity: 0;
  }
}

.portfolio-item--eff4:hover {
  .portfolio-item__info {
    @include transition-mix($duration: 0.3s);

    transform: scale(1);
    opacity: 1;
  }

  .portfolio-item__header {
    @include transition-mix($delay: 0.45s);

    transform: scale(1);
    opacity: 1;

    &:after {
      @include transition-mix($delay: 0.65s);

      transform: scaleX(1);
      opacity: 1;
    }
  }

  .portfolio-item__link-block {
    transform: scale(1);

    opacity: 1;

    &:first-child {
      @include transition-mix($delay: 0.85s);
    }

    &:nth-child(2) {
      @include transition-mix($delay: 0.95s);
    }
  }
}

/* EFFECT #5 STYLES */
.portfolio-item--eff5 {
  .portfolio-item__info {
    transform: scale(0.4);
    transform-origin: right top;
    opacity: 0;
  }

  .portfolio-item__header {
    opacity: 0;

    &:after {
      height: 100%;
      opacity: 0;
    }
  }

  .portfolio-item__link-block {
    opacity: 0;

    &:first-child {
      transform: translateX(30%);
    }

    &:nth-child(2) {
      transform: translateX(-30%);
    }
  }
}

.portfolio-item--eff5:hover {
  .portfolio-item__info {
    @include transition-mix($duration: 0.3s);

    transform: scale(1);
    opacity: 1;
  }

  .portfolio-item__header {
    @include transition-mix($delay: 0.45s);

    opacity: 1;

    &:after {
      @include transition-mix($delay: 0.65s);

      height: 2px;
      opacity: 1;
    }
  }

  .portfolio-item__link-block {
    @include transition-mix($delay: 0.85s);

    transform: translate(0);
    opacity: 1;
  }
}
</style>
