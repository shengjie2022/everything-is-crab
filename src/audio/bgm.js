/**
 * Background music generator.
 * Creates a looping ambient track using oscillators and scheduled note changes.
 *
 * Day mode  – gentle pentatonic (C, D, E, G, A) with major feel
 * Night mode – minor/diminished ambient drone (C, Eb, Gb, A)
 *
 * Returns { stop(), _night: boolean }
 */

// Frequency helpers (octave 3 base)
const NOTE = {
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81,
  Gb3: 185.00, G3: 196.00, A3: 220.00,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63,
  Gb4: 369.99, G4: 392.00, A4: 440.00
};

export function createBgm(ctx, dest, mode) {
  const isNight = (mode === 'night');
  let stopped = false;
  let intervalId = null;

  // ── 1. Bass drone (sine, very quiet) ──
  const bass = ctx.createOscillator();
  bass.type = 'sine';
  bass.frequency.value = isNight ? NOTE.C3 : NOTE.C3;

  const bassGain = ctx.createGain();
  bassGain.gain.value = 0.12;

  bass.connect(bassGain);
  bassGain.connect(dest);
  bass.start();

  // ── 2. Pad (triangle, two-note chord) ──
  const pad1 = ctx.createOscillator();
  pad1.type = 'triangle';

  const pad2 = ctx.createOscillator();
  pad2.type = 'triangle';

  const padGain = ctx.createGain();
  padGain.gain.value = 0.08;

  pad1.connect(padGain);
  pad2.connect(padGain);
  padGain.connect(dest);

  // Initial chord
  if (isNight) {
    pad1.frequency.value = NOTE.C4;
    pad2.frequency.value = NOTE.Eb4;
  } else {
    pad1.frequency.value = NOTE.C4;
    pad2.frequency.value = NOTE.E4;
  }

  pad1.start();
  pad2.start();

  // ── 3. Subtle melody oscillator (sine, very quiet) ──
  const melody = ctx.createOscillator();
  melody.type = 'sine';
  melody.frequency.value = isNight ? NOTE.C4 : NOTE.E4;

  const melodyGain = ctx.createGain();
  melodyGain.gain.value = 0.05;

  melody.connect(melodyGain);
  melodyGain.connect(dest);
  melody.start();

  // ── Chord / note progression ──
  const dayChords = [
    { bass: NOTE.C3, p1: NOTE.C4, p2: NOTE.E4,  mel: NOTE.G4 },
    { bass: NOTE.A3, p1: NOTE.A3, p2: NOTE.C4,  mel: NOTE.E4 },
    { bass: NOTE.G3, p1: NOTE.G3, p2: NOTE.D4,  mel: NOTE.G4 },
    { bass: NOTE.C3, p1: NOTE.C4, p2: NOTE.G4,  mel: NOTE.A4 }
  ];

  const nightChords = [
    { bass: NOTE.C3,  p1: NOTE.C4,  p2: NOTE.Eb4, mel: NOTE.Gb4 },
    { bass: NOTE.Gb3, p1: NOTE.Gb3, p2: NOTE.A3,  mel: NOTE.Eb4 },
    { bass: NOTE.Eb3, p1: NOTE.Eb4, p2: NOTE.Gb4, mel: NOTE.A4  },
    { bass: NOTE.C3,  p1: NOTE.C4,  p2: NOTE.Gb4, mel: NOTE.C4  }
  ];

  const chords = isNight ? nightChords : dayChords;
  let chordIndex = 0;

  function nextChord() {
    if (stopped) return;
    chordIndex = (chordIndex + 1) % chords.length;
    const ch = chords[chordIndex];
    const t = ctx.currentTime;
    const glide = 1.0; // 1-second glide between chords

    bass.frequency.linearRampToValueAtTime(ch.bass, t + glide);
    pad1.frequency.linearRampToValueAtTime(ch.p1, t + glide);
    pad2.frequency.linearRampToValueAtTime(ch.p2, t + glide);
    melody.frequency.linearRampToValueAtTime(ch.mel, t + glide);
  }

  // Cycle chords every ~2.5 seconds
  intervalId = setInterval(nextChord, 2500);

  // ── Controller object ──
  const controller = {
    _night: isNight,

    stop() {
      if (stopped) return;
      stopped = true;

      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }

      const t = ctx.currentTime;
      const fadeOut = 0.3;

      // Fade out all gains then stop oscillators
      bassGain.gain.linearRampToValueAtTime(0, t + fadeOut);
      padGain.gain.linearRampToValueAtTime(0, t + fadeOut);
      melodyGain.gain.linearRampToValueAtTime(0, t + fadeOut);

      const stopTime = t + fadeOut + 0.05;
      try { bass.stop(stopTime); } catch (e) { /* ignore */ }
      try { pad1.stop(stopTime); } catch (e) { /* ignore */ }
      try { pad2.stop(stopTime); } catch (e) { /* ignore */ }
      try { melody.stop(stopTime); } catch (e) { /* ignore */ }
    }
  };

  return controller;
}
