// Utilities
import { nextTick, onScopeDispose, shallowRef, watch } from 'vue'
import { clamp } from '@/util'

// Types
import type { Ref } from 'vue'

export interface MediaProps {
  src?: string
  srcObject?: MediaProvider | null
  startAt?: number | string
}

export interface MediaOptions<T extends HTMLMediaElement> {
  playing: Ref<boolean>
  progress: Ref<number>
  volume: Ref<number>
  error: Ref<MediaError | boolean | undefined>
  playbackRate?: Ref<number>
  scrubbing?: Ref<boolean>
  onPlay?: () => void
  onLoaded?: (el: T) => void
  onEnded?: () => void
  onError?: (error: MediaError | boolean) => void
}

function toElementVolume (volume: number) {
  return clamp(Number(volume) || 0, 0, 100) / 100
}

export function useMedia<T extends HTMLMediaElement> (
  el: Ref<T | undefined>,
  props: MediaProps,
  options: MediaOptions<T>,
) {
  const { playing, progress, volume, error, playbackRate } = options

  const duration = shallowRef(0)
  const buffered = shallowRef(0)
  const waiting = shallowRef(false)

  let startApplied = false

  function writePosition (seconds: number, total: number) {
    progress.value = Number.isFinite(total) && total > 0
      ? clamp(100 * seconds / total, 0, 100)
      : 0
  }

  function seekTo (seconds: number) {
    const media = el.value
    if (!media) return

    const total = Number.isFinite(media.duration) ? media.duration : 0
    const next = clamp(seconds, 0, total || seconds)

    media.currentTime = next
    writePosition(next, total)
  }

  function skipTo (percent: number) {
    const total = el.value?.duration
    if (!Number.isFinite(total ?? Number.NaN)) return

    seekTo(clamp(percent, 0, 100) / 100 * (total as number))
  }

  function skipBy (seconds: number) {
    const media = el.value
    if (!media) return

    seekTo(media.currentTime + seconds)
  }

  async function play () {
    const media = el.value
    if (!media) return

    options.onPlay?.()

    try {
      await media.play()
    } catch {
      playing.value = false
    }
  }

  function pause () {
    el.value?.pause()
  }

  function stop () {
    const media = el.value
    if (!media) return

    media.pause()
    seekTo(0)
    playing.value = false
  }

  function retry () {
    error.value = false
    el.value?.load()
  }

  function onTimeupdate () {
    const media = el.value
    if (!media || options.scrubbing?.value) return

    writePosition(media.currentTime, media.duration)
  }

  const listeners: Partial<Record<keyof HTMLMediaElementEventMap, () => void>> = {
    loadedmetadata () {
      const media = el.value
      if (!media) return

      duration.value = Number.isFinite(media.duration) ? media.duration : 0

      if (props.startAt != null && !startApplied) {
        startApplied = true
        seekTo(Number(props.startAt) || 0)
      }

      options.onLoaded?.(media)
    },
    timeupdate: onTimeupdate,
    progress () {
      const media = el.value
      if (!media || !Number.isFinite(media.duration) || media.duration <= 0) return

      buffered.value = media.buffered.length ? media.buffered.end(media.buffered.length - 1) : 0
    },
    play () {
      options.onPlay?.()
      playing.value = true
    },
    pause () {
      playing.value = false
      onTimeupdate()
    },
    ended () {
      playing.value = false
      options.onEnded?.()
    },
    error () {
      error.value = el.value?.error ?? true
      waiting.value = false
      options.onError?.(error.value)
    },
    waiting () {
      waiting.value = true
    },
    playing () {
      waiting.value = false
    },
    canplay () {
      waiting.value = false
    },
  }

  watch(el, (media, _, onCleanup) => {
    if (!media) return

    media.volume = toElementVolume(volume.value)
    if (playbackRate) media.defaultPlaybackRate = media.playbackRate = playbackRate.value
    if (props.srcObject) media.srcObject = props.srcObject

    for (const [name, listener] of Object.entries(listeners)) {
      media.addEventListener(name, listener)
    }
    onCleanup(() => {
      for (const [name, listener] of Object.entries(listeners)) {
        media.removeEventListener(name, listener)
      }
    })
  }, { immediate: true })

  watch(playing, value => {
    const media = el.value
    if (!media || value === !media.paused) return

    if (value) play()
    else pause()
  })

  watch(volume, value => {
    if (el.value) el.value.volume = toElementVolume(value)
  })

  watch(() => playbackRate?.value, value => {
    if (el.value && value) el.value.defaultPlaybackRate = el.value.playbackRate = value
  })

  watch(error, value => {
    if (value) el.value?.pause()
  })

  watch(() => props.srcObject, value => {
    if (el.value) el.value.srcObject = value ?? null
  })

  watch([() => props.src, () => props.srcObject], () => {
    duration.value = 0
    buffered.value = 0
    waiting.value = false
    const hadError = !!error.value
    if (hadError) error.value = false
    writePosition(0, 0)

    if (hadError) {
      nextTick(() => el.value?.load())
    }
  })

  onScopeDispose(() => {
    const media = el.value
    if (!media) return

    media.pause()
    media.srcObject = null
  })

  return {
    duration,
    buffered,
    waiting,
    play,
    pause,
    stop,
    seekTo,
    skipTo,
    skipBy,
    retry,
  }
}

export function useMute (volume: Ref<number>) {
  let lastVolume = volume.value || 100

  function toggleMuted () {
    if (volume.value > 0) {
      lastVolume = volume.value
      volume.value = 0
    } else {
      volume.value = lastVolume
    }
  }

  return { toggleMuted }
}

export function getVolumeIcon (volume: number) {
  if (volume > 70) return '$volumeHigh'
  if (volume > 40) return '$volumeMedium'
  if (volume > 10) return '$volumeLow'

  return '$volumeOff'
}
