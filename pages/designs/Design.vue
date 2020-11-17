<template>
  <div v-if="$fetchState.pending" class="loader">
    <Circle8></Circle8>
  </div>
  <div v-else class="pt-6 pl-6">
    <v-row>
      <v-col class="design-left-col">
        <!-- LEFT -->

        <!-- Single Image -->
        <div id="row-design fluid">
          <v-card
            class="p-0 m-0 text-center fluid"
            width="auto"
            height="auto"
            tile
            elevation="0"
            hover
            @click="nothing = null"
          >
            <CoolLightBox
              :items="itemsDesigns"
              :index="index !== null ? parseInt(`${index}`) : index"
              :use-zoom-bar="true"
              :effect="'fade'"
              @close="index = null"
            >
            </CoolLightBox>
            <img
              :src="design.images.large"
              class="design-image"
              @click.stop="index = 0"
            />
          </v-card>
          <div v-show="$vuetify.breakpoint.xsOnly" class="mb-6">
            <p class="text-h5 text-right block">
              {{ designTitle | capitalize | truncate(17, '...') }}
            </p>
            <v-divider class="mx-0"></v-divider>
            <p class="text-h7 text-right block">
              {{ $t('show.by') }}
              <nuxt-link
                :to="
                  localePath({
                    name: 'designs.user',
                    params: { id: user.id },
                  })
                "
                >{{ design.user.name }}</nuxt-link
              >
            </p>
            <p class="text-subtitle-1 text-left pb-3 pt-2">
              {{ design.description }}
            </p>
          </div>
        </div>
        <!-- End Single Image -->
        <!-- XS -->
        <div class="mt-2 d-flex d-sm-none">
          <v-btn small color="orange darken-3" @click="goToDesigns()"
            ><v-icon small class="mr-2">flip_to_back</v-icon
            >{{ $t('show.backToArtwork') }}</v-btn
          >
        </div>
        <!-- Others -->
        <div class="float-right mt-2 d-none d-sm-flex">
          <v-btn small color="orange darken-3" @click="goToDesigns()"
            ><v-icon small class="mr-2">flip_to_back</v-icon
            >{{ $t('show.backToArtwork') }}</v-btn
          >
        </div>
        <!-- Design Comments -->
        <div class="design-comments mt-3 px-4">
          <h1 class="font-16 fw-300 mb-4">
            <strong class="fw-500"
              >{{ comments.length }}
              <span v-if="comments.length > 1">
                {{ $t('comments.comments') }}</span
              ><span v-else> {{ $t('comments.comment') }}</span></strong
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
              class="pl-4 pr-0"
            ></v-textarea>
            <div class="mt-2 text-right pr-0">
              <v-btn small type="submit">
                <v-icon small class="mr-2">insert_comment</v-icon
                >{{ $t('comments.postComment') }}
              </v-btn>
            </div>
          </form>
        </template>

        <!--/ END COMMENTS-->
      </v-col>
      <v-divider class="mx-0" inset vertical></v-divider>
      <v-col class="design-right-col">
        <!-- RIGHT -->
        <v-card-text>
          <!-- Design Infos -->
          <div v-show="!$vuetify.breakpoint.xsOnly" class="mb-0">
            <p class="text-h4 text-left block">
              {{ designTitle | capitalize | truncate(25, '...') }}
            </p>
            <v-divider class="mx-0"></v-divider>
            <p class="text-h6 text-left block">
              {{ $t('show.by') }}
              <nuxt-link
                :to="
                  localePath({ name: 'designs.user', params: { id: user.id } })
                "
                >{{ design.user.name }}</nuxt-link
              >
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
            <div class="fadin">
              <DesignLike :design="design"></DesignLike>
            </div>
          </div>
          <v-divider class="mx-0 mb-6"></v-divider>
          <div class="post-detail-sidebar mt-3">
            <!-- Designs Tags -->
            <div
              v-if="design.tag_list.tags.length > 0"
              class="designs-tag-outer mt-3"
            >
              <h2 class="font-16 fw-500 mb-2">
                {{ $t('show.tags') }}
              </h2>
              <div class="font-14 fw-300 mb-6">
                <v-chip
                  v-for="(tag, i) in design.tag_list.tags"
                  :key="`tag-${i}`"
                  class="ma-2"
                  color="#006064"
                  text-color="white"
                  @click="goToTag(`${design.tag_list.normalized[i]}`)"
                >
                  {{ tag }}
                </v-chip>
                <!-- </a> -->
              </div>
              <v-divider class="mx-0 pb-0 pt-0"></v-divider>
            </div>
            <!-- End Designs Tags -->

            <!-- Designer info -->
            <nuxt-link
              :to="
                localePath({ name: 'designs.user', params: { id: user.id } })
              "
              class="designer-info"
            >
              <div class="white-bg-color fadein" style="display: block">
                <v-row>
                  <v-col class="col-md-12 text-left"
                    ><h2 class="font-16 fw-500 mb-0">
                      {{ $t('show.theArtist') }}
                    </h2></v-col
                  >
                </v-row>
                <v-row class="row-md-12 p-0">
                  <v-col class="col-md-2 p-0">
                    <avatar
                      :username="user.name"
                      :src="user.avatars.medium"
                      class="mx-0 mt-3"
                      :size="100"
                    ></avatar>
                  </v-col>
                  <v-col class="col-md-9">
                    <div class="modal-user-detail ml-0">
                      <h1 class="font-13 fw-500">
                        <p class="text-h6 text-left block">
                          {{ design.user.name }}
                        </p>
                      </h1>
                      <p class="font-12 fw-300 mt-1">
                        <span class="shot-by">{{ design.user.tagline }}</span>
                      </p>
                      <!-- <p class="font-12 fw-300 mt-1">
                  {{ design.created_at_dates.created_at_human }}
                </p> -->
                    </div>
                  </v-col>
                </v-row>
              </div>
            </nuxt-link>
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
                :design-id="designId"
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
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
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
    CoolLightBox,
  },

  async fetch() {
    const url = `/designs/${this.designId}`
    const response = await this.$axios.$get(url)
    this.design = response.data
    this.comments = response.data.comments
    this.user = response.data.user
    this.images = response.data.images
    this.created_at_dates = response.data.created_at_dates
    this.tags = response.data.tag_list.tags
    const noTitle = 'Sans Titre'
    this.itemsDesigns.push({
      title: this.design.title ? this.design.title : noTitle,
      description: this.design.description,
      src: this.design.images.extralarge,
    })
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
      index: null,
      itemsDesigns: [],
      nothing: null,
      image: {
        size: '',
        height: '',
        width: '',
      },
    }
  },
  beforeMounted() {
    console.log(this.designId)
  },
  computed: {
    ...mapGetters(['visible']),
    designTitle() {
      if (!this.design.title) return 'Sans Titre'
      else return this.design.title
    },
    /* size() {
      const size = {
        xs: 'small',
        sm: 'small',
        md: 'small',
        lg: 'small',
        xl: 'small',
      }[this.$vuetify.breakpoint.name]
      return size ? { [size]: true } : {}
    }, */
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
  head() {
    return {
      title: this.designTitle + ', Zarbo',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.design.description,
        },
        {
          property: 'oeuvre:published_time',
          content: this.created_at_dates.created_at,
        },
        {
          property: 'oeuvre:tag',
          content: this.tags ? this.tags.toString() : '',
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `https://zarbo.fr/oeuvres/${this.design.slug}`,
        },
      ],
    }
  },

  fetchOnServer: false,
  /* mounted() {
    const img = new Image()
    img.src = this.design.images.large
    img.onload = () => {
      this.image.width = img.width
      this.image.height = img.height
    }
  }, */
}
</script>

