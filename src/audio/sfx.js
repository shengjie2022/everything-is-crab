/**
 * Procedurally generated sound effects using Web Audio API oscillators.
 * Each sfx is a factory that returns a play-function(ctx, dest).
 * Every play-function is self-contained: creates nodes, schedules, and auto-disconnects.
 */

export function createSfx(_ctx) {
  return {

    // ── attack: short white-noise burst, 50 ms ──
    attack: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.05;
      const bufSize = ctx.sampleRate * dur;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buf;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.linearRampToValueAtTime(0, t + dur);

      noise.connect(gain);
      gain.connect(dest);
      noise.start(t);
      noise.stop(t + dur);
    },

    // ── hit: low-freq impact, sine 80 Hz, 100 ms quick decay ──
    hit: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.1;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + dur);
    },

    // ── hurt: descending tone 400 -> 200 Hz, 150 ms ──
    hurt: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.15;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.linearRampToValueAtTime(200, t + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0, t + dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + dur);
    },

    // ── dash: whoosh – filtered noise sweep, 200 ms ──
    dash: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.2;
      const bufSize = ctx.sampleRate * dur;
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, t);
      filter.frequency.linearRampToValueAtTime(4000, t + dur * 0.3);
      filter.frequency.linearRampToValueAtTime(500, t + dur);
      filter.Q.value = 2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0, t + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      noise.start(t);
      noise.stop(t + dur);
    },

    // ── jump: ascending chirp 200 -> 600 Hz, 100 ms ──
    jump: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.1;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0, t + dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + dur);
    },

    // ── devour: gulp – low sine 100 -> 50 Hz, 300 ms, gain envelope ──
    devour: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.3;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.02);
      gain.gain.setValueAtTime(0.5, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + dur);
    },

    // ── evolve: sparkle arpeggio C5-E5-G5, each note 80 ms ──
    evolve: (ctx, dest) => {
      const t = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      const noteDur = 0.08;

      notes.forEach((freq, i) => {
        const start = t + i * noteDur;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + noteDur * 1.5);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(start);
        osc.stop(start + noteDur * 1.5);
      });
    },

    // ── crab: special deep resonant tone + crackle ──
    crab: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.4;

      // Deep resonant tone
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(65, t);
      osc.frequency.linearRampToValueAtTime(55, t + dur);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.4, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(oscGain);
      oscGain.connect(dest);
      osc.start(t);
      osc.stop(t + dur);

      // Crackle: very short noise bursts
      for (let i = 0; i < 5; i++) {
        const bStart = t + i * 0.06 + 0.02;
        const bDur = 0.015;
        const bufSize = Math.max(1, Math.floor(ctx.sampleRate * bDur));
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let j = 0; j < bufSize; j++) data[j] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buf;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.15, bStart);
        g.gain.linearRampToValueAtTime(0, bStart + bDur);

        noise.connect(g);
        g.connect(dest);
        noise.start(bStart);
        noise.stop(bStart + bDur);
      }
    },

    // ── boss: ominous low drone 50 Hz + rumble, 500 ms ──
    boss: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.5;

      // Low drone
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 50;

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.value = 51; // slight detune for beating

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.linearRampToValueAtTime(0.45, t + dur * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(dest);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + dur);
      osc2.stop(t + dur);
    },

    // ── pickup: small ding, high sine 800 Hz, 50 ms ──
    pickup: (ctx, dest) => {
      const t = ctx.currentTime;
      const dur = 0.08;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + dur);
    }
  };
}
