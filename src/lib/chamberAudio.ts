import * as Tone from 'tone';
import { SceneMode } from '@/contexts/SceneContext';

const synths: Record<SceneMode, Tone.Synth | null> = {
  hero: null,
  mindcraft: null,
  objects: null,
  doctrine: null,
  circle: null
};

let initialized = false;

export const initChamberAudio = async () => {
  if (initialized) return;
  
  await Tone.start();
  
  // Chamber: Command (deep hum + heartbeat)
  synths.hero = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 2, decay: 0.5, sustain: 0.8, release: 2 }
  }).toDestination();
  synths.hero.volume.value = -30;
  
  // Chamber: Mastery (metallic ticking)
  synths.mindcraft = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
  }).toDestination();
  synths.mindcraft.volume.value = -35;
  
  // Chamber: Presence (echoing chime)
  synths.objects = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.05, decay: 1, sustain: 0.3, release: 2 }
  }).toDestination();
  synths.objects.volume.value = -32;
  
  // Chamber: Wisdom (whispered ambience)
  synths.doctrine = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 3, decay: 1, sustain: 0.6, release: 3 }
  }).toDestination();
  synths.doctrine.volume.value = -40;
  
  // Chamber: Brotherhood (choir bass)
  synths.circle = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 2.5, decay: 0.8, sustain: 0.9, release: 2.5 }
  }).toDestination();
  synths.circle.volume.value = -28;
  
  initialized = true;
};

let currentMode: SceneMode | null = null;
let audioLoop: number | null = null;

export const switchChamberAudio = (mode: SceneMode) => {
  if (currentMode === mode) return;
  currentMode = mode;
  
  // Clear existing loop
  if (audioLoop) {
    clearInterval(audioLoop);
  }
  
  // Stop all synths
  Object.values(synths).forEach(synth => {
    if (synth) {
      synth.triggerRelease();
    }
  });
  
  // Start target chamber audio
  const synth = synths[mode];
  if (!synth) return;
  
  // Different audio patterns for each chamber
  switch (mode) {
    case 'hero':
      // Deep heartbeat pulse
      synth.triggerAttack('C2');
      audioLoop = window.setInterval(() => {
        synth.triggerAttackRelease('C2', '0.5');
      }, 1500);
      break;
      
    case 'mindcraft':
      // Metallic ticking
      audioLoop = window.setInterval(() => {
        synth.triggerAttackRelease('G4', '0.05');
      }, 800);
      break;
      
    case 'objects':
      // Echoing chime
      synth.triggerAttack('A3');
      audioLoop = window.setInterval(() => {
        synth.triggerAttackRelease('A3', '1');
      }, 4000);
      break;
      
    case 'doctrine':
      // Whispered drone
      synth.triggerAttack('E2');
      break;
      
    case 'circle':
      // Choir bass tone
      synth.triggerAttack('F2');
      break;
  }
};

export const stopChamberAudio = () => {
  if (audioLoop) {
    clearInterval(audioLoop);
    audioLoop = null;
  }
  
  Object.values(synths).forEach(synth => {
    if (synth) {
      synth.triggerRelease();
    }
  });
  
  currentMode = null;
};
