<template>
  <v-container max-width="720">
    <v-audio
      :src="src"
      actions="prev play next progress rate restart"
      actions-class="ga-1"
      class="py-3 px-2 border"
    >
      <template v-slot:prev>
        <v-icon-btn aria-label="Previous" icon="mdi-skip-previous"></v-icon-btn>
      </template>

      <template v-slot:play="{ props }">
        <v-icon-btn v-bind="props" color="primary" size="36" variant="flat"></v-icon-btn>
      </template>

      <template v-slot:next>
        <v-icon-btn aria-label="Next" icon="mdi-skip-next"></v-icon-btn>
      </template>

      <template v-slot:progress="{ progress, skipTo, currentTime, duration }">
        <div class="d-flex align-center ga-3 flex-grow-1 mx-1">
          <v-avatar size="44" style="background: linear-gradient(135deg, #673ab7, #00e676)" rounded></v-avatar>
          <div class="d-flex flex-column flex-grow-1">
            <div class="text-title-small font-weight-medium pb-1" dir="auto">Audio Title 01</div>
            <div class="d-flex align-center ga-2 text-body-small">
              {{ currentTime.elapsed }}
              <v-locale-provider :rtl="false">
                <v-slider
                  :disabled="!duration"
                  :model-value="progress"
                  :step="0.1"
                  aria-label="Seek"
                  thumb-size="12"
                  track-size="2"
                  hide-details
                  @update:model-value="skipTo"
                ></v-slider>
              </v-locale-provider>
              {{ currentTime.total }}
            </div>
          </div>
        </div>
      </template>

      <template v-slot:rate="{ playbackRate, setPlaybackRate }">
        <v-chip
          :text="`${playbackRate}x`"
          aria-label="Toggle playback speed"
          size="small"
          variant="tonal"
          label
          @click="setPlaybackRate(playbackRate >= 2 ? 1 : playbackRate + 0.5)"
        ></v-chip>
      </template>

      <template v-slot:restart="{ skipTo }">
        <v-icon-btn aria-label="Restart" icon="mdi-restart" @click="skipTo(0)"></v-icon-btn>
      </template>
    </v-audio>
  </v-container>
</template>

<script setup>
  const src = 'https://cdn.freesound.org/previews/871/871092_14978258-lq.mp3'
</script>
