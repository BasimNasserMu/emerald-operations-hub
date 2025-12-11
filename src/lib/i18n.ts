// Bilingual translations (Arabic & English)

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // App
    appName: 'مرقاب',
    appTagline: 'نظام كشف التمويه العسكري',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    analyze: 'تحليل',
    reports: 'التقارير',
    assistant: 'المساعد',
    settings: 'الإعدادات',
    
    // Dashboard
    totalDetections: 'إجمالي الاكتشافات',
    criticalAlerts: 'التنبيهات الحرجة',
    meanTimeToDetect: 'متوسط وقت الكشف',
    meanTimeToRespond: 'متوسط وقت الاستجابة',
    recentDetections: 'الاكتشافات الأخيرة',
    viewAll: 'عرض الكل',
    
    // Analysis
    uploadImage: 'رفع صورة',
    uploadVideo: 'رفع فيديو',
    dragDrop: 'اسحب وأفلت الملفات هنا',
    or: 'أو',
    browse: 'تصفح',
    analyzing: 'جاري التحليل...',
    noDetection: 'لم يتم اكتشاف أي تمويه',
    detectionFound: 'تم الكشف عن تمويه',
    soldiers: 'جنود',
    confidence: 'الثقة',
    
    // Reports
    reportId: 'رقم التقرير',
    timestamp: 'الوقت',
    location: 'الموقع',
    severity: 'الخطورة',
    status: 'الحالة',
    soldierCount: 'عدد الجنود',
    environment: 'البيئة',
    equipment: 'المعدات',
    camouflage: 'نوع التمويه',
    
    // Severity
    high: 'عالي',
    medium: 'متوسط',
    low: 'منخفض',
    
    // Status
    new: 'جديد',
    inProgress: 'قيد المعالجة',
    closed: 'مغلق',
    
    // Time ranges
    last24h: 'آخر 24 ساعة',
    last7d: 'آخر 7 أيام',
    last30d: 'آخر 30 يوم',
    allTime: 'كل الوقت',
    
    // Assistant
    askMoraqib: 'اسأل مراقب',
    typeQuestion: 'اكتب سؤالك هنا...',
    send: 'إرسال',
    exampleQueries: 'أمثلة على الأسئلة',
    
    // Health
    systemStatus: 'حالة النظام',
    online: 'متصل',
    offline: 'غير متصل',
    modelLoaded: 'النموذج محمّل',
    aiAvailable: 'الذكاء الاصطناعي متاح',
    
    // Actions
    download: 'تحميل',
    export: 'تصدير',
    refresh: 'تحديث',
    filter: 'تصفية',
    search: 'بحث',
    
    // Messages
    processingImage: 'جاري معالجة الصورة...',
    processingVideo: 'جاري معالجة الفيديو...',
    analysisComplete: 'اكتمل التحليل',
    errorOccurred: 'حدث خطأ',
    noData: 'لا توجد بيانات',
  },
  en: {
    // App
    appName: 'MIRQAB',
    appTagline: 'Military Camouflage Detection System',
    
    // Navigation
    dashboard: 'Dashboard',
    analyze: 'Analyze',
    reports: 'Reports',
    assistant: 'Assistant',
    settings: 'Settings',
    
    // Dashboard
    totalDetections: 'Total Detections',
    criticalAlerts: 'Critical Alerts',
    meanTimeToDetect: 'Mean Time to Detect',
    meanTimeToRespond: 'Mean Time to Respond',
    recentDetections: 'Recent Detections',
    viewAll: 'View All',
    
    // Analysis
    uploadImage: 'Upload Image',
    uploadVideo: 'Upload Video',
    dragDrop: 'Drag & drop files here',
    or: 'or',
    browse: 'Browse',
    analyzing: 'Analyzing...',
    noDetection: 'No camouflage detected',
    detectionFound: 'Camouflage Detected',
    soldiers: 'soldiers',
    confidence: 'Confidence',
    
    // Reports
    reportId: 'Report ID',
    timestamp: 'Timestamp',
    location: 'Location',
    severity: 'Severity',
    status: 'Status',
    soldierCount: 'Soldier Count',
    environment: 'Environment',
    equipment: 'Equipment',
    camouflage: 'Camouflage Type',
    
    // Severity
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Status
    new: 'New',
    inProgress: 'In Progress',
    closed: 'Closed',
    
    // Time ranges
    last24h: 'Last 24 Hours',
    last7d: 'Last 7 Days',
    last30d: 'Last 30 Days',
    allTime: 'All Time',
    
    // Assistant
    askMoraqib: 'Ask Moraqib',
    typeQuestion: 'Type your question here...',
    send: 'Send',
    exampleQueries: 'Example Queries',
    
    // Health
    systemStatus: 'System Status',
    online: 'Online',
    offline: 'Offline',
    modelLoaded: 'Model Loaded',
    aiAvailable: 'AI Available',
    
    // Actions
    download: 'Download',
    export: 'Export',
    refresh: 'Refresh',
    filter: 'Filter',
    search: 'Search',
    
    // Messages
    processingImage: 'Processing image...',
    processingVideo: 'Processing video...',
    analysisComplete: 'Analysis Complete',
    errorOccurred: 'Error Occurred',
    noData: 'No Data',
  },
};

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || key;
}
