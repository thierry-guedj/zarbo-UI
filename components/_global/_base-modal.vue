<template>
  <v-dialog
    :value="visible"
    :width="width"
    @keydown.esc="hideModal"
    @click:outside="hideModal"
  >
    <v-card>
      <v-card-text>
        <component
          :is="modalComponent"
          :modal-closed="modalClosed"
          :success="success"
          :status="status"
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
import VerifyForm from '@/components/auth/VerifyForm.vue'
import CreateForm from '@/components/user/CreateForm.vue'
export default {
  components: {
    LoginForm,
    RegisterForm,
    PasswordResetForm,
    ResendForm,
    ResetEmail,
    VerifyForm,
    CreateForm,
  },
  props: {
    value: {
      type: Boolean,
    },
    success: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      modalClosed: false,
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder']),

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
.v-sheet.v-card {
  background-color: rgba(23, 22, 18, 0.85);
}
</style>
