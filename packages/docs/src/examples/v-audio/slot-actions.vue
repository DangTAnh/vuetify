<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-6" rounded="xl" width="400">
      <v-audio :src="src" actions="left play right" progress-class="mb-2">
        <template v-slot:left="{ skipBy }">
          <v-icon-btn aria-label="Repeat" icon="mdi-repeat"></v-icon-btn>
          <v-spacer></v-spacer>
          <v-icon-btn aria-label="Add to library" icon="mdi-plus" icon-size="20"></v-icon-btn>
          <v-spacer></v-spacer>
          <v-icon-btn aria-label="Rewind 10 seconds" icon="mdi-rewind" @click="skipBy(-10)"></v-icon-btn>
        </template>

        <template v-slot:play="{ props }">
          <v-icon-btn v-bind="props" icon-size="44"></v-icon-btn>
        </template>

        <template v-slot:right="{ skipBy }">
          <v-icon-btn aria-label="Forward 10 seconds" icon="mdi-fast-forward" @click="skipBy(10)"></v-icon-btn>
          <v-spacer></v-spacer>
          <v-icon-btn aria-label="More actions" icon="mdi-dots-horizontal" icon-size="20"></v-icon-btn>
          <v-spacer></v-spacer>
          <v-icon-btn aria-label="Shuffle" icon="mdi-shuffle"></v-icon-btn>
        </template>
      </v-audio>
    </v-card>
  </v-container>
</template>

<script setup>
  const src = 'https://cdn.freesound.org/previews/871/871092_14978258-lq.mp3'
</script>
