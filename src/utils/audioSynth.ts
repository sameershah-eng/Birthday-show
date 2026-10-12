// Web Audio API ambient synthesizer for cinematic show preview and countdown cues

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private volume = 0.4;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Play countdown click / chime
  public playCountdownTick(count: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = count === 1 ? 880 : 440 + (5 - count) * 60;
      osc.type = count === 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (count === 1 ? 0.8 : 0.25));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + (count === 1 ? 0.85 : 0.3));
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  // Play warm chime for birthday fanfare / slide transition
  public playCelebrationChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 1.0);
      });
    } catch {
      // audio error handled gracefully
    }
  }

  // Start continuous ambient piano arpeggio loop for show preview
  public startAmbientSoundtrack() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.initCtx();

    // Pentatonic scale frequencies for warm soothing music
    const chordProgression = [
      [261.63, 329.63, 392.00, 523.25], // C major
      [220.00, 261.63, 329.63, 440.00], // A minor
      [174.61, 220.00, 261.63, 349.23], // F major
      [196.00, 246.94, 293.66, 392.00], // G major
    ];

    let chordIdx = 0;
    let step = 0;

    const playNote = () => {
      if (!this.isMusicPlaying || !this.ctx || this.isMuted) return;

      try {
        const chord = chordProgression[chordIdx];
        const noteFreq = chord[step % chord.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

        const currentVol = this.volume * 0.22;
        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(currentVol, this.ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.25);

        step++;
        if (step % 8 === 0) {
          chordIdx = (chordIdx + 1) % chordProgression.length;
        }
      } catch {
        // audio error ignored
      }
    };

    // schedule gentle steps every 400ms
    playNote();
    this.musicInterval = window.setInterval(playNote, 420);
  }

  public stopAmbientSoundtrack() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundEngine = new SoundEngine();
