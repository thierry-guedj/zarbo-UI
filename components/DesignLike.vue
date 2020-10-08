<template>
  <section>
    <li class="d-table w-100">
      <div class="stats-txt d-table-cell w-50">
        <div v-if="$auth.loggedIn && design.user.id !== $auth.user.id">
          <a v-if="$auth.loggedIn" href="#" @click.prevent="likeDesign()">
            <template v-if="userLikes">
              <!--        <span class="material-icons" style="color:red">
thumb_down
</span> -->
              <v-btn class="mx-2" icon dark small color="red darken-4">
                <v-icon dark class="heart">not_interested</v-icon> {{ likes }}
                <div v-if="likes > 1"> Likes</div><div v-else> Like</div>
              </v-btn>
            </template>
            <template v-else>
              <!--       <span class="material-icons" style="color:blue">
thumb_up
</span> -->
              <v-btn class="mx-2" icon color="pink" dark small>
                <v-icon dark class="heart">favorite</v-icon> {{ likes }}
                <div v-if="likes > 1"> Likes</div><div v-else> Like</div>
              </v-btn>
            </template>
          </a>
        </div>
        <div v-else>
          <a class="text-white"
            >{{ likes }} <div v-if="likes > 1"> Likes</div
            ><div v-else> Like</div></a
          >
        </div>
      </div>
    </li>
    <template v-if="userLikes && $auth.loggedIn">
      <div class="mt-2">
        {{ $t('show.youLike') }}
      </div>
    </template>
  </section>
</template>

<script>
export default {
  name: 'DesignLike',
  props: {
    design: {
      type: Object,
      default: null,
    },
  },

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
    userLikes() {
      return this.current_user_likes
    },
  },
  mounted() {
    this.checkIfCurrentUserLikes()
    this.totalLikes()
  },

  created() {},
  methods: {
    async likeDesign() {
      const url = `/designs/${this.design.id}/like`
      console.log(url)
      await this.$axios.post(url).then((res) => {
        this.current_user_likes = !this.current_user_likes
        this.total_likes = res.data.total
      })
    },
    async totalLikes() {
      const url = `/designs/${this.design.id}/totalLikes`
      console.log(url)
      await this.$axios.$get(url).then((res) => {
        this.total_likes = res.total
      })
    },
    async checkIfCurrentUserLikes() {
      const url = `/designs/${this.design.id}/liked`
      await this.$axios.$get(url).then((res) => {
        this.current_user_likes = res.liked
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.heart {
  margin-right: 3px;
}
</style>
