<template>
  <footer id="footer" class="@footer p-10 bg-primary-focus text-white">
    <aside>
      <img
        src="~/assets/image/hyakunime.png"
        alt="hyakunime-banner"
        class="object-cover min-w-0 w-[400px] h-full md:h-[70px] md:max-w-max md:min-w-max"
      />
      <p>hyakuNime ( 百ニメ )</p>
      <p>All rights reserved &copy; Copyright 2023.</p>
    </aside>
    <nav>
      <header>Creator</header>
      <a href="https://github.com/rayzio-jax" target="_blank">rayziojax</a>
      <p>*with many supports from mentor and "friends"</p>
    </nav>
    <nav>
      <header>About hyakuNime</header>
      <p>
        hyakuNime is an anime bookmarker, for now it's functionality is just to
        book an anime. For later, I'm still developing it further with many
        features later.
      </p>
    </nav>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
}
</script>