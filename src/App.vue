<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "yrdz";
}
* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

img {
  vertical-align: top;
  border: none;
}

@font-face {
  font-family: "yrdz";
  src: url("/dist/static/font/yrdz.woff") format("woff"),
    url("/dist/static/font/yrdz.ttf") format("truetype"),
    url("/dist/static/font/yrdz.eot") format("embedded-opentype"),
    url("/dist/static/font/yrdz.svg") format("svg");
}
</style>
