<template>
  <main>
    <h1>Are you lost?</h1>
    <nuxt-link class="@btn @btn-md" to="/">Back to home</nuxt-link>
  </main>
</template>

<script>
export default {
  name: 'PageNotFound',
  layout: 'login',
  middleware: 'login',
}
</script>

<style>
</style>