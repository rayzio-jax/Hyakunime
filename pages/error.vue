<template>
  <main class="h-[100vh] flex flex-col gap-y-4 justify-center items-center">
    <h2>{{ errorMessage || 'Error occurred' }}</h2>
    <button class="@btn @btn-lg" @click="gotoHome">Back to home</button>
  </main>
</template>

<script>
export default {
  name: 'GenericErrorPage',
  layout: 'errors',

  computed: {
    displayMessage() {
      return this.$store.state.errorMessage
    },
  },

  methods: {
    gotoHome() {
      try {
        this.$router.push('/')
      } catch (error) {
        console.error('Router navigation error: ', error)
      }
    },
  },
}
</script>

<style>
</style>