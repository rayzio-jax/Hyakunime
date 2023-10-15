<template>
  <div>
    <div
      class="@card @bg-base-100 shadow-xl border h-full w-full min-w-fit max-w-6xl"
    >
      <figure v-if="!imageError">
        <img
          id="anime-img"
          :src="anime.image"
          :alt="anime.thumb"
          class="object-cover w-full h-[30vh] md:h-[35vh] lg:h-[50vh]"
          @error="imageError = !imageError"
        />
      </figure>
      <figure
        v-else
        class="object-cover w-full h-[30vh] md:h-[35vh] lg:h-[50vh] animate-no_image"
      >
        <h2 class="text-xl text-slate-800">No Image</h2>
      </figure>
      <div class="@card-body">
        <h1 class="@card-title lg:text-xl">
          {{ anime.title }}
        </h1>
        <h2>Genre:</h2>
        <h3>{{ getGenres(anime.genres) }}</h3>
        <h2>Episodes: {{ anime.episodes }}</h2>
        <h2>Type: {{ anime.type }}</h2>
      </div>
      <div class="@card-actions justify-end mr-2 my-2">
        <button
          class="@btn @btn-square border-2 hover:border-purple-500 dark:hover:border-white hover:@tooltip focus:@tooltip focus-within:@tooltip focus-visible:@tooltip"
          :data-tip="[isBooked ? 'Unbook' : 'Book']"
          @click="postBookmark(anime)"
        >
          <ion-icon
            :name="[isBooked ? 'bookmark' : 'bookmark-outline']"
            class="text-2xl"
          ></ion-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '~/api/supabase'
export default {
  props: {
    anime: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      isError: false,
      imageError: false,
      isBooked: null,
      supabaseClient: null,
    }
  },
  created() {
    const authToken = this.$cookies.get('auth.token')
    this.supabaseClient = supabase({ token: authToken })
  },
  async mounted() {
    const user = this.$cookies.get('user.id')

    const { data, error } = await this.supabaseClient
      .from('user_bookmark')
      .select('*')
      .eq('user_id', user)

    if (error) {
      console.error(`Error checking data: ${error.message}`)
      this.$store.commit('SET_ERROR_MESSAGE', 'ERROR CHECKING DATA')
      this.$store.dispatch('animePageError', true)
      return
    }

    const tempData = data.find((content) => {
      return content.title === this.$props.anime.title
    })

    if (tempData) {
      this.isBooked = true
    } else {
      this.isBooked = false
    }
  },

  methods: {
    getGenres(genres) {
      if (genres.length === 0) {
        return 'Unknown'
      } else {
        return genres.join(' ')
      }
    },

    async postBookmark(anime) {
      const user = this.$cookies.get('user.id')

      const { data, error } = await this.supabaseClient
        .from('user_bookmark')
        .select('*')
        .eq('user_id', user)

      if (error) {
        console.error(`Error checking data: ${error.message}`)
        this.$store.commit('SET_ERROR_MESSAGE', 'ERROR CHECKING DATA')
        this.$store.dispatch('animePagError', true)
        return
      }

      const tempData = data.find((content) => {
        return content.title === anime.title
      })

      if (tempData) {
        const { error } = await this.supabaseClient
          .from('user_bookmark')
          .delete()
          .eq('title', anime.title)

        if (error) {
          console.error(`Error checking data: ${error.message}`)
          this.$store.commit('SET_ERROR_MESSAGE', 'ERROR DELETING DATA')
          this.$store.dispatch('animePagError', true)
          return
        }
        console.log('delete data success')
        this.isBooked = false
        // this.$emit('refreshAnime', this.isBooked)
        this.$emit('refreshAnime')
        return
      }

      const { error: insertError } = await this.supabaseClient
        .from('user_bookmark')
        .insert([
          {
            user_id: user,
            title: anime.title,
            genres: anime.genres,
            image: anime.image,
            episodes: anime.episodes,
            type: anime.type,
          },
        ])
        .select()

      if (insertError) {
        console.error(`Error checking data: ${error.message}`)
        this.$store.commit('SET_ERROR_MESSAGE', 'ERROR INSERTING DATA')
        this.$store.dispatch('animePagError', true)
        return
      }

      console.log('insert data success')
      return (this.isBooked = true)
    },
  },
}
</script>

<style>
</style>