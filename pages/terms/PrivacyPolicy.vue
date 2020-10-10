<template>
  <div>
    <RGPD />
    <base-modal
      :dialog.sync="visible"
      @showDesign="styleModal()"
      @closeDialog="hideModal()"
    />
  </div>
</template>

<script>
import RGPD from '@/components/RGPD.vue'
export default {
  layout: 'designs-listing',
  components: {
    RGPD,
  },
}
</script>

<style lang="scss" scoped></style>
