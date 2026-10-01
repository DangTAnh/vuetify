<template>
  <ExamplesUsageExample
    v-model="model"
    :code="code"
    :name="name"
    :options="layouts"
  >
    <div>
      <v-audio class="mx-auto" max-width="480" v-bind="props">
        <template v-if="model === 'waveform'" v-slot:progress="{ props: seekProps }">
          <v-audio-waveform v-bind="seekProps" :peaks="peaks"></v-audio-waveform>
        </template>
      </v-audio>
    </div>

    <template v-slot:configuration>
      <v-select v-model="theme" :items="['light', 'dark']" label="Theme" clearable></v-select>
      <v-select v-model="color" :items="colorOptions" label="Color" clearable></v-select>
      <v-select v-model="timeDisplay" :items="timeDisplays" label="Time display" clearable></v-select>
      <v-checkbox v-model="volume" label="Volume"></v-checkbox>
      <v-checkbox v-model="readonly" label="Readonly"></v-checkbox>
    </template>
  </ExamplesUsageExample>
</template>

<script setup>
  const name = 'v-audio'
  const layouts = ['inline', 'waveform']
  const timeDisplays = ['elapsed-duration', 'elapsed', 'remaining', 'duration']

  const model = shallowRef('default')
  const volume = shallowRef(false)
  const readonly = shallowRef(false)
  const theme = shallowRef(null)
  const color = shallowRef(null)
  const timeDisplay = shallowRef(null)

  const colorOptions = [
    'primary',
    'green',
    'cyan',
    'lime-accent-4',
  ]

  const peaks = Array.from({ length: 64 }, (_, i) => 0.2 + 0.7 * Math.abs(Math.sin(i / 4)))

  const props = computed(() => {
    const inline = model.value !== 'default'
    const actions = [inline ? 'play progress time' : 'play', volume.value && '- volume']
      .filter(Boolean)
      .join(' ')

    return {
      theme: theme.value || undefined,
      color: color.value || undefined,
      'time-display': timeDisplay.value || undefined,
      actions: actions === 'play' ? undefined : actions,
      readonly: readonly.value || undefined,
      src: 'https://cdn.freesound.org/previews/871/871092_14978258-lq.mp3',
    }
  })

  const code = computed(() => {
    const attrs = propsToString(props.value)

    if (model.value !== 'waveform') return `<${name}${attrs} />`

    return `<${name}${attrs}>
  <template v-slot:progress="{ props }">
    <v-audio-waveform v-bind="props" :peaks="peaks" />
  </template>
</${name}>`
  })
</script>
