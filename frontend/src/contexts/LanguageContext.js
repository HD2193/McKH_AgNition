import React, { createContext, useContext, useState, useEffect } from 'react';

// Translation data
const translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    kn: 'ಮುಖ್ಯ',
    ta: 'முகப்பு',
    te: 'ముఖ్యం',
    mr: 'मुख्य',
    bn: 'হোম',
    gu: 'હોમ'
  },
  'nav.myFarm': {
    en: 'My Farm',
    hi: 'मेरा खेत',
    kn: 'ನನ್ನ ಫಾರ್ಮ್',
    ta: 'என் பண்ணை',
    te: 'నా వ్యవసాయం',
    mr: 'माझे शेत',
    bn: 'আমার খামার',
    gu: 'મારું ખેત'
  },
  'nav.market': {
    en: 'Market',
    hi: 'बाजार',
    kn: 'ಮಾರುಕಟ್ಟೆ',
    ta: 'சந்தை',
    te: 'మార్కెట్',
    mr: 'बाजार',
    bn: 'বাজার',
    gu: 'બજાર'
  },
  'nav.schemes': {
    en: 'Schemes',
    hi: 'योजनाएं',
    kn: 'ಯೋಜನೆಗಳು',
    ta: 'திட்டங்கள்',
    te: 'పథకాలు',
    mr: 'योजना',
    bn: 'প্রকল্প',
    gu: 'યોજનાઓ'
  },
  'nav.profile': {
    en: 'Profile',
    hi: 'प्रोफाइल',
    kn: 'ಪ್ರೊಫೈಲ್',
    ta: 'சுயவிவரம்',
    te: 'ప్రొఫైల్',
    mr: 'प्रोफाइल',
    bn: 'প্রোফাইল',
    gu: 'પ્રોફાઇલ'
  },
  
  // Home page
  'home.greeting': {
    en: 'Hello! I am your agricultural assistant',
    hi: 'नमस्ते! मैं आपका कृषि सहायक हूं',
    kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ',
    ta: 'வணக்கம்! நான் உங்கள் விவசாய உதவியாளர்',
    te: 'నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడు',
    mr: 'नमस्कार! मी तुमचा कृषी सहायक आहे',
    bn: 'নমস্কার! আমি আপনার কৃষি সহায়ক',
    gu: 'નમસ્કાર! હું તમારો કૃષિ સહાયક છું'
  },
  'home.searchPlaceholder': {
    en: 'Search for crops, markets, schemes...',
    hi: 'फसल, बाजार, योजना खोजें...',
    kn: 'ಬೆಳೆಗಳು, ಮಾರುಕಟ್ಟೆಗಳು, ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ...',
    ta: 'பயிர்கள், சந்தைகள், திட்டங்களைத் தேடுங்கள்...',
    te: 'పంటలు, మార్కెట్లు, పథకాలను వెతకండి...',
    mr: 'पिके, बाजार, योजना शोधा...',
    bn: 'ফসল, বাজার, প্রকল্প খুঁজুন...',
    gu: 'પાક, બજાર, યોજનાઓ શોધો...'
  },
  'home.uploadImage': {
    en: 'Upload Image',
    hi: 'तस्वीर अपलोड करें',
    kn: 'ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
    ta: 'படத்தைப் பதிவேற்றவும்',
    te: 'చిత్రం అప్‌లోడ్ చేయండి',
    mr: 'चित्र अपलोड करा',
    bn: 'ছবি আপলোড করুন',
    gu: 'ચિત્ર અપલોડ કરો'
  },
  'home.quickAccess': {
    en: 'Quick Access',
    hi: 'त्वरित पहुंच',
    kn: 'ತ್ವರಿತ ಪ್ರವೇಶ',
    ta: 'விரைவு அணுகல்',
    te: 'త్వరిత ప్రవేశం',
    mr: 'द्रुत प्रवेश',
    bn: 'দ্রুত প্রবেশ',
    gu: 'ઝડપી પ્રવેશ'
  },
  'home.todaysWeather': {
    en: "Today's Weather",
    hi: 'आज का मौसम',
    kn: 'ಇಂದಿನ ಹವಾಮಾನ',
    ta: 'இன்றைய வானிலை',
    te: 'నేటి వాతావరణం',
    mr: 'आजचे हवामान',
    bn: 'আজকের আবহাওয়া',
    gu: 'આજનું હવામાન'
  },
  
  // Crop Info
  'crop.info': {
    en: 'Crop Info',
    hi: 'फसल जानकारी',
    kn: 'ಬೆಳೆ ಮಾಹಿತಿ',
    ta: 'பயிர் தகவல்',
    te: 'పంట సమాచారం',
    mr: 'पिक माहिती',
    bn: 'ফসল তথ্য',
    gu: 'પાક માહિતી'
  },
  'crop.diagnosis': {
    en: 'Crop Diagnosis',
    hi: 'फसल निदान',
    kn: 'ಬೆಳೆ ರೋಗನಿರ್ಣಯ',
    ta: 'பயிர் நோயறிதல்',
    te: 'పంట నిర్ధారణ',
    mr: 'पिक निदान',
    bn: 'ফসল নির্ণয়',
    gu: 'પાક નિદાન'
  },
  'crop.uploadImage': {
    en: 'Upload Crop Image',
    hi: 'फसल की तस्वीर अपलोड करें',
    kn: 'ಬೆಳೆಯ ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ',
    ta: 'பயிர் படத்தைப் பதிவேற்றவும்',
    te: 'పంట చిత్రాన్ని అప్‌లోడ్ చేయండి',
    mr: 'पिकाचे चित्र अपलोड करा',
    bn: 'ফসলের ছবি আপলোড করুন',
    gu: 'પાકનું ચિત્ર અપલોડ કરો'
  },
  'crop.gallery': {
    en: 'Gallery',
    hi: 'गैलरी',
    kn: 'ಗ್ಯಾಲರಿ',
    ta: 'தொகுப்பு',
    te: 'గ్యాలరీ',
    mr: 'गॅलरी',
    bn: 'গ্যালারি',
    gu: 'ગેલેરી'
  },
  'crop.camera': {
    en: 'Camera',
    hi: 'कैमरा',
    kn: 'ಕ್ಯಾಮೆರಾ',
    ta: 'கேமரா',
    te: 'కెమెరా',
    mr: 'कॅमेरा',
    bn: 'ক্যামেরা',
    gu: 'કેમેરા'
  },
  'crop.analyzing': {
    en: 'Analyzing crop...',
    hi: 'फसल का विश्लेषण हो रहा है...',
    kn: 'ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
    ta: 'பயிரை பகுப்பாய்வு செய்கிறது...',
    te: 'పంటను విశ్లేషిస్తోంది...',
    mr: 'पिकाचे विश्लेषण करत आहे...',
    bn: 'ফসল বিশ্লেষণ করছে...',
    gu: 'પાકનું વિશ્લેષણ કરી રહ્યું છે...'
  },
  'crop.diseaseIdentified': {
    en: 'Disease Identified',
    hi: 'रोग की पहचान',
    kn: 'ರೋಗ ಗುರುತಿಸಲಾಗಿದೆ',
    ta: 'நோய் கண்டறியப்பட்டது',
    te: 'వ్యాధి గుర్తించబడింది',
    mr: 'रोगाची ओळख',
    bn: 'রোগ চিহ্নিত',
    gu: 'રોગ ઓળખાયો'
  },
  'crop.treatmentRecommendations': {
    en: 'Treatment Recommendations',
    hi: 'उपचार सुझाव',
    kn: 'ಚಿಕಿತ್ಸಾ ಶಿಫಾರಸುಗಳು',
    ta: 'சிகிச்சை பரிந்துரைகள்',
    te: 'చికిత్స సిఫారసులు',
    mr: 'उपचार शिफारसी',
    bn: 'চিকিৎসা সুপারিশ',
    gu: 'સારવાર ભલામણો'
  },
  'crop.additionalResources': {
    en: 'Additional Resources',
    hi: 'अतिरिक्त संसाधन',
    kn: 'ಹೆಚ್ಚುವರಿ ಸಂಪನ್ಮೂಲಗಳು',
    ta: 'கூடுதல் வளங்கள்',
    te: 'అదనపు వనరులు',
    mr: 'अतिरिक्त संसाधने',
    bn: 'অতিরিক্ত সংস্থান',
    gu: 'વધારાના સંસાધનો'
  },
  
  // Market Prices
  'market.prices': {
    en: 'Market Prices',
    hi: 'बाजार भाव',
    kn: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
    ta: 'சந்தை விலைகள்',
    te: 'మార్కెట్ ధరలు',
    mr: 'बाजार भाव',
    bn: 'বাজার দর',
    gu: 'બજાર ભાવ'
  },
  'market.todaysPrices': {
    en: "Today's Prices",
    hi: 'आज के भाव',
    kn: 'ಇಂದಿನ ಬೆಲೆಗಳು',
    ta: 'இன்றைய விலைகள்',
    te: 'నేటి ధరలు',
    mr: 'आजचे भाव',
    bn: 'আজকের দর',
    gu: 'આજના ભાવ'
  },
  'market.aiRecommendations': {
    en: 'AI Selling Recommendations',
    hi: 'AI बिक्री सुझाव',
    kn: 'AI ಮಾರಾಟ ಶಿಫಾರಸುಗಳು',
    ta: 'AI விற்பனை பரிந்துரைகள்',
    te: 'AI అమ్మకాల సిఫారసులు',
    mr: 'AI विक्री शिफारसी',
    bn: 'AI বিক্রয় সুপারিশ',
    gu: 'AI વેચાણ ભલામણો'
  },
  'market.averagePrice': {
    en: 'Average price',
    hi: 'औसत भाव',
    kn: 'ಸರಾಸರಿ ಬೆಲೆ',
    ta: 'சராசரி விலை',
    te: 'సగటు ధర',
    mr: 'सरासरी भाव',
    bn: 'গড় দর',
    gu: 'સરેરાશ ભાવ'
  },
  'market.current': {
    en: 'Current',
    hi: 'वर्तमान',
    kn: 'ಪ್ರಸ್ತುತ',
    ta: 'தற்போதைய',
    te: 'ప్రస్తుత',
    mr: 'सध्याचे',
    bn: 'বর্তমান',
    gu: 'વર્તમાન'
  },
  'market.viewDetails': {
    en: 'View Details',
    hi: 'विवरण देखें',
    kn: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    ta: 'விவரங்களைப் பார்க்கவும்',
    te: 'వివరాలను చూడండి',
    mr: 'तपशील पहा',
    bn: 'বিস্তারিত দেখুন',
    gu: 'વિગતો જુઓ'
  },
  
  // Government Schemes
  'schemes.government': {
    en: 'Government Schemes',
    hi: 'सरकारी योजनाएं',
    kn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    ta: 'அரசு திட்டங்கள்',
    te: 'ప్రభుత్వ పథకాలు',
    mr: 'सरकारी योजना',
    bn: 'সরকারি প্রকল্প',
    gu: 'સરકારી યોજનાઓ'
  },
  'schemes.popular': {
    en: 'Popular Schemes',
    hi: 'लोकप्रिय योजनाएं',
    kn: 'ಜನಪ್ರಿಯ ಯೋಜನೆಗಳು',
    ta: 'பிரபலமான திட்டங்கள்',
    te: 'జనాదరణ పొందిన పథకాలు',
    mr: 'लोकप्रिय योजना',
    bn: 'জনপ্রিয় প্রকল্প',
    gu: 'લોકપ્રિય યોજનાઓ'
  },
  'schemes.all': {
    en: 'All Schemes',
    hi: 'सभी योजनाएं',
    kn: 'ಎಲ್ಲಾ ಯೋಜನೆಗಳು',
    ta: 'அனைத்து திட்டங்கள்',
    te: 'అన్ని పథకాలు',
    mr: 'सर्व योजना',
    bn: 'সব প্রকল্প',
    gu: 'બધી યોજનાઓ'
  },
  'schemes.eligibility': {
    en: 'Eligibility',
    hi: 'पात्रता',
    kn: 'ಅರ್ಹತೆ',
    ta: 'தகுதி',
    te: 'అర్హత',
    mr: 'पात्रता',
    bn: 'যোগ্যতা',
    gu: 'પાત્રતા'
  },
  'schemes.applyNow': {
    en: 'Apply Now',
    hi: 'अभी आवेदन करें',
    kn: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    ta: 'இப்போது விண்ணப்பிக்கவும்',
    te: 'ఇప్పుడే దరఖాస్తు చేయండి',
    mr: 'आता अर्ज करा',
    bn: 'এখনই আবেদন করুন',
    gu: 'હવે અરજી કરો'
  },
  
  // My Farm
  'farm.myFarm': {
    en: 'My Farm',
    hi: 'मेरा खेत',
    kn: 'ನನ್ನ ಫಾರ್ಮ್',
    ta: 'என் பண்ணை',
    te: 'నా వ్యవసాయం',
    mr: 'माझे शेत',
    bn: 'আমার খামার',
    gu: 'મારું ખેત'
  },
  'farm.todaysAdvice': {
    en: "Today's Advice",
    hi: 'आज की सलाह',
    kn: 'ಇಂದಿನ ಸಲಹೆ',
    ta: 'இன்றைய அறிவுரை',
    te: 'నేటి సలహా',
    mr: 'आजचा सल्ला',
    bn: 'আজকের পরামর্শ',
    gu: 'આજની સલાહ'
  },
  'farm.upcomingTasks': {
    en: 'Upcoming Tasks',
    hi: 'आने वाले कार्य',
    kn: 'ಮುಂದಿನ ಕಾರ್ಯಗಳು',
    ta: 'வரும் பணிகள்',
    te: 'రాబోయే పనులు',
    mr: 'येणारी कामे',
    bn: 'আসন্ন কাজ',
    gu: 'આવતા કાર્યો'
  },
  'farm.dailyTasks': {
    en: 'Daily Tasks',
    hi: 'दैनिक कार्य',
    kn: 'ದೈನಂದಿನ ಕಾರ್ಯಗಳು',
    ta: 'தினசரி பணிகள்',
    te: 'రోజువారీ పనులు',
    mr: 'दैनिक कामे',
    bn: 'দৈনিক কাজ',
    gu: 'દૈનિક કાર્યો'
  },
  
  // Voice messages
  'voice.listening': {
    en: 'Listening...',
    hi: 'सुन रहा हूं...',
    kn: 'ಕೇಳುತ್ತಿದೆ...',
    ta: 'கேட்டுக்கொண்டிருக்கிறது...',
    te: 'వింటోంది...',
    mr: 'ऐकत आहे...',
    bn: 'শুনছে...',
    gu: 'સાંભળી રહ્યું છે...'
  },
  'voice.pleaseSpeak': {
    en: 'Please speak',
    hi: 'कृपया बोलें',
    kn: 'ದಯವಿಟ್ಟು ಮಾತನಾಡಿ',
    ta: 'தயவுசெய்து பேசுங்கள்',
    te: 'దయచేసి మాట్లాడండి',
    mr: 'कृपया बोला',
    bn: 'অনুগ্রহ করে বলুন',
    gu: 'કૃપા કરીને બોલો'
  },
  'voice.understood': {
    en: 'Understood!',
    hi: 'समझ गया!',
    kn: 'ಅರ್ಥವಾಯಿತು!',
    ta: 'புரிந்தது!',
    te: 'అర్థమైంది!',
    mr: 'समजले!',
    bn: 'বুঝেছি!',
    gu: 'સમજાયું!'
  },
  'voice.youSaid': {
    en: 'You said',
    hi: 'आपने कहा',
    kn: 'ನೀವು ಹೇಳಿದ್ದು',
    ta: 'நீங்கள் சொன்னது',
    te: 'మీరు చెప్పింది',
    mr: 'तुम्ही म्हणाल',
    bn: 'আপনি বলেছেন',
    gu: 'તમે કહ્યું'
  },
  'voice.sorry': {
    en: 'Sorry',
    hi: 'माफ करें',
    kn: 'ಕ್ಷಮಿಸಿ',
    ta: 'மன்னிக்கவும்',
    te: 'క్షమించండి',
    mr: 'माफ करा',
    bn: 'দুঃখিত',
    gu: 'માફ કરશો'
  },
  'voice.errorUnderstanding': {
    en: 'Error understanding voice. Please try again.',
    hi: 'आवाज समझने में समस्या हुई। कृपया दोबारा कोशिश करें।',
    kn: 'ಧ್ವನಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    ta: 'குரல் புரிந்துகொள்வதில் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
    te: 'వాయిస్ అర్థం చేసుకోవడంలో లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.',
    mr: 'आवाज समजण्यात त्रुटी. कृपया पुन्हा प्रयत्न करा.',
    bn: 'কণ্ঠস্বর বুঝতে ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।',
    gu: 'અવાજ સમજવામાં ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો.'
  },
  'voice.notSupported': {
    en: 'Your browser does not support voice',
    hi: 'आपका ब्राउज़र वॉइस सपोर्ट नहीं करता',
    kn: 'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಧ್ವನಿ ಬೆಂಬಲವನ್ನು ನೀಡುವುದಿಲ್ಲ',
    ta: 'உங்கள் உலாவி குரல் ஆதரவு அளிக்காது',
    te: 'మీ బ్రౌజర్ వాయిస్ సపోర్ట్ చేయదు',
    mr: 'तुमचा ब्राउझर व्हॉइस सपोर्ट करत नाही',
    bn: 'আপনার ব্রাউজার ভয়েস সাপোর্ট করে না',
    gu: 'તમારું બ્રાઉઝર વૉઇસ સપોર્ટ કરતું નથી'
  },
  'voice.commandNotUnderstood': {
    en: 'Command not understood',
    hi: 'कमांड समझा नहीं',
    kn: 'ಆಜ್ಞೆ ಅರ್ಥವಾಗಲಿಲ್ಲ',
    ta: 'கட்டளை புரியவில்லை',
    te: 'కమాండ్ అర్థం కాలేదు',
    mr: 'आदेश समजला नाही',
    bn: 'কমান্ড বুঝতে পারিনি',
    gu: 'આદેશ સમજાયો નથી'
  },
  'voice.askAbout': {
    en: 'Please ask about "crop", "market", "scheme" or "farm"',
    hi: 'कृपया "फसल", "बाजार", "योजना" या "खेत" के बारे में पूछें',
    kn: 'ದಯವಿಟ್ಟು "ಬೆಳೆ", "ಮಾರುಕಟ್ಟೆ", "ಯೋಜನೆ" ಅಥವಾ "ಫಾರ್ಮ್" ಬಗ್ಗೆ ಕೇಳಿ',
    ta: 'தயவுசெய்து "பயிர்", "சந்தை", "திட்டம்" அல்லது "பண்ணை" பற்றி கேளுங்கள்',
    te: 'దయచేసి "పంట", "మార్కెట్", "పథకం" లేదా "వ్యవసాయం" గురించి అడగండి',
    mr: 'कृपया "पिक", "बाजार", "योजना" किंवा "शेत" बद्दल विचारा',
    bn: 'অনুগ্রহ করে "ফসল", "বাজার", "প্রকল্প" বা "খামার" সম্পর্কে জিজ্ঞাসা করুন',
    gu: 'કૃપા કરીને "પાક", "બજાર", "યોજના" અથવા "ખેત" વિશે પૂછો'
  },
  
  // System messages
  'system.uploading': {
    en: 'Uploading...',
    hi: 'अपलोड हो रहा है...',
    kn: 'ಅಪ್ಲೋಡ್ ಮಾಡುತ್ತಿದೆ...',
    ta: 'பதிவேற்றுகிறது...',
    te: 'అప్‌లోడ్ అవుతోంది...',
    mr: 'अपलोड करत आहे...',
    bn: 'আপলোড করছে...',
    gu: 'અપલોડ કરી રહ્યું છે...'
  },
  'system.pleaseWait': {
    en: 'Please wait...',
    hi: 'कृपया प्रतीक्षा करें...',
    kn: 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...',
    ta: 'தயவுசெய்து காத்திருங்கள்...',
    te: 'దయచేసి వేచి ఉండండి...',
    mr: 'कृपया प्रतीक्षा करा...',
    bn: 'অনুগ্রহ করে অপেক্ষা করুন...',
    gu: 'કૃપા કરીને રાહ જુઓ...'
  },
  'system.tryAgain': {
    en: 'Please try again',
    hi: 'कृपया दोबारा कोशिश करें',
    kn: 'ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    ta: 'தயவுசெய்து மீண்டும் முயற்சிக்கவும்',
    te: 'దయచేసి మళ్లీ ప్రయత్నించండి',
    mr: 'कृपया पुन्हा प्रयत्न करा',
    bn: 'অনুগ্রহ করে আবার চেষ্টা করুন',
    gu: 'કૃપા કરીને ફરી પ્રયાસ કરો'
  },
  'system.error': {
    en: 'An error occurred',
    hi: 'एक त्रुटि हुई',
    kn: 'ದೋಷ ಸಂಭವಿಸಿದೆ',
    ta: 'பிழை ஏற்பட்டது',
    te: 'దోషం సంభవించింది',
    mr: 'एक त्रुटी झाली',
    bn: 'একটি ত্রুটি ঘটেছে',
    gu: 'એક ભૂલ થઈ'
  }
};

