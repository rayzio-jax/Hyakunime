<template>
  <main class="flex">
    <video
      id="myVideo"
      class="z-[-10] fixed left-0 bottom-0 min-w-full min-h-full object-cover brightness-50 md:left-[200px] duration-300"
      autoplay
      muted
      loop
    >
      <source src="anime-bg.mp4" type="video/mp4" />
    </video>
    <section
      class="p-4 h-[100vh] min-w-[300px] w-full flex flex-col items-center justify-center"
      :class="[isMobile ? 'max-w-none' : 'max-w-[500px]']"
    >
      <div
        class="bg-white p-5 rounded-md dark:bg-[#1D232A]"
        :class="[isMobile ? 'justify-center items-center' : '']"
      >
        <h1 class="text-3xl py-8 self-start">
          Welcome to <span class="">hyakuNime</span>
        </h1>
        <div class="min-w-[300px] max-w-[500px] w-full">
          <form class="flex flex-col gap-y-5 py-3" @submit.prevent="logIn">
            <div class="flex flex-col">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="email"
                class="outline-none p-1 border-2 border-purple-600 focus:border-2 focus:border-black dark:border-white dark:focus:border-purple-600"
                type="text"
                name="email"
                placeholder="example@mail"
              />
            </div>
            <div class="flex flex-col">
              <div class="flex flex-col relative">
                <label for="password">Password</label>
                <input
                  id="password"
                  v-model="password"
                  class="outline-none p-1 border-2 border-purple-600 placeholder:italic focus:border-2 focus:border-black dark:border-white dark:focus:border-purple-600"
                  :type="iconName === 'eye-off-outline' ? 'password' : 'text'"
                  name="password"
                  placeholder="your password"
                />
                <div
                  class="absolute right-0 bottom-0 flex justify-center items-center m-2"
                >
                  <ion-icon
                    :name="iconName"
                    class="text-lg"
                    @click="changeIconName"
                  ></ion-icon>
                </div>
              </div>
              <nuxt-link
                to="/reset-password"
                class="w-fit duration-200 hover:text-purple-500 focus:border-b-black focus:border-b-2 dark:focus-within:border-b-purple-500"
              >
                Forgot password?
              </nuxt-link>
              <h2
                v-if="isError"
                class="text-sm text-red-700"
                :class="[
                  isError
                    ? 'block animate-error_shake'
                    : 'block' && isError
                    ? 'animate-error_shake'
                    : '',
                ]"
              >
                {{ errorMessage }}
              </h2>
            </div>
            <button
              id="login-btn"
              type="submit"
              class="border-slate-700 drop-shadow-md @btn @btn-md focus:@btn-primary hover:@btn-primary dark:border-slate-200"
            >
              Log In
            </button>
            <div class="flex flex-col relative justify-center items-center">
              <div
                class="absolute flex center translate-x-[-30px] translate-y-[1px]"
              >
                <ion-icon
                  name="logo-discord"
                  class="text-2xl text-white"
                ></ion-icon>
              </div>
              <button
                type="button"
                class="@btn @btn-md @btn-primary w-full"
                @click="discordLogIn"
              >
                <span class="ml-8">Discord</span>
              </button>
            </div>
          </form>
          <nuxt-link
            to="/sign-up"
            class="w-fit duration-200 hover:text-purple-500 focus:border-b-black focus:border-b-2 dark:focus-within:border-b-purple-500"
            >Don't have an account?
          </nuxt-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
// import { supabase } from '~/api/supabase'
export default {
  name: 'LoginPage',
  layout: 'login',
  middleware: 'login',

  data() {
    return {
      email: '',
      password: '',
      user: null,
      iconName: 'eye-off-outline',
      isMobile: false,
      isError: false,
      errorMessage: this.$store.state.errorMessage,
    }
  },

  head() {
    return {
      title: 'Log In',
    }
  },

  mounted() {
    const screen = window.innerWidth
    screen < 768 ? (this.isMobile = true) : (this.isMobile = false)
  },

  methods: {
    changeIconName() {
      return this.iconName === 'eye-off-outline'
        ? (this.iconName = 'eye')
        : (this.iconName = 'eye-off-outline')
    },

    async discordLogIn() {
      const {
        user: userDiscord,
        session: userSession,
        error: discordError,
      } = await this.$supabase.auth.signIn({
        provider: 'discord',
      })

      if (discordError) {
        this.$store.dispatch('sendErrorMessage', 'Discord login error!')
        if (this.errorMessage === '') {
          this.errorMessage = 'Discord login error!'
        }
        return (this.isError = true)
      }

      console.log(`Log In With Discord Success`)
      console.log(userDiscord)
      this.$cookies.set('auth.token', userSession?.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
    },

    async logIn() {
      // reset error state & message
      this.isError = false
      this.$store.dispatch('sendErrorMessage', '')
      if (this.errorMessage !== '') {
        this.errorMessage = ''
      }

      const { user, session, error } = await this.$supabase.auth.signIn({
        email: this.email,
        password: this.password,
      })

      let errorType

      if (error) {
        const invalidEmail = 'Unable to validate email address: invalid format'
        const wrongCredentials = 'Invalid login credentials'

        if (error?.message === invalidEmail) {
          errorType = 'typeError: Invalid Email Format'
        }

        if (error?.message === wrongCredentials) {
          errorType = 'typeError: Wrong Credentials'
        }
      }

      // error if input is blank
      if (
        (this.email === '' && this.password === '') ||
        (this.email === null && this.password === null)
      ) {
        this.$store.dispatch('sendErrorMessage', 'Fill out the blanks')
        if (this.errorMessage === '') {
          this.errorMessage = 'Fill out the blanks'
        }
        this.isError = true
        return
      }

      // error if email is blank
      if (
        (this.email === '' && this.password !== '') ||
        (this.email === null && this.password !== null)
      ) {
        this.$store.dispatch('sendErrorMessage', 'Email is blank')
        if (this.errorMessage === '') {
          this.errorMessage = 'Email is blank'
        }
        this.isError = true
        return
      }

      // error if email format wrong
      if (errorType === 'typeError: Invalid Email Format') {
        this.$store.dispatch('sendErrorMessage', 'Invalid email format')
        if (this.errorMessage === '') {
          this.errorMessage = 'Invalid email format'
        }
        this.isError = true
        return
      }

      // error if password is blank
      if (this.password === '' || this.password === null) {
        this.$store.dispatch('sendErrorMessage', 'Password is blank')
        if (this.errorMessage === '') {
          this.errorMessage = 'Password is blank'
        }
        this.isError = true
        console.log(this.errorMessage)
        return
      }

      // error if user email or password is wrong
      if (errorType === 'typeError: Wrong Credentials') {
        this.$store.dispatch('sendErrorMessage', 'Wrong email or password')
        if (this.errorMessage === '') {
          this.errorMessage = 'Wrong email or password'
        }
        this.isError = true
        return
      }

      console.log(`Log In Success`)
      console.log(`User session: ${user?.user_metadata?.nickname}`)
      this.$cookies.set('auth.token', session?.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
      return this.$router.push('/anime/page/1')
    },
  },
}
</script>

<style lang="scss" src="~/assets/style/main.scss" scoped>
</style>