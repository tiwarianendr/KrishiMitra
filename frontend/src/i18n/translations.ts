export interface TranslationStrings {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    dashboard: string;
    predict: string;
    assistant: string;
    history: string;
    resources: string;
    profile: string;
    settings: string;
    login: string;
    signup: string;
    logout: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaDetect: string;
    ctaAssistant: string;
    cropsCovered: string;
  };
  features: {
    aiDetectTitle: string;
    aiDetectDesc: string;
    assistantTitle: string;
    assistantDesc: string;
    weatherTitle: string;
    weatherDesc: string;
    mandiTitle: string;
    mandiDesc: string;
  };
  dashboard: {
    welcome: string;
    quickDetect: string;
    quickDetectDesc: string;
    openCamera: string;
    uploadPhoto: string;
    recentDetections: string;
    noRecentDetections: string;
    viewAllHistory: string;
    weatherWidget: string;
    currentLocation: string;
    detectingLocation: string;
    locationDenied: string;
    farmerAssistant: string;
    askQuestionPlaceholder: string;
    supportedCropsTitle: string;
    officialHelpline: string;
    callNow: string;
  };
  predict: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    dragDropText: string;
    orBrowse: string;
    browseFiles: string;
    useCamera: string;
    stopCamera: string;
    capturePhoto: string;
    selectedImage: string;
    changeImage: string;
    removeImage: string;
    cropSelectLabel: string;
    allCropsAuto: string;
    analyzeBtn: string;
    analyzingBtn: string;
    confidence: string;
    severity: string;
    symptomsTitle: string;
    organicTreatmentTitle: string;
    chemicalTreatmentTitle: string;
    preventionTitle: string;
    nextStepsTitle: string;
    disclaimer: string;
    newPrediction: string;
    saveToHistory: string;
    cameraError: string;
    cameraPermissionDenied: string;
    cameraNotSupported: string;
    healthyStatus: string;
    infectedStatus: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    welcomeMsg: string;
    inputPlaceholder: string;
    send: string;
    listening: string;
    speak: string;
    stopSpeaking: string;
    micPermissionError: string;
    clearChat: string;
    sampleQuestionsTitle: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    disclaimer: string;
  };
  weather: {
    title: string;
    humidity: string;
    wind: string;
    rainProbability: string;
    feelsLike: string;
    updated: string;
    refresh: string;
    loading: string;
    error: string;
  };
  resources: {
    title: string;
    subtitle: string;
    categoryAll: string;
    categoryMarkets: string;
    categorySeeds: string;
    categoryFertilizers: string;
    categoryOffices: string;
    verifiedHelplineBadge: string;
    kmAway: string;
    viewOnMap: string;
    callHelpline: string;
    noPlacesFound: string;
    nationalHelplinesTitle: string;
  };
  history: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    deleteConfirm: string;
    deleteBtn: string;
    viewDetails: string;
    predictedOn: string;
    cropLabel: string;
    diseaseLabel: string;
  };
  auth: {
    loginTitle: string;
    signupTitle: string;
    fullName: string;
    emailOrPhone: string;
    password: string;
    confirmPassword: string;
    selectLanguage: string;
    state: string;
    district: string;
    loginBtn: string;
    signupBtn: string;
    alreadyAccount: string;
    noAccount: string;
    passwordLengthError: string;
    loginSuccess: string;
    signupSuccess: string;
  };
  profile: {
    title: string;
    subtitle: string;
    personalInfo: string;
    preferredLanguage: string;
    locationInfo: string;
    updateBtn: string;
    updatingBtn: string;
    updateSuccess: string;
  };
  common: {
    loading: string;
    success: string;
    error: string;
    tryAgain: string;
    cancel: string;
    close: string;
    healthy: string;
    moderate: string;
    critical: string;
    low: string;
    high: string;
  };
}

export const LANGUAGES: { code: string; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" }
];

