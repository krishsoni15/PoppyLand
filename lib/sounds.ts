let toneModule: typeof import('tone') | null = null
let bgLoop: ReturnType<typeof setInterval> | null = null
let bgSynth: InstanceType<typeof import('tone').PolySynth> | null = null
let isBgPlaying = false

const getTone = async () => {
  if (!toneModule) {
    toneModule = await import('tone')
  }
  return toneModule
}

export const setGlobalMute = async (muted: boolean) => {
  const Tone = await getTone()
  Tone.Destination.mute = muted
}

const numberNotes = [
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4',
  'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5',
  'E5', 'F5', 'G5', 'A5',
]

export const playDing = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 },
  }).toDestination()
  synth.triggerAttackRelease('C5', '8n')
  setTimeout(() => synth.dispose(), 1000)
}

export const playSuccess = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.PolySynth(Tone.Synth).toDestination()
  synth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '2n')
  setTimeout(() => synth.dispose(), 2000)
}

export const playWrong = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.1 },
  }).toDestination()
  synth.triggerAttackRelease('A2', '4n')
  setTimeout(() => synth.dispose(), 1000)
}

export const playBigWin = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.PolySynth(Tone.Synth).toDestination()
  synth.triggerAttackRelease(['E4', 'G4', 'B4', 'E5'], '8n')
  setTimeout(() => synth.dispose(), 1500)
}

export const playMegaWin = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.PolySynth(Tone.Synth).toDestination()
  synth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5', 'E5', 'G5'], '4n')
  setTimeout(() => {
    synth.triggerAttackRelease(['C5', 'E5', 'G5', 'C6'], '2n')
    setTimeout(() => synth.dispose(), 2000)
  }, 300)
}

export const playUltraWin = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.PolySynth(Tone.Synth).toDestination()
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
  notes.forEach((n, i) => {
    synth.triggerAttackRelease(n, '16n', Tone.now() + i * 0.08)
  })
  setTimeout(() => synth.dispose(), 2500)
}

export const playStreak = async (level: 3 | 5 | 10, muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.Synth({ oscillator: { type: 'square' } }).toDestination()
  const count = level === 10 ? 5 : level === 5 ? 3 : 2
  for (let i = 0; i < count; i++) {
    synth.triggerAttackRelease('G4', '16n', Tone.now() + i * 0.12)
  }
  setTimeout(() => synth.dispose(), 1200)
}

export const playPop = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
  }).toDestination()
  synth.triggerAttackRelease('C4', '32n')
  setTimeout(() => synth.dispose(), 500)
}

export const playLevelUp = async (muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.PolySynth(Tone.Synth).toDestination()
  synth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n')
  setTimeout(() => {
    synth.triggerAttackRelease(['E4', 'G4', 'B4', 'E5'], '4n')
    setTimeout(() => synth.dispose(), 2000)
  }, 200)
}

export const playNumberNote = async (num: number, muted = false) => {
  if (muted) return
  const Tone = await getTone()
  await Tone.start()
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
  }).toDestination()
  const note = numberNotes[num - 1] ?? 'C4'
  synth.triggerAttackRelease(note, '4n')
  setTimeout(() => synth.dispose(), 1000)
}

/* ───── Background Music ───── */

export type MusicMood = 'default' | 'warm' | 'playful' | 'energetic' | 'dreamy'

const MOOD_NOTES: Record<MusicMood, string[]> = {
  default: ['C4', 'E4', 'G4', 'A4', 'C5'],
  warm: ['C4', 'E4', 'G4', 'A4', 'C5'],
  playful: ['D4', 'F4', 'A4', 'B4', 'D5'],
  energetic: ['E4', 'G4', 'B4', 'C5', 'E5'],
  dreamy: ['C4', 'D4', 'E4', 'G4', 'A4'],
}

const MOOD_TEMPO: Record<MusicMood, { min: number; max: number }> = {
  default: { min: 500, max: 1200 },
  warm: { min: 500, max: 1200 },
  playful: { min: 400, max: 900 },
  energetic: { min: 300, max: 700 },
  dreamy: { min: 800, max: 1600 },
}

let currentMood: MusicMood = 'default'

export const startBackgroundMusic = async (muted = false) => {
  if (muted || isBgPlaying) return
  const Tone = await getTone()
  await Tone.start()

  bgSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.2, release: 0.8 },
  }).toDestination()
  bgSynth.volume.value = -20

  isBgPlaying = true

  const playRandomNote = () => {
    if (!isBgPlaying || !bgSynth) return
    const notes = MOOD_NOTES[currentMood]
    const tempo = MOOD_TEMPO[currentMood]
    const note = notes[Math.floor(Math.random() * notes.length)]
    const duration = 0.3 + Math.random() * 0.5
    bgSynth.triggerAttackRelease(note, duration)

    const nextDelay = tempo.min + Math.random() * (tempo.max - tempo.min)
    bgLoop = setTimeout(playRandomNote, nextDelay)
  }

  playRandomNote()
}

export const stopBackgroundMusic = () => {
  isBgPlaying = false
  if (bgLoop) {
    clearTimeout(bgLoop)
    bgLoop = null
  }
  if (bgSynth) {
    bgSynth.dispose()
    bgSynth = null
  }
}

export const setMusicMood = (mood: MusicMood) => {
  currentMood = mood
}

export const isMusicPlaying = () => isBgPlaying
