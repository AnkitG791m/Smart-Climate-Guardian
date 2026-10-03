// Cross-browser speech synthesis (Text-to-Speech) and recognition (Voice Mode)

type SpeechCallback = (text: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis || null;

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        null;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  // --- 1. VOICE MODE (SPEECH TO TEXT) ---
  public isVoiceInputSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    lang: 'en' | 'hi' = 'en',
    onResult: SpeechCallback,
    onError?: ErrorCallback
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      console.warn('Speech recognition error:', event.error);
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      this.isListening = false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // --- 2. SPEAK MODE (TEXT TO SPEECH) ---
  public isTextToSpeechSupported(): boolean {
    return this.synth !== null;
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (!this.synth) return;

    this.stopSpeaking();

    // Clean markdown characters for clean speech synthesis
    const cleanText = text
      .replace(/[*#_`~>[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Detect if text is predominantly Hindi
    const isHindi = /[\u0900-\u097F]/.test(cleanText);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick appropriate voice if loaded
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const match = voices.find(
        (v) =>
          (isHindi && v.lang.includes('hi')) ||
          (!isHindi && (v.lang === 'en-IN' || v.lang === 'en-GB' || v.lang === 'en-US'))
      );
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechService();
