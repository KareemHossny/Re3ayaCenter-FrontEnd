// utils/medicalTranslator.js

// قاموس الترجمة للكلمات الطبية المطلوبة فقط
const medicalDictionary = {
    // التخصصات المطلوبة
    'أنف وأذن وحنجره': 'Ear, Nose and Throat',
    'أطفال': 'Pediatrics',
    'أسنان': 'Dentistry',
    'باطنة': 'Internal Medicine',
    'الجهاز الهضمي': 'Gastroenterology',
    'الجراحة العامة': 'General Surgery',
    'عيون': 'Ophthalmology',
    'جلدية': 'Dermatology',
    'جراحة العظام': 'Orthopedic Surgery',
    'نساء والتوليد': 'Gynecology and Obstetrics',
    'مخ وأعصاب': 'Neurology',
    'قلب وأوعية الدموية': 'Cardiology and Vascular'
  };
  
  export const translateMedicalText = (text, currentLanguage) => {
    // إذا كانت اللغة عربية، أرجع النص كما هو
    if (currentLanguage === 'ar') {
      return text;
    }
  
    // إذا كانت اللغة إنجليزية، ابحث عن الكلمات المطلوبة فقط
    if (currentLanguage === 'en') {
      if (!text || typeof text !== 'string') return text;
      
      let translatedText = text;
      
      // ابحث عن كل كلمة في القاموس واستبدلها
      Object.keys(medicalDictionary).forEach(arabicWord => {
        if (translatedText.includes(arabicWord)) {
          const englishTranslation = medicalDictionary[arabicWord];
          translatedText = translatedText.replace(
            new RegExp(arabicWord, 'g'), 
            englishTranslation
          );
        }
      });
      
      return translatedText;
    }
  
    // لأي لغة أخرى، أرجع النص الأصلي
    return text;
  };