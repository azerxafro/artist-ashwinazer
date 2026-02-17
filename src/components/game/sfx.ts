/**
 * SFX Engine — Web Audio API synthesized sound effects
 * Mutes automatically when Thappu Panniten (premiere) is playing.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.15,
  detune: number = 0
) {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail — audio isn't critical
  }
}

/** Bright rising arpeggio — collectible pickup (+100) */
export function sfxCollect() {
  playTone(880, 0.1, 'sine', 0.12);
  setTimeout(() => playTone(1100, 0.1, 'sine', 0.10), 50);
  setTimeout(() => playTone(1320, 0.15, 'sine', 0.08), 100);
}

/** Quick subtle tick — dodge/pass obstacle (+10) */
export function sfxDodge() {
  playTone(600, 0.06, 'triangle', 0.06);
}

/** Crunch + low rumble — game over */
export function sfxGameOver() {
  playTone(120, 0.4, 'sawtooth', 0.18);
  playTone(80, 0.6, 'square', 0.08, -10);
  setTimeout(() => playTone(60, 0.5, 'sawtooth', 0.12), 100);
}

/** Soft click — lane switch */
export function sfxSwitch() {
  playTone(440, 0.04, 'sine', 0.05);
}

/** Quick blip — game start */
export function sfxStart() {
  playTone(660, 0.08, 'sine', 0.10);
  setTimeout(() => playTone(880, 0.12, 'sine', 0.12), 80);
}

/** Cinematic Splash Sound — "Boom" on entry */
export function sfxSplash() {
  playTone(55, 1.5, 'sine', 0.5);
  setTimeout(() => playTone(110, 0.8, 'triangle', 0.2), 100);
  setTimeout(() => playTone(440, 2.0, 'sine', 0.05), 200);
}
