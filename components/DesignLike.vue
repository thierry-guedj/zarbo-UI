<template>
  <section>
    <li class="d-table w-100">
      <div class="stats-txt d-table-cell w-50">
        <div v-if="$auth.loggedIn && design.user.id !== $auth.user.id">
          <a
            v-if="$auth.loggedIn"
            href="#"
            class="text-white"
            @click.prevent="likeDesign()"
          >
            <template v-if="userLikes">
              <!--        <span class="material-icons" style="color:red">
thumb_down
</span> -->
              <!-- <v-btn v-bind="size" class="mx-2" dark flat medium> -->
              <v-icon v-bind="size" color="red darken-4" dark class="heart"
                >not_interested</v-icon
              >
              {{ likes }} <span v-if="likes > 1"> Likes</span
              ><span v-else> Like</span>
              <!-- </v-btn> -->
            </template>
            <template v-else>
              <!--       <span class="material-icons" style="color:blue">
thumb_up
</span> -->
              <!-- <v-btn v-bind="size" class="mx-2" dark flat medium> -->
              <v-icon v-bind="size" color="red darken-4" dark class="heart"
                >favorite</v-icon
              >
              {{ likes }} <span v-if="likes > 1"> Likes</span
              ><span v-else> Like</span>
              <!-- </v-btn> -->
            </template>
          </a>
        </div>
        <div v-else>
          <a class="text-white"
            >{{ likes }} <span v-if="likes > 1"> Likes</span
            ><span v-else> Like</span></a
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
    size() {
      const size = {
        xs: 'x-small',
        sm: 'small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
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
