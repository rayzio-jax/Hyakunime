<template>
  <nav id="dekstop-nav" class="h-fit w-full flex p-3 dark:bg-blue-950">
    <div
      class="w-full p-3 flex border-b-2 border-blue-400 gap-x-10 justify-center items-center"
    >
      <div class="user-nickname">
        <span
          v-for="(text, i) in nickname"
          :key="i"
          :style="{ animationDelay: `calc(0.1s * ${i + 1})` }"
        >
          {{ text }}
        </span>
      </div>
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

<style lang="scss" scoped>
.user-nickname {
  position: relative;
  -webkit-box-reflect: below -12px linear-gradient(transparent, rgba(0, 0, 0, 0.2));
  & span {
    padding: 0 5px;
    font-weight: 700;
    position: relative;
    display: inline-block;
    text-transform: uppercase;
    animation: waviy 1.2s infinite ease-out;
  }
}
</style>