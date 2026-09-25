import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  CornerDownRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { 
  createSpeechRecognizer, 
  isSpeechRecognitionSupported, 
  isSpeechSynthesisSupported, 
  speakText, 
  stopSpeaking 
} from "../utils/speech";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  source?: string;
}

export const AssistantPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => {
    return localStorage.getItem("krishimitra_assistant_session") || `kisan_${Date.now()}`;
  });

  // Voice states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null); // message ID being spoken
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognizerRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize session and greeting
  useEffect(() => {
    localStorage.setItem("krishimitra_assistant_session", sessionId);
    
    // Check if session messages exist on server or set default welcome
    const fetchHistory = async () => {
      try {
        const res = await api.getAssistantHistory(sessionId);
        if (res.data?.messages && res.data.messages.length > 0) {
          setMessages(
            res.data.messages.map((m: any) => ({
              id: `msg_${m.id}`,
              sender: m.role,
              text: m.content,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }))
          );
        } else {
          setMessages([
            {
              id: "welcome",
              sender: "assistant",
              text: t.assistant.welcomeMsg,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              source: "KrishiMitra Agronomy System"
            }
          ]);
        }
      } catch {
        setMessages([
          {
            id: "welcome",
            sender: "assistant",
            text: t.assistant.welcomeMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }
    };

    fetchHistory();

    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch {}
      }
    };
  }, [sessionId, t.assistant.welcomeMsg]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!query || isLoading) return;

    stopSpeaking();
    setIsSpeaking(null);

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setSpeechError(null);

    try {
      const res = await api.sendAssistantMessage(query, sessionId, language);
      if (res.data) {
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: "assistant",
          text: res.data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: res.data.source
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: "assistant",
        text: "I encountered an issue connecting to the agricultural server. Please verify your internet connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    try {
      const recognizer = createSpeechRecognizer(
        language,
        (transcript) => {
          setIsListening(false);
          setInputText(transcript);
          // Automatically submit voice query
          handleSendMessage(transcript);
        },
        (err) => {
          setIsListening(false);
          if (err.error === "not-allowed") {
            setSpeechError(t.assistant.micPermissionError);
          } else {
            setSpeechError(`Voice input issue: ${err.error || "Please speak clearly into your mic."}`);
          }
        },
        () => {
          setIsListening(false);
        }
      );
      recognizerRef.current = recognizer;
      recognizer.start();
      setIsListening(true);
    } catch (err: any) {
      setSpeechError(err.message || "Failed to initialize microphone.");
      setIsListening(false);
    }
  };

  const handleSpeakResponse = (messageId: string, text: string) => {
    if (isSpeaking === messageId) {
      stopSpeaking();
      setIsSpeaking(null);
      return;
    }

    stopSpeaking();
    setIsSpeaking(messageId);
    speakText(text, language, () => {
      setIsSpeaking(null);
    });
  };

  const handleClearChat = async () => {
    try {
      await api.clearAssistantHistory(sessionId);
    } catch {}
    setMessages([
      {
        id: "welcome_new",
        sender: "assistant",
        text: t.assistant.welcomeMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    stopSpeaking();
    setIsSpeaking(null);
  };

  const sampleQuestions = [
    t.assistant.q1,
    t.assistant.q2,
    t.assistant.q3,
    t.assistant.q4
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {t.assistant.title}
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                {t.assistant.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:text-rose-600 hover:border-rose-300 text-xs font-semibold transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.assistant.clearChat}</span>
          </button>
        </div>
      </div>

      {/* Sample Question Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
          {t.assistant.sampleQuestionsTitle}
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-left text-xs px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? "bg-stone-50 border border-stone-200 text-stone-800"
                      : "bg-emerald-600 text-white rounded-tr-xs shadow-xs"
                  }`}
                >
                  {/* Message body formatted */}
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Message footer & Voice TTS playback button */}
                  <div
                    className={`mt-2.5 pt-2 flex items-center justify-between text-[10px] border-t ${
                      isBot ? "border-stone-200 text-stone-400" : "border-emerald-500 text-emerald-100"
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {isBot && isSpeechSynthesisSupported() && (
                      <button
                        type="button"
                        onClick={() => handleSpeakResponse(msg.id, msg.text)}
                        className={`flex items-center gap-1 font-semibold transition-colors px-2 py-0.5 rounded-md ${
                          isSpeaking === msg.id
                            ? "bg-rose-100 text-rose-700 font-bold"
                            : "hover:bg-stone-200 text-stone-600"
                        }`}
                        title={isSpeaking === msg.id ? t.assistant.stopSpeaking : t.assistant.speak}
                      >
                        {isSpeaking === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span>{t.assistant.stopSpeaking}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t.assistant.speak}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Assistant Typing / Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-stone-500">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Consulting agricultural diagnostics...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Listening Banner */}
        {isListening && (
          <div className="px-4 py-2.5 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
              <span className="font-semibold">{t.assistant.listening}</span>
            </div>
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className="px-2 py-1 rounded-md bg-emerald-200 text-emerald-900 font-bold text-[11px]"
            >
              Stop
            </button>
          </div>
        )}

        {/* Voice error alert */}
        {speechError && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-xl border transition-all ${
                isListening
                  ? "bg-rose-600 border-rose-600 text-white animate-voice-listening"
                  : "bg-white border-stone-300 text-stone-700 hover:text-emerald-700 hover:border-emerald-500 shadow-2xs"
              }`}
              title={isListening ? "Stop Listening" : "Voice Input (Speech-to-Text)"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.assistant.inputPlaceholder}
              className="flex-1 px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-emerald-600 shadow-2xs"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-sm flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t.assistant.send}</span>
            </button>
          </form>

          <p className="text-[10px] text-stone-400 mt-2 text-center">
            {t.assistant.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
