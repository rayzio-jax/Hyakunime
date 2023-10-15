<template>
  <main class="flex justify-center md:justify-start duration-300">
    <video
      id="myVideo"
      class="fixed left-0 bottom-0 min-w-full min-h-full object-cover z-[-10] brightness-50 md:left-[200px] duration-300"
      autoplay
      muted
      loop
    >
      <source src="anime-bg.mp4" type="video/mp4" />
    </video>
    <section
      class="h-[100vh] min-w-[300px] max-w-[500px] w-full flex flex-col items-center justify-center"
    >
      <div class="bg-white p-10 rounded-md dark:bg-[#1D232A]">
        <h1 class="text-3xl py-8 text-center">
          Create an <span class="">Account</span>
        </h1>
        <div class="min-w-[300px] max-w-[500px] w-full">
          <form class="flex flex-col gap-y-5 py-3" @submit.prevent="signUp">
            <div class="flex flex-col">
              <label for="nickname">Nickname</label>
              <input
                id="nickname"
                v-model="nickname"
                class="outline-none p-1 border-2 border-purple-600 placeholder:italic focus:border-2 focus:border-black dark:border-white dark:focus:border-purple-600"
                type="text"
                name="nickname"
                placeholder="max character 12 & min character 4"
              />
            </div>
            <div class="flex flex-col">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="email"
                class="outline-none p-1 border-2 border-purple-600 placeholder:italic focus:border-2 focus:border-black dark:border-white dark:focus:border-purple-600"
                type="text"
                name="email"
                placeholder="example@mail.com"
              />
            </div>
            <div class="flex flex-col gap-y-5">
              <div class="relative">
                <div class="flex flex-col relative">
                  <label for="password">Password</label>
                  <input
                    id="password"
                    v-model="password"
                    class="w-full outline-none p-1 border-2 placeholder:italic border-purple-600 focus:border-2 focus:border-black dark:border-white dark:focus:border-purple-600"
                    :type="
                      iconPassword === 'eye-off-outline' ? 'password' : 'text'
                    "
                    name="password"
                    placeholder="min 6 characters"
                  />
                  <div
                    class="absolute right-0 bottom-0 flex justify-center items-center m-2"
                  >
                    <ion-icon
                      :name="iconPassword"
                      class="text-lg"
                      @click="changeIconPassword"
                    ></ion-icon>
                  </div>
                </div>
              </div>
              <div class="relative">
                <div class="flex flex-col relative">
                  <label for="verifyNewPassword">Verify Password</label>
                  <input
                    id="verifyNewPassword"
                    v-model="verifyNewPassword"
                    class="w-full outline-none p-1 border-2 border-purple-600 placeholder:italic focus:border-2 focus:border-black dark:border-white dark:focus:border-purple-600"
                    :type="
                      iconVerifPass === 'eye-off-outline' ? 'password' : 'text'
                    "
                    name="verifyNewPassword"
                    placeholder="your password"
                  />
                  <div
                    class="absolute right-0 bottom-0 flex justify-center items-center m-2"
                  >
                    <ion-icon
                      :name="iconVerifPass"
                      class="text-lg"
                      @click="changeIconVerifPass"
                    ></ion-icon>
                  </div>
                </div>
                <h2
                  v-if="isError || !isVerified"
                  class="text-sm text-red-700 py-1"
                  :class="[
                    isError || !isVerified
                      ? 'block animate-error_shake'
                      : ('block' && isError) || ('block' && !isVerified)
                      ? 'animate-error_shake'
                      : '',
                  ]"
                >
                  {{ errorMessage }}
                </h2>
              </div>
            </div>
            <button
              id="login-btn"
              type="submit"
              class="border-slate-700 drop-shadow-md @btn @btn-md focus:@btn-primary hover:@btn-primary dark:border-slate-200"
            >
              Sign Up
            </button>
          </form>
          <h2>
            Have an account?
            <nuxt-link
              to="/login"
              class="w-fit duration-200 hover:text-purple-500 focus:border-b-black focus:border-b-2 dark:focus-within:border-b-purple-500"
              >Log in here</nuxt-link
            >
          </h2>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'SignUpPage',
  layout: 'login',
  middleware: 'login',
  data() {
    return {
      nickname: '',
      email: '',
      password: '',
      verifyNewPassword: '',
      user: null,
      iconPassword: 'eye-off-outline',
      iconVerifPass: 'eye-off-outline',
      isVerified: true,
      isError: false,
      errorMessage: this.$store.state.errorMessage,
    }
  },

  head() {
    return {
      title: 'Sign Up',
    }
  },

  methods: {
    changeIconPassword() {
      return this.iconPassword === 'eye-off-outline'
        ? (this.iconPassword = 'eye')
        : (this.iconPassword = 'eye-off-outline')
    },

    changeIconVerifPass() {
      return this.iconVerifPass === 'eye-off-outline'
        ? (this.iconVerifPass = 'eye')
        : (this.iconVerifPass = 'eye-off-outline')
    },

    async signUp() {
      // reset verified password state
      this.isVerified = true
      // reset error state & message
      this.isError = false
      this.$store.dispatch('sendErrorMessage', '')
      if (this.errorMessage !== '') {
        this.errorMessage = ''
      }

      const { user, session, error } = await this.$supabase.auth.signUp(
        {
          email: this.email,
          password: this.password,
        },
        {
          data: {
            nickname: this.nickname,
          },
        }
      )

      let errorType

      if (error) {
        const invalidEmail = 'Unable to validate email address: invalid format'
        const userRegistered = 'User already registered'
        const minimumPassword = 'Password should be at least 6 characters'
        const blankPassword = 'Signup requires a valid password'

        if (error?.message === invalidEmail) {
          errorType = 'typeError: Invalid Email Format'
        }

        if (error?.message === userRegistered) {
          errorType = 'typeError: User Registered'
        }

        if (error?.message === minimumPassword) {
          errorType = 'typeError: Password Too Short'
        }

        if (error?.message === blankPassword) {
          errorType = 'typeError: Password Blank'
        }

        console.log(error.message)
      }

      // error if input is blank
      if (
        (this.nickname === '' &&
          this.email === '' &&
          this.password === '' &&
          this.verifyNewPassword === '') ||
        (this.nickname === null &&
          this.email === null &&
          this.password === null &&
          this.verifyNewPassword === null)
      ) {
        this.$store.dispatch('sendErrorMessage', 'Fill out the blanks')
        if (this.errorMessage === '') {
          this.errorMessage = 'Fill out the blanks'
        }
        this.isError = true
        return
      }

      // error if nickname too long
      if (this.nickname.length > 12 || this.nickname.length < 4) {
        this.$store.dispatch(
          'sendErrorMessage',
          'Nickname must more than 4 & less than 12 characters'
        )
        if (this.errorMessage === '') {
          this.errorMessage =
            'Nickname must more than 4 & less than 12 characters'
        }
        this.isError = true
        return
      }

      // error if email is blank
      if (this.email === '' || this.email === null) {
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
      if (errorType === 'typeError: Password Blank') {
        this.$store.dispatch('sendErrorMessage', 'Password is blank')
        if (this.errorMessage === '') {
          this.errorMessage = 'Password is blank'
        }
        this.isError = true
        return
      }

      // error if password too short
      if (errorType === 'typeError: Password Too Short') {
        this.$store.dispatch(
          'sendErrorMessage',
          'Password must be at least six characters long'
        )
        if (this.errorMessage === '') {
          this.errorMessage = 'Password must be at least six characters long'
        }
        this.isError = true
        return
      }

      // error if verify password is blank
      if (this.verifyNewPassword === '' || this.verifyNewPassword === null) {
        this.$store.dispatch('sendErrorMessage', 'Verify password is blank')
        if (this.errorMessage === '') {
          this.errorMessage = 'Verify password is blank'
        }
        this.isError = true
        return
      }

      // error if password doesn't match with verify password
      if (this.password !== this.verifyNewPassword) {
        this.$store.dispatch('sendErrorMessage', "Password doesn't match")
        if (this.errorMessage === '') {
          this.errorMessage = "Password doesn't match"
        }
        this.isVerified = false
        return
      }

      // error user already registered
      if (errorType === 'typeError: User Registered') {
        this.$store.dispatch('sendErrorMessage', 'User has registered')
        if (this.errorMessage === '') {
          this.errorMessage = 'User has registered'
        }
        this.isError = true
        return
      }

      console.log(`Log In Success`)
      console.log(`User logged in: ${user.user_metadata.nickname}`)
      this.$cookies.set('auth.token', session.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        secure: true,
      })
      this.$router.push({ path: '/' })
    },
  },
}
</script>

<style>
</style>