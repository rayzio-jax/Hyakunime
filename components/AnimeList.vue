<template>
  <div class="h-fit p-5">
    <!-- if api has reach limit -->
    <div
      v-if="apiLimit"
      class="h-[100vh] flex flex-col justify-center items-center"
    >
      <h1 class="text-3xl">{{ apiLimit }}</h1>
      <p>you may have to wait tomorrow to access again</p>
      <trakteer-button class="py-4" />
    </div>
    <!-- while loading fetch api -->
    <div
      v-else-if="isFetching"
      class="h-[100vh] flex flex-col justify-center items-center"
    >
      <h1 class="text-3xl">Loading data..</h1>
    </div>
    <div v-else-if="!isFetching && animeData">
      <!-- if anime data exist -->
      <div v-if="isExist" class="flex flex-col items-center gap-y-10">
        <!-- anime cards -->
        <anime-cards :anime-data="animeData" />
        <!-- prev / next page -->
        <div
          class="w-full flex items-center mx-auto px-2"
          :class="[isMorePage ? 'justify-between' : 'justify-center']"
        >
          <button
            v-if="isMorePage"
            class="text-lg @btn @btn-md"
            :class="[reachMinPage ? '@btn-disabled' : '@btn-outline']"
            type="button"
            @click="fetchPrevPage"
          >
            Prev Page
          </button>
          <trakteer-button />
          <button
            v-if="isMorePage"
            type="button"
            class="text-lg @btn @btn-md"
            :class="[reachMaxPage ? '@btn-disabled' : '@btn-outline']"
            @click="fetchNextPage"
          >
            Next Page
          </button>
        </div>
      </div>
      <!-- if anime data doesn't exist -->
      <div
        v-else-if="!isExist"
        class="h-[100vh] flex flex-col justify-center items-center"
      >
        <h1 class="text-3xl py-4">No Anime Found</h1>
        <trakteer-button />
      </div>
    </div>
  </div>
</template>

<script>
import TrakteerButton from './TrakteerButton.vue'
import AnimeCards from '~/components/AnimeCards.vue'
export default {
  components: {
    AnimeCards,
    TrakteerButton,
  },

  props: {
    animeData: {
      type: Array,
      default() {
        return []
      },
    },
    isMorePage: {
      type: Boolean,
      default: null,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    reachMaxPage: {
      type: Boolean,
      default: false,
    },
    reachMinPage: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      errorMessage: '',
      currentPage: Number(this.$route.params.page) || 1,
    }
  },

  computed: {
    apiLimit() {
      const limit = this.$store.state.errorMessage
      return limit
    },
    isExist() {
      return this.$store.state.animeExist
    },
  },

  methods: {
    async fetchNextPage() {
      await this.$router.push({
        path: `/anime/page/${(this.currentPage += 1)}`,
      })
    },

    async fetchPrevPage() {
      if (this.currentPage <= 1) {
        this.currentPage = 1
        await this.$router.push({
          path: `/anime/page/`,
        })
      } else {
        await this.$router.push({
          path: `/anime/page/${(this.currentPage -= 1)}`,
        })
      }
    },
  },
}
</script>
