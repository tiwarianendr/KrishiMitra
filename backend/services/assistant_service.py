import os
import re
import logging
from typing import Dict, Any, List, Optional
import requests

logger = logging.getLogger(__name__)

# Agricultural knowledge rules for offline/zero-config fallback
AGRONOMY_RULES = [
    {
        "keywords": ["tomato", "टमाटर", "brown", "भूरे", "blight", "झुलसा"],
        "en": (
            "Based on brown discoloration in tomato leaves, this commonly indicates either Early Blight (Alternaria solani) "
            "or Late Blight (Phytophthora infestans).\n\n"
            "🔍 **Recommended Diagnostic Steps:**\n"
            "1. Inspect the pattern: If spots have concentric rings ('target board') starting on lower leaves, it is likely Early Blight. "
            "If lesions are water-soaked, rapid-spreading, or have white mold underneath during humid mornings, it is Late Blight.\n\n"
            "🌿 **Organic / Cultural Action:**\n"
            "• Remove and destroy infected lower foliage immediately.\n"
            "• Avoid wetting leaves during irrigation; water the soil directly at the base.\n"
            "• Spray Neem oil (5ml/L) or Copper Oxychloride (2.5g/L) as a protective barrier.\n\n"
            "🧪 **Chemical Management:**\n"
            "• For Early Blight: Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin @ 1 ml/L.\n"
            "• For Late Blight: Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L promptly.\n\n"
            "⚠️ *Note: Always verify with your local Krishi Vigyan Kendra (KVK) officer for regional advisory.*"
        ),
        "hi": (
            "टमाटर की पत्तियों पर भूरे धब्बे या भूरापन आमतौर पर अगेती झुलसा (Early Blight) या पछेती झुलसा (Late Blight) का संकेत है।\n\n"
            "🔍 **जांच के मुख्य बिंदु:**\n"
            "1. यदि निचली पत्तियों पर छल्लेदार गोल भूरे-काले धब्बे हैं, तो यह अगेती झुलसा है।\n"
            "2. यदि पत्तियों पर पानी से भीगे हुए तेजी से फैलने वाले धब्बे हैं और सुबह पत्ती के नीचे सफेद फफूंद दिखे, तो यह पछेती झुलसा है।\n\n"
            "🌿 **जैविक व सावधानियां:**\n"
            "• रोगग्रस्त निचली पत्तियों को तोड़कर खेत से दूर नष्ट कर दें।\n"
            "• पौधों के ऊपर पानी छिड़कने से बचें; केवल जड़ों में पानी दें।\n"
            "• कॉपर ऑक्सीक्लोराइड (2.5 ग्राम प्रति लीटर) या नीम का तेल (5 मिली प्रति लीटर) का छिड़काव करें।\n\n"
            "🧪 **रासायनिक उपचार:**\n"
            "• अगेती झुलसा के लिए: मैंकोजेब 75% WP (2.5 ग्राम/लीटर) का छिड़काव करें।\n"
            "• पछेती झुलसा के लिए: मेटालेक्सिल 8% + मैंकोजेब 64% WP (2.5 ग्राम/लीटर) का तुरंत छिड़काव करें।\n\n"
            "⚠️ *सलाह: किसी भी गंभीर समस्या में अपने निकटतम कृषि विज्ञान केंद्र से संपर्क करें।*"
        )
    },
    {
        "keywords": ["wheat", "गेहूं", "yellow", "पीले", "rust", "रतुआ"],
        "en": (
            "Yellowing or yellow streaks in wheat foliage are most frequently caused by Stripe Rust (Yellow Rust - Puccinia striiformis), "
            "or severe Nitrogen/Sulfur nutrient deficiency.\n\n"
            "🔍 **Diagnostic Test:**\n"
            "• Wipe the yellow area with a clean white cloth or your thumb. If a bright yellow/orange powdery dust rubs off, "
            "it is Stripe Rust (Yellow Rust).\n"
            "• If leaves are uniformly pale yellow without fungal powder, it indicates nutrient deficiency or water stagnation.\n\n"
            "🧪 **Action for Yellow Rust:**\n"
            "• Spray Propiconazole 25% EC (Tilt) @ 1 ml/L (200 ml in 200 L water per acre) immediately upon first sighting.\n"
            "• Repeat application after 15 days if stripe development continues.\n\n"
            "🌿 **Action for Nitrogen/Water Stress:**\n"
            "• If soil is waterlogged, drain excess water and apply foliar urea spray (2% solution).\n\n"
            "⚠️ *Urgent: Yellow rust spreads via wind rapidly across adjacent fields. Prompt action is critical.*"
        ),
        "hi": (
            "गेहूं के पत्तों का पीला पड़ना मुख्य रूप से पीला रतुआ (Yellow Rust / Stripe Rust) या नाइट्रोजन की कमी अथवा जलभराव का कारण होता है।\n\n"
            "🔍 **पहचान का तरीका:**\n"
            "• पत्ते की पीली धारी को सफेद कपड़े या उंगली से छुएं। यदि उंगली पर हल्दी जैसा पीला पाउडर चिपकता है, तो यह पीला रतुआ है।\n"
            "• यदि कोई पाउडर नहीं निकलता और पूरा पत्ता एक समान पीला है, तो यह नाइट्रोजन की कमी या पानी रुकने से है।\n\n"
            "🧪 **पीला रतुआ का उपचार:**\n"
            "• तुरंत प्रोपिकोनाजोल 25% EC (टिल्ट) 1 मिली प्रति लीटर (200 मिली प्रति 200 लीटर पानी प्रति एकड़) का छिड़काव करें।\n"
            "• आवश्यकता पड़ने पर 15 दिन बाद दोबारा छिड़काव करें।\n\n"
            "🌿 **पोषक तत्व व जलभराव सुधार:**\n"
            "• खेत में रुका हुआ पानी निकालें और 2% यूरिया घोल का पर्णीय छिड़काव करें।\n\n"
            "⚠️ *महत्वपूर्ण: पीला रतुआ हवा से बहुत तेजी से फैलता है, इसलिए तुरंत कदम उठाएं।*"
        )
    },
    {
        "keywords": ["rice", "धान", "चावल", "blight", "spot", "धब्बे", "लक्षण"],
        "en": (
            "Common rice diseases include Bacterial Leaf Blight, Brown Spot, and Blast.\n\n"
            "🌾 **Key Symptoms & Identification:**\n"
            "1. **Bacterial Leaf Blight:** Wavy yellow-to-white lesions starting from leaf edges and tips, wilting leaves.\n"
            "2. **Brown Spot:** Small oval brown spots with grey centers (resembling sesame seeds) on leaves and grain hulls.\n"
            "3. **Blast:** Spindle-shaped lesions with dark margins and ash-grey centers, or rotten neck nodes.\n\n"
            "🛡️ **Management Strategy:**\n"
            "• For Bacterial Blight: Drain excess water for 2-3 days, stop top-dressing urea, and spray Streptocycline (15g) + Copper Oxychloride (500g) per acre.\n"
            "• For Blast / Brown Spot: Spray Tricyclazole 75% WP @ 0.6 g/L or Propiconazole 25% EC @ 1 ml/L."
        ),
        "hi": (
            "धान की फसल में मुख्य रूप से जीवाणु झुलसा (Bacterial Leaf Blight), भूरा धब्बा (Brown Spot) और ब्लास्ट (झोंका रोग) लगते हैं।\n\n"
            "🌾 **प्रमुख लक्षण व पहचान:**\n"
            "1. **जीवाणु झुलसा:** पत्तियों के किनारों और सिरों से शुरू होकर लहरदार पीले-सफेद सूखने वाले धब्बे।\n"
            "2. **भूरा धब्बा:** तिल के आकार के अंडाकार भूरे धब्बे, जिनका केंद्र स्लेटी होता है।\n"
            "3. **ब्लास्ट (झोंका):** आंख की पुतली जैसे नाव के आकार के धब्बे और बालियों की गर्दन का काला पड़कर टूटना।\n\n"
            "🛡️ **रोकथाम व उपचार:**\n"
            "• जीवाणु झुलसा के लिए: खेत का पानी 2-3 दिन निकालें, यूरिया रोकें और स्ट्रेप्टोसाइक्लिन (15 ग्राम) + कॉपर ऑक्सीक्लोराइड (500 ग्राम) प्रति एकड़ छिड़कें।\n"
            "• ब्लास्ट / भूरा धब्बा के लिए: ट्राइसाइक्लाजोल 75% WP (0.6 ग्राम/लीटर) या प्रोपिकोनाजोल (1 मिली/लीटर) का छिड़काव करें।"
        )
    },
    {
        "keywords": ["potato", "आलू", "curling", "मरोड़", "aphid", "माहू"],
        "en": (
            "Leaf curling and stunted foliage in potatoes often point to Potato Leafroll Virus (PLRV) or Mosaic Virus, "
            "transmitted by sucking aphids.\n\n"
            "🔍 **Symptoms:** Leathery leaves rolling upward, crispy texture, and stunted vine growth.\n\n"
            "🌱 **Control Measures:**\n"
            "• Remove virus-infected plants immediately to save the remaining crop.\n"
            "• Control aphid vectors with Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.\n"
            "• Install yellow sticky traps (15-20 traps/acre)."
        ),
        "hi": (
            "आलू की पत्तियों का मुड़ना और पौधे का बौना होना आमतौर पर लीफरोल वायरस या मोज़ेक वायरस का संकेत है, जिसे माहू (एफिड्स) फैलाते हैं।\n\n"
            "🔍 **लक्षण:** पत्तियां ऊपर की ओर मुड़कर चमड़े जैसी सख्त हो जाती हैं और आसानी से टूटती हैं।\n\n"
            "🌱 **नियंत्रण के उपाय:**\n"
            "• संक्रमित पौधों को तुरंत उखाड़कर नष्ट करें ताकि अन्य पौधे बच सकें।\n"
            "• माहू नियंत्रण हेतु इमिडाक्लोप्रिड 17.8% SL (0.5 मिली/लीटर) या थायमेथोक्सम 25% WG (0.3 ग्राम/लीटर) का छिड़काव करें।\n"
            "• खेत में पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।"
        )
    },
    {
        "keywords": ["pea", "मटर", "powder", "सफेद", "mildew", "आसिता"],
        "en": (
            "White powdery coating on pea leaves, vines, and pods is caused by Pea Powdery Mildew (Erysiphe pisi).\n\n"
            "🔍 **Symptoms:** White talcum-powder like substance spreading rapidly across leaves, causing them to turn yellow and dry up.\n\n"
            "🌿 **Management:**\n"
            "• Spray Wettable Sulfur 80% WP @ 2.5 g/L or Hexaconazole 5% EC @ 2 ml/L.\n"
            "• Bio-control: Spray sour buttermilk (5%) or Neem oil (5ml/L) in early stages."
        ),
        "hi": (
            "मटर की पत्तियों और फलियों पर सफेद पाउडर जैसी परत का आना चूर्णिल आसिता (Powdery Mildew) रोग है।\n\n"
            "🔍 **लक्षण:** पत्तियों पर सफेद पाउडर छा जाता है, पत्तियां पीली पड़कर सूखने लगती हैं और फलियां छोटी रह जाती हैं।\n\n"
            "🌿 **उपचार:**\n"
            "• घुलनशील सल्फर (Wettable Sulfur 80% WP) 2.5 ग्राम प्रति लीटर या हेक्साकोनाजोल 5% EC 2 मिली प्रति लीटर का छिड़काव करें।\n"
            "• जैविक उपचार: खट्टी छाछ (5%) या नीम का तेल (5 मिली/लीटर) का शुरुआती अवस्था में छिड़काव करें।"
        )
    }
]

