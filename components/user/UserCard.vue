<template>
  <!-- <v-hover v-slot:default="{ hover }"> -->
  <v-card
    :color="user.color"
    dark
    hover
    style="max-height: 100%; max-width: 100vh;"
    class="mr-2 ml-2 my-2 mx-auto portfolio-item portfolio-effect__item portfolio-item--eff1"
    @click="goToUser(`${user.id}`)"
  >
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title v-text="user.name"></v-card-title>

        <v-card-subtitle v-text="user.username"></v-card-subtitle>
        <v-card-text v-text="user.tagline"></v-card-text>
      </div>

      <!--  <v-avatar class="ma-3" size="100">
          <v-img
            :src="`${user.photo_url}`"
            style="max-height: 100%; max-width: 100vh; min-width: 6.6666%;"
          >
          
          </v-img>
        </v-avatar> -->
      <avatar
        :username="user.name"
        :src="user.avatars.medium"
        class="mx-3 mt-3"
        :size="100"
      ></avatar>
      <div class="portfolio-item__info">
        <h4 class="portfolio-item__header">{{ user.username }}</h4>
        <h4 class="portfolio-item__subheader">{{ user.name }}</h4>
        <div class="portfolio-item__links">
          <div class="portfolio-item__link-block">
            <a
              class="portfolio-item__link"
              :title="user.username"
              @click="goToUser('Show', '', `${user.id}`)"
            >
              <i class="material-icons">collections</i>
            </a>
          </div>
        </div>
        <v-card-actions class="mt-4">
          <v-spacer></v-spacer>
          <span class="mr-2 caption text-orange lighten-5"
            >{{ $t('userCard.registered') }}
            {{ user.created_dates.created_at_human }}</span
          >
        </v-card-actions>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Avatar from 'vue-avatar'
export default {
  name: 'UserCard',
  layout: 'designs-listing',
  components: {
    Avatar,
  },
  props: {
    user: {
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
    goToUser(userId) {
      if (this.$route.path !== `/designs/${userId}/user`) {
        this.$router.push(
          this.localePath({ name: 'designs.user', params: { id: userId } })
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.vue-avatar--wrapper {
  min-width: 100px;
}
.v-card__title {
  line-height: 1.5em;
  font-size: 16px;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.6;
  position: absolute;
  width: 100%;
  /* background: linear-gradient(
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
  ); */
}

.theme--dark.v-card {
  //background-color: rgba(23, 22, 18, 0.85);

  border: 1px solid #000000;
  /* background: linear-gradient(
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
  ); */
  // font-family: 'Ek Mukta', sans-serif;
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

$portfolio-item-width: 300px;
$portfolio-item-height: 200px;

$portfolio-item-info-offset: 7px;

$portfolio-link-dimensions: 5px;
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

  margin: 0 0 20px 0;
  padding: 15px 0;

  font: {
    size: 22px;
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

  margin: 0 0 20px 0;
  padding: 0 0 2px 5px;

  font: {
    size: 12px;
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

.portfolio-item__link-block {
  position: relative;

  width: $portfolio-link-dimensions;
  height: $portfolio-link-dimensions;
  margin-right: $portfolio-link-offset;

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
    top: 20px;

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
