<template>
  <v-dialog
    :value="visible"
    :width="width"
    :fullscreen="getStyle"
    persistent
    scrollable
    eager
    transition="dialog-bottom-transition"
    @keydown.esc="hideModal"
  >
    <v-card style="max-height: 100%; max-width: 320vh; width: auto">
      <v-card-actions class="float-md-right justify-end"
        ><v-btn
          v-bind="size"
          class="mx-2"
          fab
          dark
          small
          color="transparent"
          @click="hideModal()"
        >
          <v-icon v-bind="size" dark>close</v-icon>
        </v-btn></v-card-actions
      >
      <v-card-text>
        <component
          :is="modalComponent"
          :key="unique"
          :modal-closed="modalClosed"
          :success="success"
          :status="status"
          @destroyItem="deleteItem"
        ></component>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import PasswordResetForm from '@/components/auth/PasswordResetForm.vue'
import ResendForm from '@/components/auth/ResendForm.vue'
import ResetEmail from '@/components/auth/ResetEmail.vue'
import ConfirmDelete from '@/components/designs/ConfirmDelete.vue'
import VerifyForm from '@/components/auth/VerifyForm.vue'
import ContactForm from '@/components/user/ContactForm.vue'

export default {
  name: 'BaseModal',
  components: {
    LoginForm,
    RegisterForm,
    PasswordResetForm,
    ResendForm,
    ResetEmail,
    ConfirmDelete,
    VerifyForm,
    ContactForm,
  },
  props: {
    value: {
      type: Boolean,
    },

    width: {
      type: String,
      default: '500',
    },
    fullscreen: {
      type: Boolean,
      default: false,
      required: false,
    },
    transition: {
      type: String,
      default: 'dialog-bottom-transition',
    },
    success: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      modalClosed: false,
      unique: null,
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'getStyle']),
    size() {
      const size = {
        xs: 'small',
        sm: 'small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
    },

    /* componentInstance() {
      if (!this.modalComponent) return
      const name = this.modalComponent
      const folderName = this.folder
      return () => import(`@/components/${folderName}/${name}`)
    }, */
  },
  watch: {
    visible(val) {
      !val && this.closeDialog()
      val && this.openDialog()
    },
    unique() {
      return this.getIdDesign
    },
  },

  methods: {
    ...mapActions(['hideModal']),
    // Methods to catch the modal open/close event
    closeDialog() {
      this.modalClosed = true
      // this.hideModal()
    },
    openDialog() {
      this.modalClosed = false
    },
    deleteItem() {
      this.$emit('destroyItem')
    },
    //
  },
  mounted() {
    console.log(
      `%c C'est une modale /nMMMMMMMMMMMMMMMMMMMWNNXKKKXXXNWMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMN0xo:;'........',:lx0NMMMMMMMMMMMMMM
MMMMMMMMMMMMXd,...;clodxxxxdolc;'..,dXMMMMMMMMMMMM
MMMMMMMMMMMXc .cOXWMMMMMMMMMMMMWNOl. :KMMMMMMMMMMM
MMMMMMMMMMM0' :NMMMMMMMMMMMMMMMMMMNl .kMMMMMMMMMMM
MMMMMMMMMMM0' cNMMMMMMMMMMMMMMMMMMWl .kMMMMMMMMMMM
MMMMMMMMMMMO' cNMMMMMMMMMMMMMMMMMMWl .kMMMMMMMMMMM
MMMMMMMWXKOo. cNMMMMMMMMMMMMMMMMMMWl .lOKXWMMMMMMM
MMMXOoc,....  :XMMMMMMMMMMMMMMMMMWXc  ....,:oOXWMM
MNx,..,coxOk:..':coddxxkkkkxxxdoc:'..;kOxoc,..'dNM
MK; .l0NMMMMN0dl:,'............',;cdONMMMMNKo. '0M
MWO:...,:ldxk0KKXXKKK00000000KKKXXXK0Oxdl:,...;kWM
MMMWKkoc;'.   ....'',,,,,,,,,,'''....  .';cokKWMMM
MMMMMMMMWO,  ;dxdoolllccccccllloodxd;. 'kWMMMMMMMM
MMMMMMMMWO' .lXMMMMMMMMMMMMMMMMMMMMXo. .kWMMMMMMMM
MMMMMMMMMNd. .xWMMMMMMMMMMMMMMMMMMMk. .oNMMMMMMMMM
MMMMMMMMMk. .oNMMMMMMMMMMMMMMMMMMMMNd. .xWMMMMMMMM
MMMMMMMMMXl. 'kWMMMMMMMMMMMMMMMMMMWO, .cKMMMMMMMMM
MMMMMMMMMKc. ;OWMMMMMMMMMMMMMMMMMMM0:. ;0WMMMMMMMM
MMMMMMMMMO' .lXMMMMMMMMMMMMMMMMMMMMXo. .kWMMMMMMMM
MMMMMMMMMNd. .xWMMMMMMMMMMMMMMMMMMWk. .oNMMMMMMMMM
MMMMMMMMWk. .oNMMMMMMMMMMMMMMMMMMMMNd. .xWMMMMMMMM
MMMMMMMMMXo. 'kWMMMMMMMMMMMMMMMMMMWO, .lKMMMMMMMMM
MMMMMMMMMMWKdo0WMMMMMMMMMMMMMMMMMMMKodKWMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM`,
      'font-family:monospace'
    )
  },
}
</script>

<style lang="scss" scoped>
.theme--dark.v-sheet.v-card {
  background-color: #0f1219;
}
</style>
