<template>
  <section>
    <div class="setting-title font-16 fw-500">Designs</div>

    <v-data-table
      :headers="headers"
      :items="designs"
      :items-per-page="5"
      class="elevation-1"
    ></v-data-table>

    <!-- <div class="setting-block">
      <div class="setting-title font-16 fw-500">Designs</div>

      <div class="setting-body white-bg-color">
        <table class="table table-striped">
          <thead>
            <tr>
              <td></td>
              <td>Title</td>
              <td>Status</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="design in designs" :key="design.id">
              <td>
                <div v-if="design.images">
                  <img :src="design.images.thumbnail" width="100" />
                </div>
              </td>
              <td>{{ design.title }}</td>
              <td>{{ design.is_live ? 'Published' : 'Draft' }}</td>
              <td>
                <nuxt-link
                  :to="{ name: 'designs.edit', params: { id: design.id } }"
                >
                  Edit
                </nuxt-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
  </section>
</template>

<script>
export default {
  middleware: ['auth'],
  /* async asyncData({ app }) {
    const { response } = await app.$axios.get(`/users/${app.$auth.id}/designs`)
    console.log(response) // Just to check what response looks like
    return { designs: response }
  }, */
  data() {
    return {
      designs: [],
      headers: [
        { text: 'Image', value: '' },
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'Status', value: 'is_visible' },
        { text: 'Actions', value: '' },
      ],
    }
  },
  computed: {
    /* customerArray() {
      return Object.values(this.designs).map(({ contact, geo, name }) => ({
        contact,
        geo,
      }))
    }, */
    listOfDesigns() {
      return Object.keys(this.designs).map((key) => {
        return this.designs[key]
      })
    },
  },
  created() {
    this.fetchUserDesigns()
    console.log(this.designs)
  },
  methods: {
    async fetchUserDesigns() {
      const { data } = await this.$axios.get(`/users/${this.$auth.id}/designs`)
      this.designs = data
      console.log(data)

      /* this.listOfDesigns = Object.keys(this.designs).map((key) => {
        return designsVue[key]
      }) */
    },
  },
}
</script>

<style lang="scss" scoped></style>