DEFAULT_EN_RESPONSE = (
    "Hello! I am your KrishiMitra AI Agricultural Assistant.\n\n"
    "I can assist you with:\n"
    "• Diagnosing symptoms for Potato, Tomato, Rice, Wheat, and Pea\n"
    "• Providing organic and chemical crop protection solutions\n"
    "• Fertilizer scheduling and soil health practices\n"
    "• Weather-related crop management alerts\n\n"
    "Please describe your crop, the observed symptoms (e.g. leaf spots, wilting, curling), or any farming question."
)

DEFAULT_HI_RESPONSE = (
    "नमस्ते! मैं आपका कृषि मित्र (KrishiMitra) एआई कृषि सलाहकार हूं।\n\n"
    "मैं आपकी इन विषयों में सहायता कर सकता हूं:\n"
    "• आलू, टमाटर, धान, गेहूं और मटर की फसलों के रोगों की पहचान\n"
    "• जैविक एवं रासायनिक कीटनाशक व फफूंदनाशक उपाय\n"
    "• खाद, उर्वरक (NPK) एवं सिंचाई प्रबंधन\n"
    "• मौसम आधारित कृषि सावधानियां\n\n"
    "कृपया अपनी फसल का नाम और पत्तियों या पौधे पर दिखने वाले लक्षण बताएं।"
)

