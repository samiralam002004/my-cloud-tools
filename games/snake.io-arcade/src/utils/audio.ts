class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction to satisfy browser policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMutedState() {
    return this.isMuted;
  }

  public playEat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Small bubble pop: rapid pitch sweep up
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playBoost() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Short low swoosh / rumble for boosting
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playKill() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Triumphant double chime: chord
    const now = this.ctx.currentTime;
    
    // Low chime
    this.createChime(440, 0.25, 0.08);
    // High chime, slightly delayed
    setTimeout(() => {
      this.createChime(659.25, 0.3, 0.08); // E5
    }, 80);
    setTimeout(() => {
      this.createChime(880, 0.4, 0.1); // A5
    }, 160);
  }

  private createChime(freq: number, duration: number, volume: number) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playDeath() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Exploding noise-like sound: sweep down, low pitch, fuzzy
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.5);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(90, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.4);

    gain1.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

    gain2.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    
    osc1.stop(this.ctx.currentTime + 0.5);
    osc2.stop(this.ctx.currentTime + 0.4);
  }

  public playStart() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Upward sweep chord
    this.createChime(261.63, 0.4, 0.08); // C4
    setTimeout(() => this.createChime(329.63, 0.4, 0.08), 100); // E4
    setTimeout(() => this.createChime(392.00, 0.4, 0.08), 200); // G4
    setTimeout(() => this.createChime(523.25, 0.6, 0.1), 300); // C5
  }
}

export const audio = new SoundManager();
