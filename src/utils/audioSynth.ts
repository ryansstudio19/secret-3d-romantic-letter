export interface TrackInfo {
  id: number | string;
  title: string;
  artist: string;
  src: string;
  isSynth?: boolean;
}

export const PRESET_TRACKS: TrackInfo[] = [
  {
    id: 0,
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    src: 'https://ia601606.us.archive.org/7/items/ErikSatieGymnopdieNo.1/Erik%20Satie%20-%20Gymnop%C3%A9die%20No.1.mp3'
  },
  {
    id: 1,
    title: 'Nocturne Op. 9 No. 2',
    artist: 'Frédéric Chopin',
    src: 'https://ia800201.us.archive.org/12/items/ChopinNocturneOp.9No.2InE-flatMajor/Chopin%20-%20Nocturne%20Op.%209%20No.%202%20in%20E-flat%20major.mp3'
  },
  {
    id: 'synth',
    title: 'Romantic Harp & Piano',
    artist: 'Web Audio Synthesizer',
    src: '',
    isSynth: true
  }
];

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private useSynthFallback = false;
  private noteStep = 0;
  private listeners: Set<() => void> = new Set();

  private currentTrackIdx = 0;
  private customTrackUrl = '';

  // Lush romantic chord progressions (Fmaj7 - Cmaj9 - Am9 - Gadd9)
  private chordProgression = [
    { bass: 174.61, chord: [261.63, 329.63, 440.00, 523.25], melody: [659.25, 523.25, 440.00, 329.63] },
    { bass: 130.81, chord: [246.94, 293.66, 329.63, 392.00], melody: [587.33, 493.88, 392.00, 329.63] },
    { bass: 110.00, chord: [196.00, 246.94, 261.63, 329.63], melody: [523.25, 440.00, 329.63, 261.63] },
    { bass: 98.00,  chord: [220.00, 246.94, 293.66, 392.00], melody: [493.88, 392.00, 293.66, 246.94] }
  ];

  constructor() {
    try {
      const savedCustom = localStorage.getItem('custom_romantic_song');
      if (savedCustom) {
        this.customTrackUrl = savedCustom;
      }
    } catch {
      // ignore
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    listener();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  public getCurrentTrack(): TrackInfo {
    if (this.customTrackUrl) {
      return {
        id: 'custom',
        title: 'Custom Romantic Song',
        artist: 'User Selected Audio',
        src: this.customTrackUrl
      };
    }
    if (this.useSynthFallback) {
      const synthTrack = PRESET_TRACKS.find(t => t.isSynth);
      if (synthTrack) return synthTrack;
    }
    return PRESET_TRACKS[this.currentTrackIdx] || PRESET_TRACKS[0];
  }

  public getCustomUrl(): string {
    return this.customTrackUrl;
  }

  public setCustomUrl(url: string) {
    this.customTrackUrl = url.trim();
    try {
      if (this.customTrackUrl) {
        localStorage.setItem('custom_romantic_song', this.customTrackUrl);
      } else {
        localStorage.removeItem('custom_romantic_song');
      }
    } catch {
      // ignore
    }

    const wasPlaying = this.isPlaying;
    this.stop();
    this.useSynthFallback = false;
    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public setTrackIndex(idx: number) {
    this.customTrackUrl = '';
    try {
      localStorage.removeItem('custom_romantic_song');
    } catch {
      // ignore
    }

    this.currentTrackIdx = (idx + PRESET_TRACKS.length) % PRESET_TRACKS.length;
    const track = PRESET_TRACKS[this.currentTrackIdx];

    const wasPlaying = this.isPlaying;
    this.stop();

    if (track.isSynth) {
      this.useSynthFallback = true;
    } else {
      this.useSynthFallback = false;
    }

    if (wasPlaying) {
      this.start();
    } else {
      this.notify();
    }
  }

  public nextTrack() {
    this.setTrackIndex(this.currentTrackIdx + 1);
  }

  public prevTrack() {
    this.setTrackIndex(this.currentTrackIdx - 1);
  }

  public init() {
    if (this.audioElement) return;

    this.setupAudioElement();

    // Pre-initialize Web Audio synth fallback context
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      const delay = this.ctx.createDelay();
      delay.delayTime.value = 0.4;
      const feedback = this.ctx.createGain();
      feedback.gain.value = 0.35;

      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.masterGain);

      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Ignore audio context errors
    }
  }

  private setupAudioElement() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    const current = this.getCurrentTrack();
    if (current.isSynth || !current.src) return;

    this.audioElement = new Audio(current.src);
    this.audioElement.loop = true; // Crucial for infinite looping
    this.audioElement.volume = 0.5;

    // Guarantee infinite looping: if ended event fires, replay immediately
    this.audioElement.addEventListener('ended', () => {
      if (this.isPlaying && this.audioElement) {
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(() => {});
      }
    });

    this.audioElement.addEventListener('error', () => {
      // Fallback if custom or preset source fails
      if (!this.useSynthFallback) {
        this.useSynthFallback = true;
        if (this.isPlaying) {
          this.startSynthEngine();
        }
        this.notify();
      }
    });
  }

  public toggle(): boolean {
    this.init();

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.init();
    this.isPlaying = true;
    this.notify();

    const current = this.getCurrentTrack();

    if (current.isSynth || this.useSynthFallback || !current.src) {
      this.startSynthEngine();
      return;
    }

    if (!this.audioElement) {
      this.setupAudioElement();
    }

    if (this.audioElement) {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.notify();
        }).catch(() => {
          this.useSynthFallback = true;
          this.startSynthEngine();
          this.notify();
        });
      }
    } else {
      this.startSynthEngine();
    }
  }

  private startSynthEngine() {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const playPattern = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const chordIdx = Math.floor(this.noteStep / 4) % this.chordProgression.length;
      const subStep = this.noteStep % 4;
      const current = this.chordProgression[chordIdx];

      const now = this.ctx.currentTime;

      // 1. Play warm bass note on step 0
      if (subStep === 0) {
        this.triggerPianoNote(current.bass, 0.3, 4.5, 'sine', 300);
      }

      // 2. Play arpeggiated middle chord note
      const chordNote = current.chord[subStep % current.chord.length];
      this.triggerPianoNote(chordNote, 0.18, 3.2, 'triangle', 1200);

      // 3. Play shimmering high melody/harp note
      const melodyNote = current.melody[(subStep + Math.floor(Math.random() * 2)) % current.melody.length];
      this.triggerPianoNote(melodyNote, 0.12, 2.5, 'sine', 2000);

      this.noteStep++;

      // Gentle rhythmic interval (~750ms for slow romantic tempo)
      const interval = 750 + Math.random() * 150;
      this.timerId = window.setTimeout(playPattern, interval);
    };

    playPattern();
  }

  private triggerPianoNote(freq: number, volume: number, duration: number, waveType: OscillatorType, filterFreq: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(volume, now + 0.08); // gentle soft piano key touch
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  public playPaperRustle() {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtxClass();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const duration = 0.35;

      // 1. Noise buffer for crisp paper friction texture
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Bandpass filter to isolate paper frequency (1200Hz - 3200Hz)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(2200, now);
      bandpass.Q.setValueAtTime(1.2, now);

      // Highpass to remove low muddy rumbles from noise
      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(800, now);

      // Dynamic Volume Envelope (swell up then fade)
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.08); // attack
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // decay

      whiteNoise.connect(bandpass);
      bandpass.connect(highpass);
      highpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);

      // 2. Soft air swoosh for page movement weight
      const swooshOsc = this.ctx.createOscillator();
      const swooshGain = this.ctx.createGain();
      const swooshFilter = this.ctx.createBiquadFilter();

      swooshOsc.type = 'sine';
      swooshOsc.frequency.setValueAtTime(180, now);
      swooshOsc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      swooshFilter.type = 'lowpass';
      swooshFilter.frequency.setValueAtTime(300, now);

      swooshGain.gain.setValueAtTime(0.001, now);
      swooshGain.gain.linearRampToValueAtTime(0.08, now + 0.06);
      swooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      swooshOsc.connect(swooshFilter);
      swooshFilter.connect(swooshGain);
      swooshGain.connect(this.ctx.destination);

      swooshOsc.start(now);
      swooshOsc.stop(now + 0.3);
    } catch {
      // ignore audio context restrictions
    }
  }

  public stop() {
    this.isPlaying = false;
    this.notify();
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticAudioEngine();
export const playPaperRustleSound = () => romanticAudio.playPaperRustle();
