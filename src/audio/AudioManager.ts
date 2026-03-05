export class AudioManager {
  private static instance: AudioManager | null = null;

  private ctx: AudioContext | null = null;
  private spaceGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;
  private _muted = true;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  get muted(): boolean {
    return this._muted;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0; // Start muted
    this.masterGain.connect(this.ctx.destination);

    this.spaceGain = this.ctx.createGain();
    this.spaceGain.gain.value = 1.0;
    this.spaceGain.connect(this.masterGain);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.0;
    this.windGain.connect(this.masterGain);

    await Promise.all([
      this.loadLoop('/audio/space-hum.m4a', this.spaceGain),
      this.loadLoop('/audio/atmospheric-wind.m4a', this.windGain),
    ]);

    this.initialized = true;
  }

  private async loadLoop(url: string, destination: GainNode): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx!.decodeAudioData(arrayBuffer);

      const source = this.ctx!.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      source.connect(destination);
      source.start(0);
    } catch (e) {
      console.warn(`Failed to load audio: ${url}`, e);
    }
  }

  toggleMute(): boolean {
    this._muted = !this._muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this._muted ? 0 : 0.3,
        this.ctx.currentTime,
        0.3
      );
    }
    return this._muted;
  }

  // zoomFactor: 0 = far (globe view), 1 = close (zoomed in)
  updateZoom(zoomFactor: number): void {
    if (!this.ctx || !this.spaceGain || !this.windGain) return;
    const t = this.ctx.currentTime;
    this.spaceGain.gain.setTargetAtTime(1.0 - zoomFactor, t, 0.5);
    this.windGain.gain.setTargetAtTime(zoomFactor, t, 0.5);
  }
}
