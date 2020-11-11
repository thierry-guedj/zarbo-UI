<template>
  <v-tabs class="home-tabs" background-color="#0f1219">
    <v-tab>{{ $t('widgetTitle.lastDesigns') }}</v-tab>
    <v-tab>{{ $t('widgetTitle.lastArtists') }}</v-tab>
    <v-tab-item class="mx-auto home-tabs-item">
      <last-designs></last-designs>
    </v-tab-item>
    <v-tab-item class="home-tabs-item">
      <lazy-component></lazy-component>
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  name: 'HomeTabs',
  components: {
    lazyComponent: () => import('@/components/designs/LastUsers.vue'),
  },
  data() {
    return {
      searching: true,
      loader: null,
      loadingSubmit: false,
      loaderPage: false,
    }
  },
  computed: {
    fontSizeTab() {
      const fontSizeTab = {
        xs: 'font-size:10px;',
        sm: 'font-size:12px;',
        md: 'font-size:14px;',
        lg: 'font-size:14px;',
        xl: 'font-size:14px;',
      }[this.$vuetify.breakpoint.name]
      return fontSizeTab ? { [fontSizeTab]: true } : {}
    },
  },
}
</script>

<style lang="scss" scoped>
.v-slide-group__next,
.v-slide-group__prev {
  min-width: 0 !important;
}
.v-slide-group {
  display: contents !important;
}
.home-tabs {
  background-color: #0f1219 !important;
}
.home-tabs-item {
  background-color: #0f1219 !important;
  padding-top: 0;
}
img {
  max-width: 100%;
  height: auto;
  width: auto\9; /* ie8 */
}
.v-tab.v-tab {
  font-size: 10px;
  color: #006064 !important;
}
.v-tab--active.v-tab:not(:focus)::before {
  color: whitesmoke !important;
}
.v-application .primary--text {
  color: whitesmoke;
}

//VARIABLES
$accent-theme-color: #7a306c;
$accent-theme-color2: #8d909b;
$dark-theme-color: #101010;
$light-theme-color: #fff;

$portfolio-item-width: 300px;
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

  margin: 0 0 20px 0;
  padding: 15px 0;

  font: {
    size: 12px;
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
  padding: 15px 0;

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
