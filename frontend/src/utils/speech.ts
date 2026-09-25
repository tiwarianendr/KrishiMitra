// Web Speech API interfaces and cross-browser helper

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function createSpeechRecognizer(
  languageCode: string,
  onResult: (transcript: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
): any {
  if (!isSpeechRecognitionSupported()) {
    throw new Error("Speech recognition is not supported in this browser.");
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  recognizer.continuous = false;
  recognizer.interimResults = false;

  // Map app language code to BCP-47 speech tags
  const speechLangMap: Record<string, string> = {
    hi: "hi-IN",
    en: "en-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    pa: "pa-IN",
    gu: "gu-IN",
    ta: "ta-IN",
    te: "te-IN",
    kn: "kn-IN",
    ur: "ur-PK"
  };

  recognizer.lang = speechLangMap[languageCode] || "en-IN";

  recognizer.onresult = (event: any) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    }
  };

  recognizer.onerror = (event: any) => {
    onError(event);
  };

  recognizer.onend = () => {
    onEnd();
  };

  return recognizer;
}

export function speakText(text: string, languageCode: string, onEnd?: () => void) {
  if (!isSpeechSynthesisSupported()) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting characters for natural speech
  const cleanSpeechText = text
    .replace(/[*_#`~]/g, "")
    .replace(/🔍|🌿|🧪|⚠️|🌾|🌱|🛡️/g, "")
    .slice(0, 500); // Speak first 500 characters for concise audio response

  const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
  const speechLangMap: Record<string, string> = {
    hi: "hi-IN",
    en: "en-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    pa: "pa-IN",
    gu: "gu-IN",
    ta: "ta-IN",
    te: "te-IN",
    kn: "kn-IN",
    ur: "ur-PK"
  };
  utterance.lang = speechLangMap[languageCode] || "en-IN";
  utterance.rate = 0.95;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
