<template>
  <nav id="dekstop-nav" class="h-fit w-full flex p-3 dark:bg-blue-950">
    <div
      class="w-full p-3 flex border-b-2 border-blue-400 gap-x-10 justify-center items-center"
    >
      <h1 id="user-nickname">{{ nickname }}</h1>
      <nuxt-link to="/anime/page/" @click.native="resetAnimeSearch"
        >Anime</nuxt-link
      >
      <nuxt-link to="/user">User</nuxt-link>
      <nuxt-link to="/bookmark" @click="$emit('resetSearch')"
        >Bookmark</nuxt-link
      >
      <button
        class="text-white font-bold @btn @btn-primary @btn-md focus:outline-none focus:border-2 focus:border-purple-300 focus:bg-primary-focus dark:@btn-outline dark:focus:bg-primary-focus dark:focus:text-white dark:focus:border-none"
        @click="$emit('logOut')"
      >
        Log out
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'DesktopNavBar',
  props: {
    nickname: {
      type: String,
      default: 'User',
    },
  },
  methods: {
    resetAnimeSearch() {
      this.$store.dispatch('animeSearched', '')
    },
  },
}
</script>

<style>
</style>