<style lang="scss" scoped>
/* #row-design {
  width: auto;
  text-align: center;
} */
.v-application .text-h4 {
  line-height: 1rem;
}
.design-image {
  max-width: 100%;
  max-height: 100vh;
  height: auto;
  border: 6px solid blanchedalmond;
}
/* .design-right-col {
  width: auto;
  max-width: max-content;
} */
.design-left-col {
  width: auto;
  max-width: max-content;
  padding: 0 2% 0 1%;
  min-width: auto;
}
.designs-tag-outer {
  margin-bottom: 0;
}
.designer-info:hover {
  text-decoration: none !important;
}
.fadein {
  opacity: 0.5;
  transition: 1s ease;
}

.fadein:hover {
  color: grey-lighten-4;
  opacity: 1;
  transition: 1s ease;
}

.v-application .text-h6 {
  line-height: 1.3em;
  font-weight: 200;
  padding-top: 10px;
}
.v-application .text-subtitle-1 {
  font-size: 12px;
  line-height: 1.45em;
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 300;
}
.v-application .text-subtitle-2 {
  font-size: 12px;
  line-height: 1.45em;
  font-family: 'Josefin Sans', sans-serif;
  font-weight: 300;
}
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
.vue-avatar--wrapper {
  min-width: 50px;
}
body,
html {
  height: 100%; /* REMOVING THIS FIXES THE ISSUE */
  scroll-behavior: smooth;
}
.cool-lightbox
  .cool-lightbox__wrapper.cool-lightbox__wrapper--swipe
  .cool-lightbox__slide {
  opacity: 1 !important;
}
.row.row-design {
  display: contents !important;
}
</style>
