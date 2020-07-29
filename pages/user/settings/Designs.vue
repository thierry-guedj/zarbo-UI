<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="70%"
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
      color="transparent"
      content-class="modal"
      fullscreen
    >
      <v-card>
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
            <div class="px-2 my-2">
              <v-img
                :src="item.images.thumbnail"
                :alt="item.title"
                width="80px"
              ></v-img>
            </div>
          </template>

          <template v-slot:item.is_live="{ item }">
            <td>
              <v-chip :color="getColor(item.is_live)" dark>{{
                item.is_live ? 'Published' : 'Draft'
              }}</v-chip>
            </td>
            <td class="float-right">
              <nuxt-link :to="{ name: 'designs.edit', params: { id: item.id } }"
                ><v-btn class="mx-2" fab dark small color="transparent">
                  <v-icon dark>edit</v-icon></v-btn
                >
              </nuxt-link>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  middleware: ['auth'],
  layout: 'page',
  data() {
    return {
      designs: [],
      loading: true,
      search: '',
      dialog: true,
      headers: [
        { text: 'Image', value: 'image', sortable: false },
        {
          text: 'Title',
          align: 'start',
          sortable: true,
          value: 'title',
        },
        {
          text: 'Uploaded',
          align: 'start',
          sortable: true,
          value: 'created_at_dates.created_at_human',
        },
        { text: 'Status', value: 'is_live' },
        // { text: 'Actions', value: '' },
      ],
    }
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
  },
}
</script>

<style lang="scss" scoped>
.v-chip.v-size--default {
  height: 25px;
}
.v-data-table {
  line-height: 0.5;
}
.v-sheet.v-card {
  background-color: rgba(23, 22, 18, 0.85);
}
.v-data-table__wrapper {
  background-color: rgba(23, 22, 18, 0.85);
}
.theme--dark.v-data-table {
  background-color: rgba(23, 22, 18, 0.65);
}
.modal {
  max-height: 60%;
}
.v-dialog:not(.v-dialog--fullscreen) {
  height: 70%;
}
</style>
