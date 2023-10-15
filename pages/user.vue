<template>
  <main class="h-[85vh] w-full flex flex-col justify-center items-center">
    <section>
      <div class="flex justify-between items-end py-3">
        <h1 class="text-4xl">
          YOW! <span class="text-xl">{{ currentNickname }}</span>
        </h1>
        <span
          v-if="isError"
          class="text-base text-red-700"
          :class="[
            isError
              ? 'block animate-error_shake'
              : 'block' && isError
              ? 'animate-error_shake'
              : 'hidden',
          ]"
        >
          {{ errorMessage }}
        </span>
      </div>
      <div class="relative">
        <div class="absolute center z-10">
          <button
            v-show="!isUpdating"
            id="show-update-form"
            type="button"
            class="drop-shadow-md @btn @btn-md @btn-info"
            @click="isUpdating = !isUpdating"
          >
            Update User?
          </button>
        </div>
        <form
          class="user-form-no-focus flex flex-col w-[80vw] max-w-lg drop-shadow-lg rounded-lg p-3 @form-control"
          @submit.prevent="updateUser"
        >
          <fieldset
            class="flex flex-col"
            :class="[
              !isUpdating
                ? 'opacity-25 brightness-50'
                : 'opacity-100 brightness-100',
            ]"
            :disabled="!isUpdating"
          >
            <div class="flex flex-col">
              <label for="nickname" class="@label">
                <span class="@label-text">Nickname</span>
              </label>
              <input
                id="nickname"
                v-model="userNickname"
                class="@input @input-bordered w-full max-w-lg"
                :class="[isUpdating === false ? 'selection:select-none' : '']"
                type="text"
                name="nickname"
                placeholder="New Nickname"
              />
            </div>
            <div class="flex flex-col">
              <label for="email" class="@label">
                <span class="@label-text">Email</span>
              </label>
              <input
                id="email"
                v-model="userEmail"
                class="@input @input-bordered w-full max-w-lg"
                :class="[isUpdating === false ? 'selection:select-none' : '']"
                type="email"
                name="email"
                placeholder="New Email"
              />
            </div>
            <div class="py-5">
              <button
                v-if="!verify.first"
                type="button"
                class="w-full @btn @btn-md @btn-warning hover:bg-[#F5B500] hover:text-white focus:focus-within:bg-[#F5B500] focus:focus-within:text-white focus:focus-within:border-2 focus:focus-within:border-[#fff] dark:@btn-outline dark:focus:focus-within:bg-warning dark:focus:focus-within:text-slate-800"
                @click="
                  ;(verify.first = !verify.first),
                    (verify.second = !verify.second)
                "
              >
                Delete User?
              </button>
              <button
                v-if="verify.second"
                type="button"
                class="w-full @btn @btn-md @btn-warning hover:bg-[#F5B500] hover:text-white focus:focus-within:bg-[#F5B500] focus:focus-within:text-white focus:focus-within:border-2 focus:focus-within:border-[#fff] dark:@btn-outline dark:focus:focus-within:bg-warning dark:focus:focus-within:text-slate-800"
                @click="
                  timerCountdown(),
                    (verify.second = !verify.second),
                    (verify.third = !verify.third)
                "
              >
                Are you sure?
              </button>
              <button
                v-if="verify.third"
                type="button"
                class="w-full @btn @btn-md @btn-warning hover:bg-[#F5B500] hover:text-white focus:focus-within:bg-[#F5B500] focus:focus-within:text-white focus:focus-within:border-2 focus:focus-within:border-[#fff] dark:@btn-outline dark:focus:focus-within:bg-warning dark:focus:focus-within:text-slate-800 dark:disabled:border-slate-600 dark:disabled:text-slate-400"
                :disabled="buttonDisabled"
                @click="deleteUser"
              >
                {{
                  buttonDisabled ? seconds : 'This will delete user immediately'
                }}
              </button>
            </div>
            <div class="py-2 flex justify-around">
              <button
                type="button"
                class="text-white drop-shadow-lg @btn @btn-md @btn-error hover:bg-[#e66264] focus:focus-within:bg-[#e66264] focus:focus-within:border-2 focus:focus-within:border-[#fff] dark:@btn-outline dark:focus:focus-within:bg-error dark:focus:focus-within:text-slate-800"
                @click="
                  resetUser()
                  isUpdating = !isUpdating
                "
              >
                Cancel
              </button>
              <button
                type="submit"
                class="text-white drop-shadow-lg @btn @btn-md @btn-success hover:bg-[#0ebf87] focus:focus-within:border-2 focus:focus-within:border-[#fff] focus:focus-within:bg-[#0ebf87] dark:@btn-outline dark:focus:focus-within:bg-success dark:focus:focus-within:text-slate-800"
              >
                Update
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  </main>
</template>

