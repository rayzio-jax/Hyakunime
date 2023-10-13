<template>
  <main class="border h-[100vh] flex flex-col justify-center items-center">
    <p v-if="!isVerified" @click="warnVerify">Verify your password again!</p>
    <h2>Set your new password</h2>
    <form
      class="flex flex-col max-w-md justify-center items-center border"
      @submit.prevent="updatePassword"
    >
      <div class="flex flex-col">
        <label for="newPassword">New Password</label>
        <input
          id="newPassword"
          v-model="newPassword"
          type="newPassword"
          name="newPassword"
        />
      </div>
      <div class="flex flex-col">
        <label for="verifyNewPassword">Verify New Password</label>
        <input
          id="verifyNewPassword"
          v-model="verifyNewPassword"
          type="verifyNewPassword"
          name="verifyNewPassword"
        />
      </div>
      <button type="submit" class="@btn @btn-md">Update</button>
    </form>
  </main>
</template>

<script>
export default {
  layout: 'login',
  middleware: 'login',
  data() {
    return {
      newPassword: '',
      verifyNewPassword: '',
      isVerified: true,
    }
  },
  methods: {
    warnVerify() {},

    async updatePassword() {
      if (this.newPassword !== this.verifyNewPassword) {
        return { isVerified: false }
      }
      this.isVerified = true
      const { data, error } = await this.$supabase.auth.update({
        password: this.newPassword,
      })

      if (error) {
        return alert(error.message)
      }

      this.$store.dispatch('isResetPassword', false)
      console.log('Sent update password')
      console.log(data)
    },
  },
}
</script>

<style>
</style>