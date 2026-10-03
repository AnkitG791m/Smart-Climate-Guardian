import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  RotateCcw,
  ShieldCheck,
  Radio,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LiveEnvironmentalData } from '../../services/openMeteo';
import { askGeminiClimateAssistant, ChatMessage } from '../../services/geminiService';
import { speechService } from '../../services/speechService';
import { soundService } from '../../services/soundService';

interface GeminiClimateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveData: LiveEnvironmentalData;
}

export const GeminiClimateChatModal: React.FC<GeminiClimateChatModalProps> = ({
  isOpen,
  onClose,
  liveData,
}) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      role: 'assistant',
      content: isHindi
        ? `नमस्ते! मैं **पृथ्वी (Prithvi AI)** हूँ — आपका पर्यावरण एवं जलवायु सहायक। वर्तमान में **${liveData.city.name}** का CPCB AQI **${liveData.cpcbAqi.aqi} (${liveData.cpcbAqi.category})** है। मुझसे वायु गुणवत्ता, मौसम, मास्क या सुरक्षा नियमों के बारे में पूछें। आप बोलकर (Voice Mode 🎙️) भी पूछ सकते हैं!`
        : `Greetings! I am **Prithvi AI** — your Climate & Environmental Guardian. Real-time CPCB NAQI for **${liveData.city.name}** is **${liveData.cpcbAqi.aqi} (${liveData.cpcbAqi.category})**. Ask me about air pollution, precautions, heat/flood risks, or shelters. You can also use **Voice Mode 🎙️** to speak!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      speechService.stopSpeaking();
      speechService.stopListening();
      setIsListening(false);
      setCurrentlySpeakingId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice Mode: Start / Stop listening
  const toggleVoiceMode = () => {
    soundService.playClick();
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      speechService.stopSpeaking();
      setCurrentlySpeakingId(null);
      setIsListening(true);

      const langCode = isHindi ? 'hi' : 'en';
      speechService.startListening(
        langCode,
        (text, isFinal) => {
          setInput(text);
          if (isFinal) {
            setIsListening(false);
            soundService.playAlertChime('info');
          }
        },
        (err) => {
          setIsListening(false);
          console.warn('Voice recognition error:', err);
        }
      );
    }
  };

  // Speak Mode: Read AI reply aloud
  const handleToggleSpeak = (msgId: string, text: string) => {
    soundService.playClick();
    if (currentlySpeakingId === msgId) {
      speechService.stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      setCurrentlySpeakingId(msgId);
      speechService.speak(
        text,
        () => setCurrentlySpeakingId(msgId),
        () => setCurrentlySpeakingId(null)
      );
    }
  };

  // Send message to Gemini
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    soundService.playClick();
    setInput('');
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askGeminiClimateAssistant(query, liveData, messages);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If autoSpeak is active, speak the response
      if (autoSpeak) {
        setCurrentlySpeakingId(assistantMsg.id);
        speechService.speak(
          response,
          () => setCurrentlySpeakingId(assistantMsg.id),
          () => setCurrentlySpeakingId(null)
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: isHindi
          ? 'माफ़ कीजिए, उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Could not connect to Gemini service. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Suggested Prompts
  const SUGGESTED_PROMPTS = isHindi
    ? [
        `क्या आज ${liveData.city.name} में बाहर टहलना सुरक्षित है?`,
        `वर्तमान AQI ${liveData.cpcbAqi.aqi} के लिए कौन सा मास्क पहनें?`,
        `PM2.5 मुख्य प्रदूषक के क्या खतरे हैं?`,
        `निकटतम आपातकालीन आश्रय और अस्पताल कहाँ हैं?`,
      ]
    : [
        `Is outdoor exercise safe in ${liveData.city.name} today?`,
        `What mask should I wear for AQI ${liveData.cpcbAqi.aqi}?`,
        `Explain CPCB NAQI health impacts for ${liveData.cpcbAqi.category}`,
        `Where is the nearest shelter with oxygen?`,
      ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl w-full sm:max-w-xl sm:rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col h-[85vh] sm:h-[680px]">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-blue-100/80 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/60">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2F80ED] to-[#0056C6] text-white shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-900">Prithvi AI Guardian</h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-[#2F80ED] font-bold border border-blue-200">
                  Gemini 1.5
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                {liveData.city.name} • CPCB AQI {liveData.cpcbAqi.aqi} • {liveData.weather.temperature}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto-Speak Toggle */}
            <button
              onClick={() => {
                soundService.playClick();
                setAutoSpeak(!autoSpeak);
                if (autoSpeak) speechService.stopSpeaking();
              }}
              className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                autoSpeak
                  ? 'bg-blue-50 text-[#2F80ED] border border-blue-200'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title={autoSpeak ? 'Auto-Speak Active (Replies read aloud)' : 'Auto-Speak Muted'}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-[#2F80ED]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="text-[10px] hidden md:inline">Voice Out</span>
            </button>

            {/* Clear Chat */}
            <button
              onClick={() => {
                soundService.playClick();
                speechService.stopSpeaking();
                setMessages([messages[0]]);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              title="Reset Chat History"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm bg-gradient-to-b from-[#FAFDFE] to-white">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            const isSpeakingThis = currentlySpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${isAI ? 'justify-start' : 'justify-end flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white text-xs ${
                    isAI ? 'bg-gradient-to-br from-[#2F80ED] to-[#0056C6]' : 'bg-slate-700'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] space-y-1.5 ${isAI ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm text-xs sm:text-[13px] leading-relaxed break-words ${
                      isAI
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-sm'
                        : 'bg-[#2F80ED] text-white shadow-md shadow-blue-500/20'
                    }`}
                  >
                    <div className="whitespace-pre-line font-normal">{msg.content}</div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 font-mono ${isAI ? 'justify-start' : 'justify-end'}`}>
                    <span>{msg.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded hover:bg-blue-50 flex items-center gap-1 transition-colors ${
                          isSpeakingThis ? 'text-[#2F80ED] font-bold' : 'text-slate-400 hover:text-[#2F80ED]'
                        }`}
                        title={isSpeakingThis ? 'Stop Reading' : 'Read Aloud (Text-to-Speech)'}
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                            <span className="text-[9px] text-rose-500">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[9px]">Speak</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 items-start justify-start animate-fadeIn">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#2F80ED] to-[#0056C6] flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-2 text-xs text-slate-500 shadow-sm">
                <Loader2 className="w-4 h-4 text-[#2F80ED] animate-spin" />
                <span className="font-mono">Analyzing atmospheric telemetry with Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-200/70 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-50/70">
          <Sparkles className="w-3 h-3 text-[#2F80ED] shrink-0 ml-0.5" />
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-slate-600 hover:text-[#2F80ED] hover:border-[#2F80ED]/40 border border-slate-200 shrink-0 transition-colors whitespace-nowrap shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Voice Input Live Visualizer Bar */}
        {isListening && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-[#2F80ED] font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2F80ED]" />
              </span>
              <span>Listening to your voice... (बोलिए, मैं सुन रहा हूँ)</span>
            </div>
            <button
              onClick={toggleVoiceMode}
              className="text-[11px] font-bold text-rose-500 hover:underline"
            >
              Stop
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white flex items-end gap-2">
          {/* Voice Input (Microphone) Button */}
          <button
            onClick={toggleVoiceMode}
            className={`p-2.5 rounded-2xl transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-lg scale-105'
                : 'bg-slate-100 text-slate-700 hover:text-[#2F80ED] hover:bg-blue-50'
            }`}
            title={isListening ? 'Stop Listening' : 'Voice Mode: Speak your question'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#2F80ED]" />}
          </button>

          {/* Text Area */}
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isHindi
                ? 'मुझसे वायु गुणवत्ता, मौसम या सुरक्षा के बारे में पूछें...'
                : 'Ask about CPCB AQI, weather, masks, or precautions...'
            }
            className="flex-1 max-h-24 min-h-[42px] bg-slate-100 text-slate-900 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED]/40 resize-none border border-slate-200/60"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-[#2F80ED] hover:bg-[#256ec7] text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
