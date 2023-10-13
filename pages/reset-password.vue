<template>
  <main
    class="h-[100vh] w-full relative px-5 flex flex-col justify-center items-center overflow-clip"
  >
    <transition-group
      name="show-alert"
      enter-active-class="transition-transform ease-in-out duration-[1s]"
      enter-class="translate-x-[100%]"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform ease-in-out duration-[1s]"
      leave-class="translate-x-0"
      leave-to-class="translate-x-[100%]"
    >
      <!-- success alert -->
      <div
        v-show="isSuccess"
        :key="'isSuccess'"
        class="@alert @alert-success max-w-lg absolute top-3 right-3 overflow-hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span
          >Reset password request sent, check to every categories in your email
          including spam</span
        >
      </div>
      <!-- error alert -->
      <div
        v-show="isError"
        :key="'isError'"
        class="@alert @alert-error max-w-lg absolute top-3 right-3 overflow-hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
    </transition-group>
    <div class="flex flex-col gap-y-5 overflow-hidden">
      <div class="flex flex-col justify-center items-center">
        <img
          src="https://media.tenor.com/Zru-c9jfiRIAAAAi/mystic-messenger-video-game.gif"
          alt="questioning-sticker"
          width="200"
        />
        <h1 class="text-3xl font-onest">Do you forgot your password?</h1>
      </div>
      <h2>
        Enter your email here, we will send forget password link to your email.
      </h2>
      <form class="@join" @submit.prevent="sendPasswordRequest">
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          placeholder="example@mail.com"
          required
          class="@input @join-item w-full focus:focus-within:outline-none focus:focus-within:border-l-0 focus:focus-within:border-t-0 focus:focus-within:border-b-2 focus:focus-within:border-b-black dark:focus:focus-within:border-b-white dark:focus:focus-within:border-r-primary"
        />
        <button
          type="submit"
          class="@btn @btn-primary @btn-md @join-item dark:@btn-outline hover:bg-purple-950 focus:focus-within:outline-none focus:focus-within:border-2 focus:focus-within:bg-primary-focus focus:focus-within:border-orange-500 dark:focus:focus-within:bg-primary dark:focus:focus-within:text-white dark:focus:focus-within:border-none dark:hover:bg-none"
        >
          Send
        </button>
      </form>
      <nuxt-link
        to="/"
        class="@btn @btn-error @btn-md w-full hover:text-white hover:bg-error-content hover:border-none"
        >Cancel</nuxt-link
      >
    </div>
  </main>
</template>

<script>
export default {
  name: 'ResetPasswordPage',
  layout: 'login',
  middleware: 'login',
  data() {
    return {
      email: '',
      isSuccess: false,
      isError: false,
      errorMessage: 'Error occurred!',
    }
  },

  mounted() {
    this.isError = false
    this.isSuccess = false
  },

  methods: {
    async sendPasswordRequest() {
      this.isError = false
      this.isSuccess = false
      const { error: resetPasswordError } =
        await this.$supabase.auth.api.resetPasswordForEmail(this.email, {
          redirectTo: 'http://localhost:3000/account/update-password',
        })

      if (resetPasswordError) {
        this.$store.dispatch('sendErrorMessage', resetPasswordError.message)
        if (this.errorMessage === 'Error occurred!') {
          this.errorMessage = resetPasswordError.message
        }
        return (this.isError = true)
      }

      this.$store.dispatch('isResetPassword', true)
      console.log(`Sent reset password`)
      this.isSuccess = true
    },
  },
}
</script>

<style>
</style>