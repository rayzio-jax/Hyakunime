<template>
  <main>
    <div class="w-full p-2 flex justify-end items-center gap-x-5">
      <h2 v-if="isAnimePageError" class="px-16">
        {{ errorMessage || 'Error' }}
      </h2>
      <!-- anime searchbar -->
      <form
        class="flex relative items-center my-2"
        @submit.prevent="fetchData(1)"
      >
        <input
          id="search-anime"
          v-model="searchAnime"
          class="p-2 py-3 pr-12 rounded-md drop-shadow-md border border-black md:drop-shadow-none focus:border-2 focus:border-purple-600 dark:border-white dark:focus:border-orange-500"
          type="text"
          size="15"
          name="search-anime"
        />
        <button
          type="submit"
          class="absolute right-0 mr-2 text-xl border border-black drop-shadow-md @btn @btn-square @btn-sm dark:border-white"
        >
          <ion-icon name="search"></ion-icon>
        </button>
      </form>
    </div>
    <!-- showing list of anime -->
    <anime-list
      :anime-data="animeData"
      :is-more-page="isMorePage"
      :current-page="currentPage"
      :is-fetching="isFetching"
      :reach-max-page="reachMaxPage"
      :reach-min-page="reachMinPage"
    />
  </main>
</template>

<script>
import { themeChange } from 'theme-change'
import AnimeList from '~/components/AnimeList.vue'
export default {
  components: {
    AnimeList,
  },
  layout: 'anime',
  middleware: 'auth',
  data() {
    return {
      animeData: [],
      isMorePage: true,
      isPageError: this.$store.state.isAnimePageError,
      searchAnime: '',
      currentPage: Number(this.$route.params.page) || 1,
      reachMaxPage: false,
      reachMinPage: false,
    }
  },

  computed: {
    isFetching() {
      return this.$store.state.isFetching
    },
    errorMessage() {
      return this.$store.state.errorMessage
    },
    isAnimePageError() {
      return this.$store.state.isAnimePageError
    },
  },

  mounted() {
    themeChange(false)
    const searchedAnime = this.$store.state.animeSearch
    this.searchAnime = searchedAnime
    this.fetchData()
  },

  methods: {
    async fetchData(page) {
      const apiKey = process.env.API_KEY
      const apiHost = process.env.API_HOST
      const currentPage = this.currentPage || 1
      const url = '/anime'
      const apiParams = {
        search: this.searchAnime,
        page: currentPage,
        size: '20',
      }
      if (!this.isFetching) {
        try {
          this.$store.dispatch('animeFetch', true)

          // get api data
          const res = await this.$axios.get(url, {
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': apiHost,
            },
            params: apiParams,
          })

          this.$store.dispatch('animeSearched', this.searchAnime)
          const data = res?.data?.data
          const totalPage = res?.data?.meta?.totalPage
          const totalData = res?.data?.meta?.totalData
          this.animeData = data

          if (page === 1) {
            this.$router.push('/anime/page/1')
          }

          if (totalData) {
            this.$store.dispatch('animeExist', true)
            if (totalPage > 1) {
              this.isMorePage = true
              if (currentPage === totalPage) {
                this.reachMaxPage = true
              }
              if (currentPage === 1) {
                this.reachMinPage = true
              }
            } else {
              this.reachMaxPage = true
              this.reachMinPage = true
              this.isMorePage = false
            }
          } else {
            this.$store.dispatch('animeExist', false)
          }

          this.$store.dispatch('animeFetch', false)
        } catch (error) {
          console.error('Fetch data failed: ', error.response.data.message)
          if (
            parseInt(
              error.response.headers['x-ratelimit-requests-remaining']
            ) === 0
          ) {
            this.$store.commit('SET_ERROR_MESSAGE', 'API Limit Reach')
            return Promise.reject(new Error('API Limit Reach'))
          } else if (error.response.status === 429) {
            this.$router.push('/error')
            return Promise.reject(new Error('Too many request'))
          }
          this.$store.dispatch('animeFetch', false)
        }
      }
    },
  },
}
</script>

<style>
</style>