import * as Tone from 'tone';

let audioInitialized = false;
let backgroundSynth: Tone.Synth | null = null;
let isMuted = false;

export const initAudio = async () => {
  if (audioInitialized) return;
  
  await Tone.start();
  
  // Background low-frequency hum
  backgroundSynth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 2,
      decay: 0,
      sustain: 1,
      release: 2,
    },
  }).toDestination();
  
  backgroundSynth.volume.value = -40; // Very quiet
  
  audioInitialized = true;
};

export const playBackgroundHum = () => {
  if (!backgroundSynth || isMuted) return;
  backgroundSynth.triggerAttack('C1'); // 60Hz low frequency
};

export const stopBackgroundHum = () => {
  if (!backgroundSynth) return;
  backgroundSynth.triggerRelease();
};

export const playModalClick = () => {
  if (isMuted) return;
  
  const synth = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();
  
  synth.volume.value = -20;
  synth.triggerAttackRelease('C5', '32n');
};

export const playShimmerChime = () => {
  if (isMuted) return;
  
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0, release: 0.3 },
  }).toDestination();
  
  synth.volume.value = -25;
  synth.triggerAttackRelease('A5', '8n');
};

export const toggleMute = () => {
  isMuted = !isMuted;
  if (isMuted) {
    stopBackgroundHum();
  }
  return isMuted;
};

export const getMuteState = () => isMuted;

// Metallic chime for link hovers
export const playMetallicChime = () => {
  if (isMuted) return;
  
  const synth = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.15, release: 0.05 },
    harmonicity: 8,
    modulationIndex: 20,
    resonance: 3000,
    octaves: 1.2,
  }).toDestination();
  
  synth.volume.value = -28;
  synth.triggerAttackRelease('G5', '64n');
};