export const enTranslations: TranslationStrings = {
  brand: "KrishiMitra",
  tagline: "AI-Powered Multi-Crop Disease Detection & Farmer Assistance",
  nav: {
    home: "Home",
    dashboard: "Dashboard",
    predict: "Disease Detection",
    assistant: "AI Assistant",
    history: "My Records",
    resources: "Nearby Resources",
    profile: "My Profile",
    settings: "Settings",
    login: "Log In",
    signup: "Register",
    logout: "Log Out"
  },
  hero: {
    badge: "Government & KVK Standard AI AgTech",
    title: "Protect Your Crops with Instant",
    titleHighlight: "AI Disease Diagnosis",
    subtitle: "Identify plant diseases in seconds, receive actionable organic & chemical treatment plans, talk with your AI agricultural assistant in your language, and track local weather.",
    ctaDetect: "Scan Crop Now",
    ctaAssistant: "Talk to AI Assistant",
    cropsCovered: "Supported Crops: Potato, Tomato, Rice, Wheat, Pea"
  },
  features: {
    aiDetectTitle: "Deep Learning Diagnosis",
    aiDetectDesc: "Precision CNN model trained on 25+ diseases across major Indian staple and vegetable crops.",
    assistantTitle: "Multilingual Voice Assistant",
    assistantDesc: "Ask agricultural questions via voice or text in 10 languages and get immediate scientific remedies.",
    weatherTitle: "Hyper-Local Agri Weather",
    weatherDesc: "Real-time temperature, humidity, wind, and rain alerts tailored for pesticide spraying schedules.",
    mandiTitle: "Nearby Markets & Kendras",
    mandiDesc: "Locate APMC Mandis, certified seed stores, fertilizer dealers, and Kisan Call Centers within your radius."
  },
  dashboard: {
    welcome: "Welcome back",
    quickDetect: "Quick Crop Scan",
    quickDetectDesc: "Take or upload a picture of an affected leaf to diagnose diseases immediately.",
    openCamera: "Use Camera",
    uploadPhoto: "Upload Photo",
    recentDetections: "Recent Crop Diagnoses",
    noRecentDetections: "No crop scans recorded yet. Diagnose your first plant above!",
    viewAllHistory: "View Full History",
    weatherWidget: "Current Farm Weather",
    currentLocation: "Farm Location",
    detectingLocation: "Detecting GPS location...",
    locationDenied: "Location permission denied (Using default station)",
    farmerAssistant: "Kisan AI Assistant",
    askQuestionPlaceholder: "Ask about pest control, fertilizers, or crop yellowing...",
    supportedCropsTitle: "Supported Crops & Conditions",
    officialHelpline: "Kisan Call Center (24x7 Toll-Free)",
    callNow: "Call 1800-180-1551"
  },
  predict: {
    title: "AI Crop Disease Detection",
    subtitle: "Capture or upload a clear photo of the plant leaf for automated scientific diagnosis.",
    step1: "1. Select or Capture Leaf Image",
    step2: "2. Confirm & Analyze",
    dragDropText: "Drag and drop leaf image here, or",
    orBrowse: "Browse files from device",
    browseFiles: "Choose Image File",
    useCamera: "Open Live Camera",
    stopCamera: "Close Camera",
    capturePhoto: "Snap Photo",
    selectedImage: "Image Ready for Analysis",
    changeImage: "Change Image",
    removeImage: "Clear",
    cropSelectLabel: "Crop Type (Optional Hint):",
    allCropsAuto: "Automatic Multi-Crop Detection",
    analyzeBtn: "Analyze Crop Health",
    analyzingBtn: "Processing with AI Model...",
    confidence: "Model Confidence",
    severity: "Severity Level",
    symptomsTitle: "Observed Symptoms",
    organicTreatmentTitle: "Organic & Cultural Treatments",
    chemicalTreatmentTitle: "Recommended Chemical Spray (with dosage)",
    preventionTitle: "Prevention & Management Tips",
    nextStepsTitle: "Immediate Next Steps",
    disclaimer: "Responsible Use Notice: This diagnosis is generated by an artificial intelligence model as an initial advisory indication. For severe outbreaks or large-scale treatment decisions, please consult your nearest Krishi Vigyan Kendra (KVK) or Block Agriculture Officer.",
    newPrediction: "Scan Another Plant",
    saveToHistory: "Saved to Your Diagnostic Records",
    cameraError: "Unable to access camera device.",
    cameraPermissionDenied: "Camera permission was denied. Please enable camera access in browser settings.",
    cameraNotSupported: "Camera is not supported on this browser.",
    healthyStatus: "Healthy Plant",
    infectedStatus: "Disease Detected"
  },
  assistant: {
    title: "Kisan Mitra – AI Agricultural Assistant",
    subtitle: "Ask questions regarding pests, diseases, fertilizers, and seasonal farming advice.",
    welcomeMsg: "Namaste! I am your KrishiMitra AI Assistant. How may I help you with your crops today?",
    inputPlaceholder: "Type your farming question here...",
    send: "Send",
    listening: "Listening to your voice... Speak clearly.",
    speak: "Listen to Answer",
    stopSpeaking: "Stop Audio",
    micPermissionError: "Microphone permission required for voice input.",
    clearChat: "Clear Chat",
    sampleQuestionsTitle: "Common Questions Farmers Ask:",
    q1: "My tomato leaves are turning brown. What should I do?",
    q2: "गेहूं के पत्ते पीले हो रहे हैं, क्या करूं?",
    q3: "धान में जीवाणु झुलसा के लक्षण क्या हैं?",
    q4: "How to protect pea plants from powdery mildew?",
    disclaimer: "Agricultural AI Advisory: Recommendations are based on standard agronomic practices. Please cross-check pesticide brand names with local availability."
  },
  weather: {
    title: "Local Farming Weather",
    humidity: "Humidity",
    wind: "Wind Speed",
    rainProbability: "Rain Probability",
    feelsLike: "Feels Like",
    updated: "Updated",
    refresh: "Refresh Weather",
    loading: "Fetching weather telemetry...",
    error: "Weather data currently unavailable."
  },
  resources: {
    title: "Nearby Agricultural Resources & Markets",
    subtitle: "Find certified seed centers, fertilizer stores, Mandis, and verified agricultural extension officers.",
    categoryAll: "All Resources",
    categoryMarkets: "Mandis & Markets",
    categorySeeds: "Seed Stores",
    categoryFertilizers: "Fertilizer Dealers",
    categoryOffices: "Govt Agri Offices",
    verifiedHelplineBadge: "Verified National Helpline",
    kmAway: "km away",
    viewOnMap: "Open in Maps",
    callHelpline: "Call Helpline",
    noPlacesFound: "No commercial stores registered in this specific radius. Please use the verified national support contacts below.",
    nationalHelplinesTitle: "Verified Government Agricultural Support Hotlines"
  },
  history: {
    title: "Diagnostic History",
    subtitle: "Review your previous crop scans and past diagnosis reports.",
    emptyTitle: "No Scans Found",
    emptyDesc: "You have not performed any crop disease scans yet.",
    deleteConfirm: "Are you sure you want to delete this scan record?",
    deleteBtn: "Delete",
    viewDetails: "View Full Treatment",
    predictedOn: "Scanned on",
    cropLabel: "Crop",
    diseaseLabel: "Condition"
  },
  auth: {
    loginTitle: "Log In to KrishiMitra",
    signupTitle: "Farmer Registration",
    fullName: "Full Name",
    emailOrPhone: "Email or Mobile Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    selectLanguage: "Preferred Language",
    state: "State",
    district: "District",
    loginBtn: "Log In",
    signupBtn: "Create Farmer Account",
    alreadyAccount: "Already have an account? Log In",
    noAccount: "Don't have an account yet? Register",
    passwordLengthError: "Password must be at least 6 characters.",
    loginSuccess: "Welcome back!",
    signupSuccess: "Account created successfully!"
  },
  profile: {
    title: "Farmer Profile",
    subtitle: "Manage your personal information, region, and language preferences.",
    personalInfo: "Personal Details",
    preferredLanguage: "App Interface Language",
    locationInfo: "Farm Location & District",
    updateBtn: "Save Changes",
    updatingBtn: "Updating Profile...",
    updateSuccess: "Profile updated successfully!"
  },
  common: {
    loading: "Loading...",
    success: "Success",
    error: "Error",
    tryAgain: "Try Again",
    cancel: "Cancel",
    close: "Close",
    healthy: "Healthy",
    moderate: "Moderate",
    critical: "Critical",
    low: "Low",
    high: "High"
  }
};

