<template>
  <v-row justify="center">
 <!--    <v-dialog v-model="confirm" max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure ?</v-card-title>

        <v-card-text> </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="confirm = false">
            Cancel
          </v-btn>

          <v-btn color="green darken-1" text @click="confirm = true">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <v-card width="100%" class="card-design">
      <v-card-title>
        {{ $t('settingsDesigns.artwork') }}
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
        :items="indexedItems"
        :search="search"
        sort-by="calories"
        class="elevation-1"
        :items-per-page="5"
        item-key="id"
        :options.sync="options"
      :server-items-length="totalDesigns"
      >
        <template v-slot:item.image="{ item }">
          <div class="px-2 my-2 align-middle">
            <v-img
              :src="item.images.thumbnail"
              :alt="item.title"
              width="120px"
            ></v-img>
          </div>
        </template>
        <template v-slot:item.title="props">
          <v-edit-dialog
            :return-value.sync="props.item.title"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.title }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.title"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <!-- <template v-slot:item.iron="props">
        <v-edit-dialog
          :return-value.sync="props.item.iron"
          large
          persistent
          @save="save"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          <div>{{ props.item.iron }}</div>
          <template v-slot:input>
            <div class="mt-4 title">Update Iron</div>
          </template>
          <template v-slot:input>
            <v-text-field
              v-model="props.item.iron"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template> -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Designs',
  middleware: ['auth'],
  layout: 'designs-listing',
  data() {
    return {
      totalDesigns: 0,
      designs: [],
      loading: true,
        options: {},
      search: '',
      dialog: false,
      headers: [
        {
          text: this.$i18n.t('settingsDesigns.image'),
          value: 'image',
          sortable: false,
          width: '15%',
        },
        {
          text: this.$i18n.t('settingsDesigns.title'),
          align: 'start',
          sortable: false,
          value: 'title',
        },
        /* {
          text: 'Uploaded',
          align: 'start',
          sortable: true,
          value: 'created_at_dates.created_at_human',
        }, */
        {
          text: this.$i18n.t('settingsDesigns.status'),
          value: 'is_live',
          width: '20%',
        },
        { text: 'Actions', value: 'actions', sortable: false },
        /* {
          text: this.$i18n.t('settingsDesigns.edit'),
          value: 'id',
          width: '8%',
        },
        {
          text: this.$i18n.t('settingsDesigns.delete'),
          value: 'description',
          width: '8%',
        }, */
        // { text: 'Actions', value: '' },
      ],

      loadingSubmit: false,
      confirm: false,
     snack: false,
        snackColor: '',
        snackText: '',
        max25chars: v => v.length <= 25 || 'Input too long!',
        pagination: {},
    }
  },
  watch: {
      options: {
        handler () {
          this.getDataFromApi()
            .then(data => {
              this.designs = data.items
              this.totalDesigns = data.total
            })
        },
        deep: true,
      },
    },
  computed: {
    ...mapGetters(['visible', 'modalComponent', 'folder', 'visibleSnackbar']),
    indexedItems() {
      return this.designs.map((design, index) => ({
        id: index,
        ...design,
      }))
    },
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
      this.loadingSubmit = false
    },
    async destroy(id) {
      if (this.confirm === true) {
        this.loading = true
        try {
          const res = await this.$axios.$delete(`/designs/${id}`)
        } catch (err) {
          console.log(err)
        } finally {
          await this.fetchUserDesigns()
          this.showSnackbar()
          this.loading = false
        }
      }
    },
    save() {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel() {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open() {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close() {
      console.log('Dialog closed')
    },
    updateIsLive() {
      // this.designs[id].is_live = !this.designs[id].is_live
      console.log('emit ok')
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

  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12);
}
</style>
