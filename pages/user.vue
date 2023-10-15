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
              : '',
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
            <div class="py-3">
              <button
                type="button"
                class="w-full @btn @btn-md @btn-warning hover:bg-[#e4a900] hover:text-white focus:focus-within:bg-[#e4a900] focus:focus-within:text-white focus:focus-within:border-2 focus:focus-within:border-[#fff] dark:@btn-outline dark:focus:focus-within:bg-warning dark:focus:focus-within:text-slate-800"
                @click="deleteUser"
              >
                Delete User?
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
      currentEmail: '',
      isUpdating: false,
      user: null,
      session: null,
      isError: false,
      errorMessage: 'Error occurred',
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
    this.currentNickname = this.$store.state.userNickname
    this.userEmail = userEmail
    this.currentEmail = userEmail
  },

  methods: {
    async resetUser() {
      const userNickname = await this.user?.user_metadata?.nickname
      const userEmail = await this.user?.email

      this.userEmail = userEmail
      this.userNickname = userNickname
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

      const userNickname = user?.user_metadata?.nickname
      console.log('Update success on user: ', userNickname)
      await this.$store.dispatch('setUserNickname', userNickname)
      this.userNickname = await userNickname
      window.location.reload()
      return (this.isError = false)
    },

    async deleteUser() {
      const supabaseAdmin = supabase({ key: 'admin' })

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

        const userId = user?.id
        const { error: authDeleteError } =
          supabaseAdmin.auth.api.deleteUser(userId)

        if (authDeleteError) {
          console.error('Error delete user: ', authDeleteError.message)
          this.errorMessage = 'Error deleting user!'
          return (this.isError = true)
        }

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