export const hiTranslations: TranslationStrings = {
  brand: "कृषि मित्र",
  tagline: "एआई आधारित बहु-फसल रोग पहचान और किसान सहायक मंच",
  nav: {
    home: "होम",
    dashboard: "डैशबोर्ड",
    predict: "रोग पहचान",
    assistant: "एआई सहायक",
    history: "मेरी जांचें",
    resources: "नजदीकी केंद्र",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    login: "लॉग इन",
    signup: "पंजीकरण",
    logout: "लॉग आउट"
  },
  hero: {
    badge: "सरकारी व केवीके मानकों के अनुरूप एआई तकनीक",
    title: "अपनी फसलों को सुरक्षित रखें तुरंत",
    titleHighlight: "एआई रोग निदान से",
    subtitle: "पत्तियों की फोटो खींचकर सेकंडों में फसल के रोग पहचानें, सटीक जैविक व रासायनिक उपचार पाएं, अपनी भाषा में एआई किसान मित्र से बोलकर सलाह लें और मौसम का हाल जानें।",
    ctaDetect: "फसल की जांच करें",
    ctaAssistant: "एआई सहायक से बात करें",
    cropsCovered: "समर्थित फसलें: आलू, टमाटर, धान (चावल), गेहूं, मटर"
  },
  features: {
    aiDetectTitle: "सटीक डीप लर्निंग तकनीक",
    aiDetectDesc: "प्रमुख भारतीय फसलों के 25 से अधिक रोगों पर प्रशिक्षित आधुनिक सीएनएन न्यूरल नेटवर्क मॉडल।",
    assistantTitle: "बोलने वाला बहुभाषी सहायक",
    assistantDesc: "10 भारतीय भाषाओं में बोलकर या लिखकर कृषि प्रश्न पूछें और तुरंत वैज्ञानिक समाधान पाएं।",
    weatherTitle: "सटीक कृषि मौसम जानकारी",
    weatherDesc: "दवा छिड़काव और सिंचाई की योजना के लिए तापमान, आर्द्रता, हवा की गति और बारिश की संभावना।",
    mandiTitle: "निकटतम कृषि बाजार व केंद्र",
    mandiDesc: "अपने आसपास की कृषि उपज मंडियां, बीज भंडार, खाद केंद्र और किसान कॉल सेंटर खोजें।"
  },
  dashboard: {
    welcome: "स्वागत है",
    quickDetect: "त्वरित फसल रोग जांच",
    quickDetectDesc: "रोगग्रस्त पत्ती की फोटो खींचे या अपलोड करें और तुरंत वैज्ञानिक उपचार पाएं।",
    openCamera: "कैमरा खोलें",
    uploadPhoto: "फोटो अपलोड करें",
    recentDetections: "हाल ही में की गई जांचें",
    noRecentDetections: "अभी तक कोई फसल जांच दर्ज नहीं की गई है। ऊपर से अपनी पहली जांच शुरू करें!",
    viewAllHistory: "पूरा इतिहास देखें",
    weatherWidget: "खेत का मौसम",
    currentLocation: "खेत की स्थिति",
    detectingLocation: "स्थान खोजा जा रहा है...",
    locationDenied: "स्थान की अनुमति नहीं मिली (डिफ़ॉल्ट स्टेशन का उपयोग)",
    farmerAssistant: "किसान एआई सलाहकार",
    askQuestionPlaceholder: "कीट नियंत्रण, खाद की मात्रा या पत्तियों के पीलेपन के बारे में पूछें...",
    supportedCropsTitle: "समर्थित फसलें और रोग",
    officialHelpline: "किसान कॉल सेंटर (24x7 टोल-फ्री)",
    callNow: "1800-180-1551 पर कॉल करें"
  },
  predict: {
    title: "एआई फसल रोग पहचान",
    subtitle: "वैज्ञानिक निदान के लिए पौधे की पत्ती की साफ फोटो खींचें या अपलोड करें।",
    step1: "1. पत्ती की फोटो चुनें या खींचें",
    step2: "2. पुष्टि करें और जांच करें",
    dragDropText: "पत्ती की फोटो यहां खींचकर लाएं, या",
    orBrowse: "डिवाइस से फाइल चुनें",
    browseFiles: "गैलरी से चुनें",
    useCamera: "कैमरा शुरू करें",
    stopCamera: "कैमरा बंद करें",
    capturePhoto: "फोटो खींचें",
    selectedImage: "जांच के लिए तैयार फोटो",
    changeImage: "फोटो बदलें",
    removeImage: "हटाएं",
    cropSelectLabel: "फसल का प्रकार (वैकल्पिक सुझाव):",
    allCropsAuto: "स्वचालित बहु-फसल पहचान",
    analyzeBtn: "रोग की जांच करें",
    analyzingBtn: "एआई मॉडल द्वारा जांच जारी है...",
    confidence: "मॉडल सटीकता / विश्वास",
    severity: "गंभीरता स्तर",
    symptomsTitle: "रोग के प्रमुख लक्षण",
    organicTreatmentTitle: "जैविक एवं घरेलू उपचार",
    chemicalTreatmentTitle: "अनुशंसित रासायनिक दवा (मात्रा सहित)",
    preventionTitle: "भविष्य में बचाव के उपाय",
    nextStepsTitle: "तुरंत उठाए जाने वाले कदम",
    disclaimer: "जिम्मेदार उपयोग सूचना: यह परिणाम कृत्रिम बुद्धिमत्ता (एआई) मॉडल द्वारा एक प्रारंभिक संकेत के रूप में दिया गया है। बड़े पैमाने पर उपचार से पहले कृपया अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि विशेषज्ञ से परामर्श अवश्य लें।",
    newPrediction: "दूसरी फसल की जांच करें",
    saveToHistory: "आपके रिकॉर्ड में सुरक्षित कर लिया गया",
    cameraError: "कैमरा चालू करने में असमर्थ।",
    cameraPermissionDenied: "कैमरे की अनुमति अस्वीकृत की गई। कृपया ब्राउज़र सेटिंग्स में कैमरा चालू करें।",
    cameraNotSupported: "इस ब्राउज़र में कैमरा समर्थित नहीं है।",
    healthyStatus: "स्वस्थ पौधा",
    infectedStatus: "रोग की पुष्टि हुई"
  },
  assistant: {
    title: "किसान मित्र – एआई कृषि सहायक",
    subtitle: "कीट, रोग, खाद, सिंचाई और मौसमी खेती से संबंधित प्रश्न पूछें।",
    welcomeMsg: "नमस्ते किसान भाई! मैं आपका कृषि मित्र एआई सहायक हूं। आज आपकी फसल में क्या समस्या है?",
    inputPlaceholder: "अपनी फसल की समस्या यहां लिखें...",
    send: "भेजें",
    listening: "आपकी आवाज सुन रहे हैं... कृपया स्पष्ट बोलें।",
    speak: "उत्तर सुनें",
    stopSpeaking: "आवाज रोकें",
    micPermissionError: "बोलकर पूछने के लिए माइक्रोफ़ोन की अनुमति दें।",
    clearChat: "बातचीत मिटाएं",
    sampleQuestionsTitle: "किसानों द्वारा पूछे जाने वाले प्रमुख सवाल:",
    q1: "टमाटर के पत्ते भूरे हो रहे हैं, क्या उपाय करें?",
    q2: "गेहूं के पत्ते पीले हो रहे हैं, क्या करूं?",
    q3: "धान में जीवाणु झुलसा के लक्षण क्या हैं?",
    q4: "मटर की फसल में सफेद पाउडर (पाउडरी मिल्ड्यू) से कैसे बचें?",
    disclaimer: "कृषि एआई सलाह: यह मार्गदर्शन भारतीय कृषि अनुसंधान परिषद (ICAR) के मानकों पर आधारित है। दवा खरीदते समय स्थानीय उपलब्धता अवश्य जांचें।"
  },
  weather: {
    title: "स्थानीय कृषि मौसम",
    humidity: "हवा में नमी",
    wind: "हवा की गति",
    rainProbability: "बारिश की संभावना",
    feelsLike: "महसूस तापमान",
    updated: "अंतिम अपडेट",
    refresh: "मौसम रिफ्रेश करें",
    loading: "मौसम की जानकारी लाई जा रही है...",
    error: "वर्तमान में मौसम डेटा उपलब्ध नहीं है।"
  },
  resources: {
    title: "नजदीकी कृषि बाजार एवं संसाधन केंद्र",
    subtitle: "प्रमाणित बीज केंद्र, उर्वरक भंडार, कृषि उपज मंडियां और सरकारी कृषि कार्यालय खोजें।",
    categoryAll: "सभी केंद्र",
    categoryMarkets: "कृषि उपज मंडी (APMC)",
    categorySeeds: "प्रमाणित बीज भंडार",
    categoryFertilizers: "खाद व कीटनाशक दुकान",
    categoryOffices: "कृषि विज्ञान केंद्र / कार्यालय",
    verifiedHelplineBadge: "सत्यापित राष्ट्रीय हेल्पलाइन",
    kmAway: "किमी दूर",
    viewOnMap: "मैप पर देखें",
    callHelpline: "कॉल करें",
    noPlacesFound: "इस क्षेत्र में कोई पंजीकृत व्यावसायिक दुकान नहीं मिली। कृपया नीचे दिए गए राष्ट्रीय सरकारी किसान नंबरों का उपयोग करें।",
    nationalHelplinesTitle: "सत्यापित सरकारी किसान सहायता हेल्पलाइन"
  },
  history: {
    title: "मेरी फसल जांच का इतिहास",
    subtitle: "अपनी पिछली सभी फसलों की जांच और उपचार रिपोर्ट देखें।",
    emptyTitle: "कोई जांच नहीं मिली",
    emptyDesc: "आपने अभी तक कोई फसल रोग जांच नहीं की है।",
    deleteConfirm: "क्या आप इस जांच रिकॉर्ड को हटाना चाहते हैं?",
    deleteBtn: "हटाएं",
    viewDetails: "पूरा उपचार देखें",
    predictedOn: "जांच की तारीख",
    cropLabel: "फसल",
    diseaseLabel: "रोग"
  },
  auth: {
    loginTitle: "कृषि मित्र में लॉग इन करें",
    signupTitle: "नया किसान पंजीकरण",
    fullName: "पूरा नाम",
    emailOrPhone: "ईमेल या मोबाइल नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    selectLanguage: "पसंदीदा भाषा",
    state: "राज्य",
    district: "जिला",
    loginBtn: "लॉग इन करें",
    signupBtn: "खाता बनाएं",
    alreadyAccount: "पहले से खाता है? लॉग इन करें",
    noAccount: "खाता नहीं है? पंजीकरण करें",
    passwordLengthError: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    loginSuccess: "सफलतापूर्वक लॉग इन हुआ!",
    signupSuccess: "आपका खाता सफलतापूर्वक बन गया है!"
  },
  profile: {
    title: "किसान प्रोफ़ाइल",
    subtitle: "अपनी व्यक्तिगत जानकारी, क्षेत्र और भाषा सेटिंग प्रबंधित करें।",
    personalInfo: "व्यक्तिगत जानकारी",
    preferredLanguage: "ऐप की भाषा",
    locationInfo: "खेत का राज्य और जिला",
    updateBtn: "बदलाव सहेजें",
    updatingBtn: "सहेजा जा रहा है...",
    updateSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!"
  },
  common: {
    loading: "लोड हो रहा है...",
    success: "सफल",
    error: "त्रुटि",
    tryAgain: "पुनः प्रयास करें",
    cancel: "रद्द करें",
    close: "बंद करें",
    healthy: "स्वस्थ",
    moderate: "मध्यम",
    critical: "गंभीर",
    low: "कम",
    high: "अधिक"
  }
};

