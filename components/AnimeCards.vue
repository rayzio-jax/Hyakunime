<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <!-- showing anime -->
    <anime-item
      v-for="(anime, index) in animeData"
      :key="index"
      :anime="anime"
      class="m-3"
    />
  </div>
</template>

<script>
import AnimeItem from './AnimeItem.vue'
export default {
  components: {
    AnimeItem,
  },
  props: {
    animeData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
}
</script>

<style>
</style>