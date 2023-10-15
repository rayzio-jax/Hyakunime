<template>
  <div id="top-navbar">
    <mobile-nav
      v-if="isMobile"
      :show-menu="isMobileMenu"
      :nickname="userNickname"
      @menuStateOn="isMobileMenu = true"
      @menuStateOff="isMobileMenu = false"
      @logOut="logOut"
    />
    <desktop-nav
      v-else-if="!isMobile"
      :nickname="userNickname"
      @logOut="logOut"
    />
  </div>
</template>

<script>
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'
export default {
  name: 'NavBar',
  components: {
    DesktopNav,
    MobileNav,
  },
  middleware: 'auth',
  data() {
    return {
      userNickname: 'User',
      isMobileMenu: false,
      isMobile: false,
    }
  },

  transitions: 'mobile-menu',

  mounted() {
    const user = this.$supabase.auth.user()
    const userNickname = user?.user_metadata?.nickname
    this.$store.dispatch('setUserNickname', userNickname)
    this.userNickname = this.$store.state.userNickname || 'User'
    if (
      this.userNickname === '' ||
      this.userNickname === null ||
      this.userNickname === undefined
    ) {
      this.$store.dispatch('setUserNickname', 'User')
    }
    const screen = window.innerWidth
    screen < 768 ? (this.isMobile = true) : (this.isMobile = false)
  },
  methods: {
    async logOut() {
      const { error } = await this.$supabase.auth.signOut()

      if (error) {
        throw new Error(`Error while trying to sign out: ${error.message}`)
      }

      this.$cookies.remove('auth.token')
      this.$cookies.remove('user.id')
      this.$router.push('/login')
    },
  },
}
</script>

<style>
</style>