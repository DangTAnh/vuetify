<template>
  <v-container max-width="560">
    <v-audio :src="src" actions="play progress time">
      <template v-slot:append>
        <v-icon-btn
          :href="src"
          aria-label="Download"
          icon="mdi-download"
          tag="a"
          variant="text"
          download
        ></v-icon-btn>
      </template>
    </v-audio>
  </v-container>
</template>

<script setup>
  const src = 'https://cdn.freesound.org/previews/871/871092_14978258-lq.mp3'
</script>
