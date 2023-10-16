<template>
  <div
    v-if="loading"
    class="h-[200vh] w-full flex justify-center items-center z-[30] fixed bg-slate-300 dark:bg-slate-800 center"
  >
    <div class="loading-container">
      <div class="loading-text">
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
      const html = document.querySelector('html')
      html.scrollTo(0)
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
.loading-container {
  width: 100%;
  max-width: 520px;
  text-align: center;
  color: #fff;
  position: relative;
  margin: 0 32px;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    background-color: #fff;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    animation: movingLine 2.4s infinite ease-in-out;
  }
}

.loading-text {
  font-size: 5vw;
  line-height: 64px;
  letter-spacing: 10px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-evenly;
  span {
    animation: moveLetters 2.4s infinite ease-in-out;
    transform: translatex(0);
    position: relative;
    display: inline-block;
    opacity: 0;
    text-shadow: 0px 2px 10px rgba(46, 74, 81, 0.3);
  }
}

@for $i from 1 through 7 {
  .loading-text span:nth-child(#{$i}) {
    animation-delay: $i * 0.1s;
  }
}
</style>