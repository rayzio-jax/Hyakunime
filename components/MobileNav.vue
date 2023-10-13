<template>
  <div id="mobile-nav">
    <div
      class="absolute left-0 m-3 drop-shadow-md border-2 border-black @btn @btn-md @btn-square hover:border-black dark:border-slate-500 dark:hover:border-white"
      @click="$emit('menuStateOn')"
    >
      <ion-icon name="menu" class="text-2xl"></ion-icon>
    </div>
    <transition
      name="mobile-menu"
      enter-active-class="transition-transform ease-out duration-700"
      enter-class="translate-x-[-100%]"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform ease-out duration-700"
      leave-class="translate-x-0"
      leave-to-class="translate-x-[-100%]"
    >
      <nav
        v-show="showMenu"
        class="h-[55vh] w-full flex flex-col items-end rounded-br-md p-3 fixed top-0 bg-orange-300 dark:bg-blue-950"
      >
        <div
          class="@btn @btn-md @btn-square hover:bg-slate-300 dark:border-2 dark:border-slate-500 dark:hover:bg-slate-800 dark:hover:border dark:hover:border-white"
          @click="$emit('menuStateOff')"
        >
          <ion-icon name="close" class="text-2xl"></ion-icon>
        </div>

        <div class="w-full p-3 flex flex-col gap-y-10">
          <h1 id="user-nickname">{{ nickname }}</h1>
          <nuxt-link to="/anime/page/" @click.native="resetAnimeSearch">
            Anime
          </nuxt-link>
          <nuxt-link to="/user">User</nuxt-link>
          <nuxt-link to="/bookmark" @click.native="$emit('resetSearch')"
            >Bookmark</nuxt-link
          >
          <button
            class="text-lg font-bold @btn @btn-primary @btn-md focus:outline-none focus:border-2 focus:border-white focus:bg-primary-focus dark:@btn-outline dark:focus:bg-primary-focus dark:focus:text-white dark:focus:border-none"
            @click="$emit('logOut')"
          >
            Log out
          </button>
        </div>
      </nav>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MobileMenuNav',
  props: {
    nickname: {
      type: String,
      default: 'User',
    },
    showMenu: {
      type: Boolean,
      default: false,
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
a {
  width: fit-content;
}
</style>