<template>
  <div v-if="$fetchState.pending" class="loader">
    <Circle8></Circle8>
  </div>
  <div v-else class="pt-6 pl-6">
    <v-row class="row-md-12">
      <v-col class="col-md-7">
        <!-- LEFT -->

        <!-- Single Image -->
        <div>
          <img
            :src="design.images.large"
            style="
              max-width: 100%;
              max-height: 100vh;
              height: auto;
              border: 6px solid blanchedalmond;
            "
          />
        </div>
        <!-- End Single Image -->
        <div class="float-right mt-2">
          <v-btn
            size="large"
            color="deep-orange accent-2"
            @click="goToDesigns()"
            ><v-icon class="mr-2">flip_to_back</v-icon
            >{{ $t('show.backToArtwork') }}</v-btn
          >
        </div>
        <!-- Design Comments -->
        <div class="design-comments mt-3 px-4">
          <h1 class="font-16 fw-300 mb-4">
            <strong class="fw-500"
              >{{ comments.length }} {{ $t('comments.comments') }}</strong
            >
          </h1>
          <v-list-item>
            <v-list-item-content>
              <DesignComment
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @deleted="handleDelete"
              ></DesignComment>
            </v-list-item-content>
          </v-list-item>
        </div>

        <template v-if="$auth.loggedIn">
          <form @submit.prevent="save">
            <v-textarea
              v-model.trim="form.body"
              outlined
              :rows="2"
              :form="form"
              field="body"
              :placeholder="$t('comments.enterComment')"
              class="pl-4 pr-14"
            ></v-textarea>
            <div class="mt-2 text-right pr-14">
              <v-btn type="submit" size="sm">
                <v-icon class="mr-2">insert_comment</v-icon
                >{{ $t('comments.postComment') }}
              </v-btn>
            </div>
          </form>
        </template>

        <!--/ END COMMENTS-->
      </v-col>
      <v-divider class="mx-0" inset vertical></v-divider>
      <v-col class="col-md-4">
        <!-- RIGHT -->
        <v-card-text>
          <!-- Design Infos -->
          <div class="mb-6">
            <p class="text-h3 text-left block">
              {{ designTitle | capitalize }}
            </p>
            <v-divider class="mx-0" inset></v-divider>
            <p class="text-h6 text-left block">
              {{ $t('show.by') }} {{ design.user.username }}
            </p>
            <p class="text-subtitle-1 text-left pb-3 pt-2">
              {{ design.description }}
            </p>
          </div>
          <div class="pb-2">
            <p class="text-subtitle-2 text-left">
              {{ $t('show.published') }}
              {{ design.created_at_dates.created_at_human }}
            </p>
            <DesignLike :design="design"></DesignLike>
          </div>
          <v-divider class="mx-0 mb-6"></v-divider>
          <div class="post-detail-sidebar mt-3">
            <!-- Designs Tags -->
            <div
              v-if="design.tag_list.tags.length > 0"
              class="designs-tag-outer mt-3"
            >
              <h2 class="font-16 fw-500 mb-2">
                Tags
              </h2>
              <div class="font-14 fw-300 mb-6">
                <v-chip
                  v-for="(tag, i) in design.tag_list.tags"
                  :key="`tag-${i}`"
                  class="ma-2"
                  color="#43A047"
                  text-color="white"
                  @click="goToTag(`${design.tag_list.normalized[i]}`)"
                >
                  {{ tag }}
                </v-chip>
                <!-- </a> -->
              </div>
              <v-divider class="mx-0 pb-3 pt-6"></v-divider>
            </div>
            <!-- End Designs Tags -->

            <!-- Designer info -->
            <div class="white-bg-color">
              <avatar
                :username="user.name"
                :src="user.avatars.medium"
                class="mx-3 mt-3"
                inline="true"
                :size="100"
              ></avatar>
              <div class="modal-user-detail ml-2">
                <h1 class="font-13 fw-500">
                  <v-btn
                    text
                    size="large"
                    color="whitesmoke"
                    @click="goToUser(`${design.user.id}`)"
                    >{{ design.user.name }}</v-btn
                  >
                </h1>
                <p class="font-12 fw-300 mt-1">
                  <span class="shot-by">{{ design.user.tagline }}</span>
                </p>
                <!-- <p class="font-12 fw-300 mt-1">
                  {{ design.created_at_dates.created_at_human }}
                </p> -->
              </div>
            </div>
            <!-- End Designer info -->
            <v-divider class="mt-6 mb-6"></v-divider>
            <!-- Designer Design Info -->
            <!-- <vue-goodshare></vue-goodshare>
 <v-divider class="mt-6 mb-6"></v-divider> -->
            <!-- <ul class="details-side-meta font-14 fw-400 mx-0">
              <li class="d-table w-100 mt-3">
                <div class="stats-txt d-table-cell w-100">
                  <a href="#"> More from {{ design.user.name }} </a>
                </div>
              </li>
            </ul> -->
            <!-- End Designer Design Info -->
            <!-- Designer More Designs -->
            <v-card>
              <tabs
                :design-id="design.id"
                :user="user"
                :tags="design.tag_list.tags"
              ></tabs>
            </v-card>
            <!-- End Designer More Designs -->
          </div>
          <!-- <VueSocialSharing></VueSocialSharing> -->
        </v-card-text>

        <!--/ END RIGHT-->
      </v-col>
    </v-row>
    <!-- Modal  -->
    <!-- <keep-alive> -->
    <base-modal
      :dialog.sync="visible"
      :width="width"
      @closeDialog="hideModal()"
    />
    <!-- </keep-alive> -->
    <!-- End Modal -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// const Circle8 = require('vue-loading-spinner/src/components/Circle8.vue')
