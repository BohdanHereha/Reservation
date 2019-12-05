<template>
<v-app>

    <body>
        <v-content>
            <nav class="three">
                <br>
                <ul>
                  <li><a href="http://localhost:8080/">Home</a></li>
                  <li><a href="http://localhost:8080/about">About us</a></li>
                  <li><a href="http://localhost:8080/rooms">Rooms</a></li>
                  <li><a href="http://localhost:8080/contact">Contact</a></li>
                </ul>
            </nav>
            <router-view></router-view>
        </v-content>
        <br>
    </body>
</v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};

</script>

<style>

@import url(https://fonts.googleapis.com/css?family=Lora);

body {margin:0;}

ul {
  list-style: none;
  margin: 0 auto;
}
a {
  text-decoration: none;
  font-family: 'Lora', serif;
  transition: .4s linear;
}
i {
  margin-right: 10px;
}
nav {
  display: block;
  width: 65%;
  margin: 0 auto 30px;
}

.three ul {
  padding: 0;
}
.three li {
  display: inline-block;
  width: 24%;
}
.three a {
  padding: 1em;
  display: block;
  color: #74924C;
  border: 6px double black;;
  border-radius: 30px;
  background: #33cc66;
  text-align:  center;
  font-size: 16pt;
}
.three a:hover {background: #FB8A1A}

</style>
