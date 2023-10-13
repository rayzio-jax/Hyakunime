<template>
  <main class="h-full flex flex-col justify-center items-end p-2">
    <!-- anime searchbar -->
    <form
      class="flex relative items-center my-2 mb-7"
      @submit.prevent="getAnimeFromUser"
    >
      <input
        id="search-anime"
        v-model="searchAnime"
        class="p-2 py-3 pr-12 rounded-md drop-shadow-md border border-black md:drop-shadow-none focus:border-2 focus:border-purple-600 dark:border-white dark:focus:border-white"
        type="text"
        size="15"
        name="search-anime"
      />
      <button
        type="submit"
        class="absolute right-0 mr-2 text-xl @btn @btn-square @btn-sm"
      >
        <ion-icon name="search"></ion-icon>
      </button>
    </form>
    <section class="flex w-full">
      <div
        v-if="animeFetch.length > 0"
        class="grid w-full grid-cols-1 m-5 gap-x-5 gap-y-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        :class="[isMobile ? 'mt-4' : 'mt-0']"
      >
        <anime-item
          v-for="(anime, index) in animeFetch"
          :key="index"
          :anime="anime"
          @refreshAnime="refreshAnime"
        />
      </div>
      <div
        v-else
        class="h-[100vh] w-full flex flex-col justify-center items-center"
      >
        <h2 class="text-2xl">No Anime Booked</h2>
        <p>
          Why don't you book some?
          <nuxt-link
            to="/anime/page/1"
            class="duration-300 hover:text-orange-500"
            @click.native="resetAnimeSearch"
          >
            Go here
          </nuxt-link>
        </p>
      </div>
    </section>
  </main>
</template>

<script>
import AnimeItem from '~/components/AnimeItem.vue'
import { supabase } from '~/api/supabase'
export default {
  name: 'UserBookmark',
  components: {
    AnimeItem,
  },
  middleware: 'auth',
  data() {
    return {
      animeFetch: [],
      isBooked: null,
      isMobile: false,
      searchAnime: '',
    }
  },

  head() {
    return {
      title: 'User Bookmark',
    }
  },

  created() {
    this.getAnimeFromUser()
  },

  mounted() {
    const screen = window.innerWidth
    screen < 768 ? (this.isMobile = true) : (this.isMobile = false)
    const searchedAnime = this.$store.state.animeSearch
    this.searchAnime = searchedAnime
    if (searchedAnime !== '') {
      this.searchAnime = ''
    }
  },

  methods: {
    // async refreshAnime(data) {
    refreshAnime(data) {
      // this.isBooked = await data
      // if (!this.isBooked) {
      //   setTimeout(() => {
      //     this.getAnimeFromUser()
      //   }, 1000)
      // }
      setTimeout(() => {
        this.getAnimeFromUser()
      }, 500)
    },

    resetAnimeSearch() {
      this.$store.dispatch('animeSearched', '')
      this.searchAnime = ''
    },

    async getAnimeFromUser() {
      const token = this.$cookies.get('auth.token')
      const supabaseClient = supabase({ token })
      const user = this.$cookies.get('user.id')

      let query = supabaseClient.from('user_bookmark').select()

      if (this.searchAnime === '') {
        query = query.eq('user_id', user)
      } else {
        query = query
          .eq('user_id', user)
          .ilike('title', `%${this.searchAnime}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error(`Error checking data: ${error.message}`)
        this.$store.commit('SET_ERROR_MESSAGE', 'ERROR FETCHING DATA')
        this.isError = true
        return this.isError
      }

      this.animeFetch = data
      return this.animeFetch
    },
  },
}
</script>

<style>
</style>