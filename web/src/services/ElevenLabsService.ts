export class ElevenLabsService {
  private audioContext: AudioContext | null = null;

  async synthesizeSpeech(
    text: string,
    voiceID: string,
    apiKey: string,
    volume: number
  ): Promise<ArrayBuffer> {
    if (!apiKey || !voiceID) {
      throw new Error('API key or Voice ID is missing');
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.arrayBuffer();
  }

  async playAudio(data: ArrayBuffer, volume: number): Promise<void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const audioBuffer = await this.audioContext.decodeAudioData(data);
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = audioBuffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  stopAudio(): void {
    // Web Audio API doesn't have a direct stop method for all sources
    // We'll need to track sources if we want to stop them
    // For now, this is a placeholder
  }

  async previewVoice(
    text: string,
    voiceID: string,
    apiKey: string,
    volume: number
  ): Promise<void> {
    try {
      const data = await this.synthesizeSpeech(text, voiceID, apiKey, volume);
      await this.playAudio(data, volume);
    } catch (error) {
      console.error('Preview error:', error);
      throw error;
    }
  }
}

