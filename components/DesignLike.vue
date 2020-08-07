<template>
  <li class="d-table w-100">
    <div class="stats-txt d-table-cell w-50">
      <a v-if="$auth.loggedIn" href="#" @click.prevent="likeDesign()">
        <template v-if="current_user_likes">
          <!--        <span class="material-icons" style="color:red">
thumb_down
</span> -->
          <v-btn class="mx-2" dark small color="red darken-4">
            <v-icon dark>thumb_down</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <!--       <span class="material-icons" style="color:blue">
thumb_up
</span> -->
          <v-btn class="mx-2" dark small color="teal darken-1">
            <v-icon dark>thumb_up</v-icon>
          </v-btn>
        </template>
      </a>
    </div>
    <div class="stats-num d-table-cell w-50 text-right ml-3 align-baseline">
      <a class="text-white">{{ likes }} Likes</a>
    </div>
  </li>
</template>

<script>
export default {
  props: ['design'],

  data() {
    return {
      current_user_likes: false,
      total_likes: 0,
    }
  },
  computed: {
    likes() {
      return this.total_likes
    },
  },

  created() {},
  methods: {
    likeDesign() {
      const url = `/designs/${this.design.id}/like`
      console.log(url)
      this.$axios.post(url).then((res) => {
        this.current_user_likes = !this.current_user_likes
        this.total_likes = res.data.total
      })
    },
    checkIfCurrentUserLikes() {
      const url = `/designs/${this.design.id}/liked`
      this.$axios.$get(url).then((res) => (this.current_user_likes = res.liked))
    },
  },
}
</script>

<style></style>
