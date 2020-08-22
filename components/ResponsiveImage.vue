<template>
  <img
    :class="{ lazyload: loading === 'lazy' && !supportsLoadingAttribute }"
    :loading="loading"
    v-bind="{ ...sources }"
  />
</template>

<script>
// base64-encoded transparent GIF
const placeholder =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export default {
  name: 'ResponsiveImage',
  props: {
    // the props required to compute `srcset` should go here

    loading: {
      type: String,

      default: 'lazy',
    },
  },

  data() {
    return {
      supportsLoadingAttribute: false,
    }
  },

  computed: {
    src() {
      // `return` a fallback image for browsers
      // that don't support `srcset` and `sizes`
    },

    srcset() {
      // responsive images can be handled in all sorts of
      // ways and I won't go into any further detail here
    },

    sources() {
      if (this.loading === 'lazy' && !this.supportsLoadingAttribute) {
        return {
          'data-src': this.src,
          'data-srcset': this.srcset,

          src: placeholder,
          srcset: `${placeholder} 1w`,
        }
      }

      return {
        srcset: this.srcset,
      }
    },
  },

  mounted() {
    this.supportsLoadingAttribute = 'loading' in HTMLImageElement.prototype
  },
}
</script>