// Language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('hi'); // Default to Hindi
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('kisan_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
    setIsLoading(false);
  }, []);

  // Save language preference
  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('kisan_language', languageCode);
  };

  // Translation function
  const translate = (key, fallback = key) => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return fallback;
    }
    return translation[currentLanguage] || translation['en'] || fallback;
  };

  // Get language code for API calls
  const getLanguageCode = () => {
    const langCodes = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'kn': 'kn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN'
    };
    return langCodes[currentLanguage] || 'hi-IN';
  };

  // Get language name
  const getLanguageName = (code = currentLanguage) => {
    const langNames = {
      'en': 'English',
      'hi': 'हिंदी',
      'kn': 'ಕನ್ನಡ',
      'ta': 'தமிழ்',
      'te': 'తెలుగు',
      'mr': 'मराठी',
      'bn': 'বাংলা',
      'gu': 'ગુજરાતી'
    };
    return langNames[code] || 'हिंदी';
  };

  // Available languages
  const availableLanguages = [
    { code: 'hi', name: 'हिंदी', nameEn: 'Hindi' },
    { code: 'en', name: 'English', nameEn: 'English' },
    { code: 'kn', name: 'ಕನ್ನಡ', nameEn: 'Kannada' },
    { code: 'ta', name: 'தமிழ்', nameEn: 'Tamil' },
    { code: 'te', name: 'తెలుగు', nameEn: 'Telugu' },
    { code: 'mr', name: 'मराठी', nameEn: 'Marathi' },
    { code: 'bn', name: 'বাংলা', nameEn: 'Bengali' },
    { code: 'gu', name: 'ગુજરાતી', nameEn: 'Gujarati' }
  ];

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    getLanguageCode,
    getLanguageName,
    availableLanguages,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;