class AssistantService:
    @staticmethod
    def _is_hindi(text: str) -> bool:
        """Detect Devanagari script characters."""
        return any('\u0900' <= char <= '\u097F' for char in text)

    @staticmethod
    def _call_gemini_or_groq(prompt: str, user_lang: str) -> Optional[str]:
        """Try calling configured LLM if API key is present."""
        gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
        groq_key = os.getenv("GROQ_API_KEY", "").strip()

        system_instruction = (
            "You are KrishiMitra, an expert and compassionate AI agricultural extension advisor helping farmers in India. "
            "Provide concise, practical, field-tested guidance. Include crop diagnosis, organic remedies, standard chemical "
            "fungicides/insecticides with exact dosages, and a friendly reminder to consult local agricultural officers. "
            f"Respond clearly in {'Hindi' if user_lang == 'hi' else 'English'}."
        )

        # Gemini API call
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": f"{system_instruction}\n\nFarmer question: {prompt}"}]
                    }]
                }
                res = requests.post(url, json=payload, timeout=8)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text")
                        if text:
                            return text
            except Exception as e:
                logger.warning(f"Gemini API request failed: {e}")

        # Groq API call
        if groq_key:
            try:
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"}
                payload = {
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.3
                }
                res = requests.post(url, headers=headers, json=payload, timeout=8)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content")
            except Exception as e:
                logger.warning(f"Groq API request failed: {e}")

        return None

    @classmethod
    def get_response(cls, message: str, language_preference: str = "en", history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Produce a language-aware, agricultural response.
        Attempts LLM first (if API key available), falls back to comprehensive agronomy knowledge base.
        """
        clean_text = message.strip()
        if not clean_text:
            return {
                "response": "Please ask a question about your crop, disease symptoms, or agricultural practices.",
                "language": language_preference
            }

        is_hindi = cls._is_hindi(clean_text) or language_preference == "hi"
        lang = "hi" if is_hindi else "en"

        # 1. Attempt LLM invocation if configured
        llm_answer = cls._call_gemini_or_groq(clean_text, lang)
        if llm_answer:
            return {
                "response": llm_answer,
                "language": lang,
                "source": "AI Agronomist Engine"
            }

        # 2. Rule-based / Agronomy knowledge base matching
        lower_query = clean_text.lower()
        best_match = None
        highest_score = 0

        for rule in AGRONOMY_RULES:
            score = sum(1 for kw in rule["keywords"] if kw.lower() in lower_query)
            if score > highest_score:
                highest_score = score
                best_match = rule

        if best_match and highest_score > 0:
            reply = best_match["hi"] if lang == "hi" else best_match["en"]
            return {
                "response": reply,
                "language": lang,
                "source": "KrishiMitra Agronomy Knowledge System"
            }

        # 3. Default contextual guidance
        default_reply = DEFAULT_HI_RESPONSE if lang == "hi" else DEFAULT_EN_RESPONSE
        return {
            "response": default_reply,
            "language": lang,
            "source": "KrishiMitra Agronomy Knowledge System"
        }
