<template>
  <v-row justify="center">
    <!-- <v-dialog
      v-model="dialog"
      max-width="70%"
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
      color="transparent"
      content-class="modal"
      fullscreen
    > -->
    <v-card width="100%" class="card-design">
      <v-card-title>
        Designs
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="designs"
        :items-per-page="5"
        class="elevation-1"
        :search="search"
      >
        <!-- <template v-slot:item.image="{ item }">
            <div class="p-2">
              <v-img :src="item.images.thumbnail" :alt="item.title" width="100px"></v-img>
            </div>
          
    </template> -->
        <template v-slot:item.image="{ item }">
          <div class="px-2 my-2 align-middle">
            <v-img
              :src="item.images.thumbnail"
              :alt="item.title"
              width="120px"
            ></v-img>
          </div>
        </template>

        <template v-slot:item.is_live="{ item }" style="width: 120px;">
          <td>
            <v-chip :color="getColor(item.is_live)" dark>{{
              item.is_live ? 'Published' : 'Draft'
            }}</v-chip>
          </td>
          <td class="pl-8">
            <nuxt-link :to="{ name: 'designs.edit', params: { id: item.id } }"
              ><v-btn
                class="mx-2 align-middle"
                fab
                dark
                small
                color="transparent"
              >
                <v-icon dark>edit</v-icon></v-btn
              >
            </nuxt-link>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <!--    </v-dialog> -->
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  middleware: ['auth'],
  layout: 'page2',
  data() {
    return {
      designs: [],
      loading: true,
      search: '',
      dialog: true,
      headers: [
        { text: 'Image', value: 'image', sortable: false, width: '120px' },
        {
          text: 'Title',
          align: 'start',
          sortable: true,
          value: 'title',
        },
        /* {
          text: 'Uploaded',
          align: 'start',
          sortable: true,
          value: 'created_at_dates.created_at_human',
        }, */
        { text: 'Status', value: 'is_live', width: '15%' },
        // { text: 'Actions', value: '' },
      ],
    }
  },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'visibleSnackbar']),
  },
  created() {
    this.fetchUserDesigns()
    console.log(this.designs)
  },
  methods: {
    async fetchUserDesigns() {
      const { data } = await this.$axios.$get(
        `/users/${this.$auth.user.id}/designs`
      )
      this.designs = data
      this.loading = false
    },
    getColor(is_live) {
      if (is_live) return 'green'
      else return 'orange'
    },
    ...mapActions(['showModal', 'hideModal', 'showSnackbar', 'hideSnackbar']),
    goTo(to, folderName) {
      this.hideModal()
      setTimeout(
        () => this.showModal({ componentName: to, folder: folderName }),
        300
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.v-chip.v-size--default {
  height: 25px;
}
.v-data-table {
  line-height: 0.5;
  padding: 6px;
}
.card-designs {
  background-color: rgba(23, 22, 18, 0.85);
  padding: 12px;
  border-radius: 12px;
}
.v-data-table__wrapper {
  background-color: rgba(23, 22, 18, 0.5);
}
.theme--dark.v-data-table {
  background-color: #0f1219;
}
.modal {
  max-height: 60%;
}
.v-dialog:not(.v-dialog--fullscreen) {
  height: 70%;
}
.container {
  max-width: 100%;
}
.theme--dark.v-sheet {
  background-color: #0f1219;
}
.v-sheet.v-list:not(.v-sheet--outlined) {
  background-color: #0f1219;

	box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);

}
</style>
