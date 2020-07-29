<template>
  <li class="d-table w-100">
    <div class="stats-txt d-table-cell w-50">
      <a v-if="$auth.loggedIn" href="#" @click.prevent="likeDesign()">
        <template v-if="current_user_likes">
          <span>
            <i class="fas fa-thumbs-down fa-2x text-danger"></i>
          </span>
          Unlike
        </template>
        <template v-else>
          <span>
            <i class="fas fa-thumbs-up fa-2x text-success"></i>
          </span>
          Like
        </template>
      </a>
    </div>
    <div class="stats-num d-table-cell w-50 text-right">
      <a href="#">{{ total_likes }} Likes</a>
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

  created() {},

  methods: {
    likeDesign() {
      this.$axios.post(`/designs/${this.design.id}/like`).then((res) => {
        this.current_user_likes = !this.current_user_likes
        this.total_likes = res.data.total
      })
    },
    checkIfCurrentUserLikes() {
      this.$axios
        .$get(`/designs/${this.design.id}/liked`)
        .then((res) => (this.current_user_likes = response.liked))
    },
  },
}
</script>

<style></style>
