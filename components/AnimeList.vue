<template>
  <div class="h-fit p-3">
    <!-- if api has reach limit -->
    <div
      v-if="apiLimit"
      class="h-[100vh] flex flex-col justify-center items-center"
    >
      <h1 class="text-3xl">{{ apiLimit }}</h1>
      <p>you may have to wait tomorrow to access again</p>
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
        <div class="w-full flex justify-between">
          <button
            class="text-lg @btn @btn-outline @btn-md"
            :class="[currentPage > 1 ? 'block' : 'hidden']"
            type="button"
            @click="fetchPrevPage"
          >
            Prev Page
          </button>
          <div :class="[isMorePage ? 'block' : 'hidden']"></div>
          <button
            type="button"
            class="text-lg @btn @btn-outline @btn-md"
            :class="[isMorePage ? 'block' : 'hidden']"
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
        <h1 class="text-3xl">No Anime Found</h1>
      </div>
    </div>
  </div>
</template>

<script>
import AnimeCards from '~/components/AnimeCards.vue'

export default {
  components: {
    AnimeCards,
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