// Fallback dictionary for all 10 languages
export const translationsRegistry: Record<string, TranslationStrings> = {
  en: enTranslations,
  hi: hiTranslations,
  bn: {
    ...enTranslations,
    brand: "কৃষি মিত্র",
    tagline: "এআই চালিত বহু-ফসল রোগ নির্ণয় ও কৃষক সহায়তা",
    nav: { ...enTranslations.nav, home: "হোম", dashboard: "ড্যাশবোর্ড", predict: "রোগ নির্ণয়", assistant: "এআই সহকারী", history: "আমার রেকর্ড", login: "লগ ইন", signup: "নিবন্ধন" }
  },
  mr: {
    ...hiTranslations,
    brand: "कृषी मित्र",
    tagline: "एआय आधारित बहु-पीक रोग निदान आणि शेतकरी सहाय्य",
    nav: { ...hiTranslations.nav, home: "मुख्यपृष्ठ", dashboard: "डॅशबोर्ड", predict: "रोग निदान", assistant: "एआय सहाय्यक", history: "माझा इतिहास", login: "लॉग इन", signup: "नोंदणी" }
  },
  pa: {
    ...hiTranslations,
    brand: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ",
    tagline: "ਏਆਈ ਅਧਾਰਤ ਬਹੁ-ਫ਼ਸਲੀ ਰੋਗ ਪਛਾਣ ਅਤੇ ਕਿਸਾਨ ਸਹਾਇਤਾ",
    nav: { ...hiTranslations.nav, home: "ਮੁੱਖ ਪੰਨਾ", dashboard: "ਡੈਸ਼ਬੋਰਡ", predict: "ਰੋਗ ਪਛਾਣ", assistant: "ਏਆਈ ਸਹਾਇਕ", history: "ਮੇਰਾ ਇਤਿਹਾਸ" }
  },
  gu: {
    ...hiTranslations,
    brand: "કૃષિ મિત્ર",
    tagline: "એઆઈ આધારિત બહુ-પાક રોગ નિદાન અને ખેડૂત સહાય",
    nav: { ...hiTranslations.nav, home: "મુખ્ય પૃષ્ઠ", dashboard: "ડેશબોર્ડ", predict: "રોગ નિદાન", assistant: "એઆઈ સહાયક", history: "મારો ઇતિહાસ" }
  },
  ta: {
    ...enTranslations,
    brand: "க்ரிஷி மித்ரா",
    tagline: "AI பயிர் நோய் கண்டறிதல் மற்றும் விவசாயி உதவி தளம்",
    nav: { ...enTranslations.nav, home: "முகப்பு", dashboard: "டாஷ்போர்டு", predict: "நோய் கண்டறிதல்", assistant: "AI உதவியாளர்", history: "என் வரலாறு" }
  },
  te: {
    ...enTranslations,
    brand: "కృషి మిత్ర",
    tagline: "AI పంట తెగుళ్ల గుర్తింపు మరియు రైతు సహాయక వేదిక",
    nav: { ...enTranslations.nav, home: "హోమ్", dashboard: "డ్యాష్‌బోర్డ్", predict: "తెగుళ్ల గుర్తింపు", assistant: "AI సహాయకుడు", history: "నా రికార్డులు" }
  },
  kn: {
    ...enTranslations,
    brand: "ಕೃಷಿ ಮಿತ್ರ",
    tagline: "AI ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ರೈತ ಸಹಾಯಕ ವೇದಿಕೆ",
    nav: { ...enTranslations.nav, home: "ಮುಖಪುಟ", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", predict: "ರೋಗ ಪತ್ತೆ", assistant: "AI ಸಹಾಯಕ", history: "ನನ್ನ ದಾಖಲೆಗಳು" }
  },
  ur: {
    ...enTranslations,
    brand: "کرشی مترا",
    tagline: "اے آئی پر مبنی کثیر فصلی امراض کی تشخیص اور کسان مددگار پلیٹ فارم",
    nav: { ...enTranslations.nav, home: "ہوم", dashboard: "ڈیش بورڈ", predict: "تشخیص امراض", assistant: "اے آئی معاون", history: "میری تاریخ" }
  }
};