import Circle8 from 'vue-loading-spinner/src/components/Circle8.vue'
// import RingLoader from 'vue-spinner/src/RingLoader.vue'
// import VueGoodshare from 'vue-goodshare'
// import SocialSharing from 'vue-social-sharing'
// import GoogleSpin from 'vue-loading-spinner/src/components/Circle8.vue'
import Avatar from 'vue-avatar'
export default {
  name: 'Design',
  layout: 'designs-listing',
  components: {
    // RingLoader,
    // VueGoodshare,
    // SocialSharing,
    Circle8,
    // GoogleSpin,
    Avatar,
  },
  async fetch() {
    const url = `/designs/${this.designId}`
    const response = await this.$axios.$get(url)
    this.design = response.data
    this.comments = response.data.comments
    this.user = response.data.user
    this.images = response.data.images
  },

  data() {
    return {
      form: this.$vform({
        body: '',
      }),
      design: {},
      comments: {},
      user: {},
      created_at_dates: {},
      images: {},
      designId: this.$route.params.id,
      width: '500px',
      prevRoute: null,
    }
  },
  fetchOnServer: true,
  computed: {
    ...mapGetters(['visible']),
    designTitle() {
      if (!this.design.title) return 'Sans Titre'
      else return this.design.title
    },
  },

  methods: {
    ...mapActions(['hideModal']),
    handleDelete(id) {
      this.comments = this.comments.filter((c) => c.id !== id)
    },

    save() {
      this.form
        .post(`/designs/${this.design.id}/comments`)
        .then((res) => {
          this.form.reset()
          this.comments = [...this.comments, res.data.data]
        })
        .catch((e) => console.log(e))
    },
    goToTag(tagParam) {
      if (this.$route.path !== `/designs/${tagParam}/tag`) {
        this.$router.push({ name: 'designs.tag', params: { tag: tagParam } })
      }
      this.hideModal()
    },
    goToUser(userId) {
      if (this.$route.path !== `/designs/${userId}/user`) {
        this.$router.push({ name: 'designs.user', params: { id: userId } })
      }
      this.hideModal()
    },
    goToDesigns() {
      // this.$router.push(this.localePath({ name: 'designs.search' }))
      this.$router.go(-1)
    },
    async fetchData() {
      const url = `/designs/${this.designId}`
      const response = await this.$axios.$get(url)
      this.design = response.data
      this.comments = response.data.comments
    },
    toTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  text-align: left;
}
.showDesign {
  background-color: #0f1219;

  line-height: 1.6em;
  text-rendering: optimizelegibility;
  top: 30px;
}
.v-sheet.v-card {
  background-color: #0f1219;

  line-height: 1.6em;
  text-rendering: optimizelegibility;
}
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
}
.v-application a {
  color: #e0f2f1;
}
.v-application ul,
.v-application ol .v-application a {
  padding-left: 0;
}
</style>