<script>
import { supabase } from '~/api/supabase'
export default {
  middleware: 'auth',
  data() {
    return {
      userNickname: this.$store.state.userNickname,
      currentNickname: 'User',
      userEmail: 'example@mail.com',
      isUpdating: false,
      user: null,
      session: null,
      isError: false,
      errorMessage: 'Error occurred',
      verify: {
        first: false,
        second: false,
        third: false,
      },
      seconds: 5,
      buttonDisabled: true,
      interval: null,
    }
  },

  head() {
    return {
      title: 'Profile',
    }
  },

  async mounted() {
    const user = await this.$supabase.auth.user()
    const session = await this.$supabase.auth.session()
    this.user = user
    this.session = session

    const userNickname = this.user?.user_metadata?.nickname
    const userEmail = this.user?.email

    this.$store.dispatch('setUserNickname', userNickname)

    this.userNickname = userNickname
    this.currentNickname = this.$store.state.userNickname || '友達'
    this.userEmail = userEmail
  },

  methods: {
    timerCountdown() {
      if (this.interval === null) {
        this.interval = setInterval(() => {
          if (this.seconds === 0) {
            clearInterval(this.interval)
            this.buttonDisabled = false
            return this.buttonDisabled
          } else {
            return this.seconds--
          }
        }, 1000)
      }
    },

    async resetUser() {
      const userNickname = await this.user?.user_metadata?.nickname
      const userEmail = await this.user?.email

      this.isError = false
      this.userEmail = userEmail
      this.userNickname = userNickname
      this.verify.first = false
      this.verify.second = false
      this.verify.third = false
    },

    async updateUser() {
      this.isError = false

      const { user, error: updateError } = await this.$supabase.auth.update({
        email: this.userEmail,
        data: {
          nickname: this.userNickname,
        },
      })

      if (updateError) {
        console.error('Error to update user: ', updateError.message)
        this.errorMessage = 'Update data error!'
        return (this.isError = true)
      }

      if (this.userNickname.length > 6) {
        console.error('Error to update user: nickname too long!')
        this.errorMessage = 'Nickname too long bro.'
        return (this.isError = true)
      }

      if (
        this.userEmail === null ||
        this.userEmail === undefined ||
        this.userEmail === ''
      ) {
        console.error('Error to update user: email is empty!')
        this.errorMessage = "Email can't be empty bro."
        return (this.isError = true)
      }

      const userNickname = user?.user_metadata?.nickname
      const userEmail = user?.email
      console.log('Update success on user: ', userNickname)
      console.log('Update success, new email: ', userEmail)
      console.log('User input: ', this.userEmail)
      await this.$store.dispatch('setUserNickname', userNickname)
      this.userNickname = await userNickname
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return (this.isError = false)
    },

    async deleteUser() {
      const authToken = this.$cookies.get('auth.token')
      const supabaseClient = supabase({ token: authToken })

      // get user
      const user = await this.$supabase.auth.user()

      // sign out
      const { error: signOutError } = await this.$supabase.auth.signOut()
      if (signOutError) {
        console.error('Error signing out user!', signOutError.message)
        this.errorMessage = 'Sign Out Error!'
        return (this.isError = true)
      }

      if (user) {
        // delete user's data from other table
        const { error: deleteError } = await this.$supabase
          .from('user_bookmark')
          .delete()
          .eq('user_id', user?.id)

        if (deleteError) {
          console.error('Error deleting data: ', deleteError.message)
          this.errorMessage = 'Error deleting data!'
          return (this.isError = true)
        }
        console.log("User's data deleted successfully")

        const { error: authDeleteError } = await supabaseClient.rpc(
          'delete_user'
        )

        if (authDeleteError) {
          console.error('Error delete user: ', authDeleteError.message)
          this.errorMessage = 'Error deleting user!'
          return (this.isError = true)
        }
        console.log('User deleted successfully')

        this.isError = false
        this.$cookies.remove('auth.token')
        this.$cookies.remove('user.id')
        return this.$router.push('/login')
      } else {
        this.$cookies.remove('auth.token')
        this.$cookies.remove('user.id')
        console.log('User is already signed out.')
        return this.$router.push('/login')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.center {
  margin: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>