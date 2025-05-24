import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Language definitions
export const languages = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  zh: { code: 'zh', name: '中文', flag: '🇨🇳' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ko: { code: 'ko', name: '한국어', flag: '🇰🇷' },
  pt: { code: 'pt', name: 'Português', flag: '🇧🇷' },
  it: { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ru: { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ar: { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  hi: { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
} as const;

export type LanguageCode = keyof typeof languages;

// Translation keys and values
export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.materials': 'Materials',
    'nav.path': 'Learning Path',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    
    // Welcome Screen
    'welcome.title': 'What can I help with?',
    'welcome.subtitle': "I'm your AI visual tutor. Ask me anything and I'll explain it with images, mind maps, and interactive content.",
    'welcome.createImage': '🖼️ Create an image',
    'welcome.createImageDesc': 'Visual explanations',
    'welcome.makeMindMap': '🧠 Make a mind map',
    'welcome.makeMindMapDesc': 'Organize knowledge',
    'welcome.explainTopic': '📚 Explain a topic',
    'welcome.explainTopicDesc': 'Deep dive learning',
    'welcome.voiceQuestion': '🎤 Ask with voice',
    'welcome.voiceQuestionDesc': 'Speak your question',
    
    // Chat Interface
    'chat.placeholder': 'Ask me anything to start learning...',
    'chat.send': 'Send',
    'chat.listening': 'Listening...',
    'chat.thinking': 'AI is thinking...',
    'chat.generating': 'Generating visual...',
    'chat.generatingMindMap': 'Creating mind map...',
    
    // Feature Controls
    'features.autoVoice': 'Auto Voice',
    'features.autoVoiceDesc': 'AI will read responses aloud',
    'features.autoImages': 'Auto Images',
    'features.autoImagesDesc': 'Generate visual aids automatically',
    'features.mindMaps': 'Mind Maps',
    'features.mindMapsDesc': 'Create interactive mind maps',
    'features.emojis': 'Emojis',
    'features.emojisDesc': 'Add emojis to responses',
    'features.help': 'Help & Tutorial',
    'features.helpDesc': 'Learn how to use all features',
    'features.settings': 'Advanced Settings',
    'features.settingsDesc': 'Configure voice speed, image styles, etc.',
    
    // Help Section
    'help.title': 'How to Use Liquid Learning Lab',
    'help.autoVoiceTitle': 'Auto Voice:',
    'help.autoVoiceDesc': 'AI reads responses aloud automatically. Use voice controls to pause/resume.',
    'help.autoImagesTitle': 'Auto Images:',
    'help.autoImagesDesc': 'Generate visual aids for better understanding. Click to download or zoom.',
    'help.mindMapsTitle': 'Mind Maps:',
    'help.mindMapsDesc': 'Interactive topic maps you can click to explore deeper.',
    'help.emojisTitle': 'Emojis:',
    'help.emojisDesc': 'Add relevant emojis to make learning more engaging and fun.',
    'help.tip': '💡 Tip: Hover over any icon to see what it does. Use the category selector to organize your learning sessions by subject.',
    
    // Study Materials
    'materials.title': 'Study Materials',
    'materials.subtitle': 'Organize, review, and master your learning content',
    'materials.available': 'Materials Available',
    'materials.mindMaps': 'Mind Maps',
    'materials.images': 'Images',
    'materials.notes': 'Notes',
    'materials.quizzes': 'Quizzes',
    'materials.searchFilter': 'Search & Filter',
    'materials.searchPlaceholder': 'Search materials, descriptions, or tags...',
    'materials.subject': 'Subject',
    'materials.allSubjects': 'All Subjects',
    'materials.type': 'Type',
    'materials.allTypes': 'All Types',
    'materials.difficulty': 'Difficulty',
    'materials.allLevels': 'All Levels',
    'materials.sortBy': 'Sort By',
    'materials.lastAccessed': 'Last Accessed',
    'materials.progress': 'Progress',
    'materials.title_': 'Title',
    'materials.beginner': 'Beginner',
    'materials.intermediate': 'Intermediate',
    'materials.advanced': 'Advanced',
    'materials.open': 'Open',
    'materials.download': 'Download',
    'materials.share': 'Share',
    'materials.noMaterials': 'No materials found',
    'materials.noMaterialsDesc': 'Try adjusting your search or filter criteria to find more materials.',
    'materials.createNew': 'Create New Material',
    
    // Learning Path
    'path.title': 'Learning Path',
    'path.subtitle': 'Follow your personalized journey to mastery',
    'path.complete': 'Complete',
    'path.current': 'Current Path',
    'path.allPaths': 'All Paths',
    'path.outcomes': 'Learning Outcomes',
    'path.steps': 'Steps',
    'path.duration': 'Duration',
    'path.learningSteps': 'Learning Steps',
    'path.progressSummary': 'Progress Summary',
    'path.overallProgress': 'Overall Progress',
    'path.completed': 'Completed',
    'path.remaining': 'Remaining',
    'path.estimatedTime': 'Estimated Time to Complete:',
    'path.timeRemaining': 'remaining',
    'path.nextAchievement': 'Next Achievement',
    'path.stepsRemaining': 'steps remaining',
    'path.continueLearning': 'Continue Learning',
    'path.review': 'Review',
    'path.locked': 'Locked',
    'path.switchPath': 'Switch to This Path',
    'path.currentPath': 'Current Path',
    'path.learningOutcomes': 'Learning Outcomes for',
    'path.outcomesDesc': "What you'll be able to do after completing this learning path",
    'path.prerequisites': 'Prerequisites',
    'path.required': 'required',
    
    // Dashboard
    'dashboard.title': 'Learning Dashboard',
    'dashboard.subtitle': 'Track your progress and explore your learning journey',
    'dashboard.dayStreak': 'Day Streak',
    'dashboard.progress': 'Progress',
    'dashboard.visuals': 'Visuals',
    'dashboard.topics': 'Topics',
    'dashboard.achievements': 'Achievements',
    'dashboard.overview': 'Overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.yourInterests': 'Your Interests',
    'dashboard.noInterests': 'No interests added yet. Start exploring topics to build your learning profile!',
    'dashboard.quickLearner': 'Quick Learner',
    'dashboard.quickLearnerDesc': 'Completed 5 topics in one day',
    'dashboard.mindMapMaster': 'Mind Map Master',
    'dashboard.mindMapMasterDesc': 'Created 10 interactive mind maps',
    'dashboard.yourMaterials': 'Your Study Materials',
    'dashboard.filterBy': 'Filter by:',
    'dashboard.personalizedPath': 'Personalized Learning Path',
    'dashboard.detailedProgress': 'Detailed Progress',
    'dashboard.visualsCreated': 'Visuals Created:',
    'dashboard.lastActivity': 'Last Activity:',
    
    // Sidebar
    'sidebar.menu': 'L³ Menu',
    'sidebar.startLearning': 'Start Learning',
    'sidebar.aiSuggestions': 'AI Suggestions',
    'sidebar.learningInterests': 'Learning Interests',
    'sidebar.addInterest': 'Add new interest...',
    'sidebar.suggestedTopics': 'Suggested Topics',
    'sidebar.recentSessions': 'Recent Learning Sessions',
    'sidebar.noSessions': 'No recent sessions',
    'sidebar.sessionsDesc': 'Start a conversation to see your learning history here.',
    'sidebar.newSession': 'New Learning Session',
    
    // Learning Categories
    'category.general': 'General Learning',
    'category.science': 'Science & Biology',
    'category.math': 'Mathematics',
    'category.history': 'History',
    'category.language': 'Language Arts',
    'category.programming': 'Programming',
    'category.art': 'Art & Design',
    
    // Voice Controls
    'voice.play': 'Play',
    'voice.pause': 'Pause',
    'voice.stop': 'Stop',
    'voice.volume': 'Volume',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.language': 'Language',
    
    // Time
    'time.minutes': 'minutes',
    'time.hours': 'hours',
    'time.days': 'days',
    'time.weeks': 'weeks',
    'time.months': 'months',
    'time.years': 'years',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.materials': 'Materiales',
    'nav.path': 'Ruta de Aprendizaje',
    'nav.dashboard': 'Panel',
    'nav.settings': 'Configuración',
    
    // Welcome Screen
    'welcome.title': '¿En qué puedo ayudarte?',
    'welcome.subtitle': 'Soy tu tutor visual con IA. Pregúntame cualquier cosa y te lo explicaré con imágenes, mapas mentales y contenido interactivo.',
    'welcome.createImage': '🖼️ Crear una imagen',
    'welcome.createImageDesc': 'Explicaciones visuales',
    'welcome.makeMindMap': '🧠 Hacer un mapa mental',
    'welcome.makeMindMapDesc': 'Organizar conocimiento',
    'welcome.explainTopic': '📚 Explicar un tema',
    'welcome.explainTopicDesc': 'Aprendizaje profundo',
    'welcome.voiceQuestion': '🎤 Preguntar con voz',
    'welcome.voiceQuestionDesc': 'Habla tu pregunta',
    
    // Chat Interface
    'chat.placeholder': 'Pregúntame cualquier cosa para comenzar a aprender...',
    'chat.send': 'Enviar',
    'chat.listening': 'Escuchando...',
    'chat.thinking': 'La IA está pensando...',
    'chat.generating': 'Generando visual...',
    'chat.generatingMindMap': 'Creando mapa mental...',
    
    // Feature Controls
    'features.autoVoice': 'Voz Automática',
    'features.autoVoiceDesc': 'La IA leerá las respuestas en voz alta',
    'features.autoImages': 'Imágenes Automáticas',
    'features.autoImagesDesc': 'Generar ayudas visuales automáticamente',
    'features.mindMaps': 'Mapas Mentales',
    'features.mindMapsDesc': 'Crear mapas mentales interactivos',
    'features.emojis': 'Emojis',
    'features.emojisDesc': 'Agregar emojis a las respuestas',
    'features.help': 'Ayuda y Tutorial',
    'features.helpDesc': 'Aprende a usar todas las funciones',
    'features.settings': 'Configuración Avanzada',
    'features.settingsDesc': 'Configurar velocidad de voz, estilos de imagen, etc.',
    
    // Study Materials
    'materials.title': 'Materiales de Estudio',
    'materials.subtitle': 'Organiza, revisa y domina tu contenido de aprendizaje',
    'materials.available': 'Materiales Disponibles',
    'materials.mindMaps': 'Mapas Mentales',
    'materials.images': 'Imágenes',
    'materials.notes': 'Notas',
    'materials.quizzes': 'Cuestionarios',
    'materials.searchFilter': 'Buscar y Filtrar',
    'materials.searchPlaceholder': 'Buscar materiales, descripciones o etiquetas...',
    'materials.subject': 'Materia',
    'materials.allSubjects': 'Todas las Materias',
    'materials.type': 'Tipo',
    'materials.allTypes': 'Todos los Tipos',
    'materials.difficulty': 'Dificultad',
    'materials.allLevels': 'Todos los Niveles',
    'materials.sortBy': 'Ordenar Por',
    'materials.lastAccessed': 'Último Acceso',
    'materials.progress': 'Progreso',
    'materials.title_': 'Título',
    'materials.beginner': 'Principiante',
    'materials.intermediate': 'Intermedio',
    'materials.advanced': 'Avanzado',
    'materials.open': 'Abrir',
    'materials.download': 'Descargar',
    'materials.share': 'Compartir',
    'materials.noMaterials': 'No se encontraron materiales',
    'materials.noMaterialsDesc': 'Intenta ajustar tus criterios de búsqueda o filtro para encontrar más materiales.',
    'materials.createNew': 'Crear Nuevo Material',
    
    // Learning Path
    'path.title': 'Ruta de Aprendizaje',
    'path.subtitle': 'Sigue tu viaje personalizado hacia la maestría',
    'path.complete': 'Completo',
    'path.current': 'Ruta Actual',
    'path.allPaths': 'Todas las Rutas',
    'path.outcomes': 'Resultados de Aprendizaje',
    'path.steps': 'Pasos',
    'path.duration': 'Duración',
    'path.learningSteps': 'Pasos de Aprendizaje',
    'path.progressSummary': 'Resumen de Progreso',
    'path.overallProgress': 'Progreso General',
    'path.completed': 'Completado',
    'path.remaining': 'Restante',
    'path.estimatedTime': 'Tiempo Estimado para Completar:',
    'path.timeRemaining': 'restante',
    'path.nextAchievement': 'Próximo Logro',
    'path.stepsRemaining': 'pasos restantes',
    'path.continueLearning': 'Continuar Aprendiendo',
    'path.review': 'Revisar',
    'path.locked': 'Bloqueado',
    'path.switchPath': 'Cambiar a Esta Ruta',
    'path.currentPath': 'Ruta Actual',
    'path.learningOutcomes': 'Resultados de Aprendizaje para',
    'path.outcomesDesc': 'Lo que podrás hacer después de completar esta ruta de aprendizaje',
    'path.prerequisites': 'Requisitos Previos',
    'path.required': 'requerido',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.language': 'Idioma',
    
    // Time
    'time.minutes': 'minutos',
    'time.hours': 'horas',
    'time.days': 'días',
    'time.weeks': 'semanas',
    'time.months': 'meses',
    'time.years': 'años',
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.materials': 'Matériaux',
    'nav.path': 'Parcours d\'Apprentissage',
    'nav.dashboard': 'Tableau de Bord',
    'nav.settings': 'Paramètres',
    
    // Welcome Screen
    'welcome.title': 'Comment puis-je vous aider ?',
    'welcome.subtitle': 'Je suis votre tuteur visuel IA. Posez-moi n\'importe quelle question et je vous l\'expliquerai avec des images, des cartes mentales et du contenu interactif.',
    'welcome.createImage': '🖼️ Créer une image',
    'welcome.createImageDesc': 'Explications visuelles',
    'welcome.makeMindMap': '🧠 Faire une carte mentale',
    'welcome.makeMindMapDesc': 'Organiser les connaissances',
    'welcome.explainTopic': '📚 Expliquer un sujet',
    'welcome.explainTopicDesc': 'Apprentissage approfondi',
    'welcome.voiceQuestion': '🎤 Demander par la voix',
    'welcome.voiceQuestionDesc': 'Posez votre question oralement',
    
    // Chat Interface
    'chat.placeholder': 'Demandez-moi n\'importe quoi pour commencer à apprendre...',
    'chat.send': 'Envoyer',
    'chat.listening': 'Écoute...',
    'chat.thinking': 'L\'IA réfléchit...',
    'chat.generating': 'Génération visuelle...',
    'chat.generatingMindMap': 'Création de carte mentale...',
    
    // Feature Controls
    'features.autoVoice': 'Voix Automatique',
    'features.autoVoiceDesc': 'L\'IA lira les réponses à haute voix',
    'features.autoImages': 'Images Automatiques',
    'features.autoImagesDesc': 'Générer des aides visuelles automatiquement',
    'features.mindMaps': 'Cartes Mentales',
    'features.mindMapsDesc': 'Créer des cartes mentales interactives',
    'features.emojis': 'Emojis',
    'features.emojisDesc': 'Ajouter des emojis aux réponses',
    'features.help': 'Aide et Tutoriel',
    'features.helpDesc': 'Apprenez à utiliser toutes les fonctionnalités',
    'features.settings': 'Paramètres Avancés',
    'features.settingsDesc': 'Configurer la vitesse de la voix, les styles d\'image, etc.',
    
    // Common
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.ok': 'OK',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.language': 'Langue',
    
    // Time
    'time.minutes': 'minutes',
    'time.hours': 'heures',
    'time.days': 'jours',
    'time.weeks': 'semaines',
    'time.months': 'mois',
    'time.years': 'années',
  },
  
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.materials': '学习材料',
    'nav.path': '学习路径',
    'nav.dashboard': '仪表板',
    'nav.settings': '设置',
    
    // Welcome Screen
    'welcome.title': '我能帮您什么？',
    'welcome.subtitle': '我是您的AI视觉导师。问我任何问题，我会用图像、思维导图和互动内容为您解释。',
    'welcome.createImage': '🖼️ 创建图像',
    'welcome.createImageDesc': '视觉解释',
    'welcome.makeMindMap': '🧠 制作思维导图',
    'welcome.makeMindMapDesc': '组织知识',
    'welcome.explainTopic': '📚 解释主题',
    'welcome.explainTopicDesc': '深度学习',
    'welcome.voiceQuestion': '🎤 语音提问',
    'welcome.voiceQuestionDesc': '说出您的问题',
    
    // Chat Interface
    'chat.placeholder': '问我任何问题开始学习...',
    'chat.send': '发送',
    'chat.listening': '正在听...',
    'chat.thinking': 'AI正在思考...',
    'chat.generating': '生成视觉内容...',
    'chat.generatingMindMap': '创建思维导图...',
    
    // Feature Controls
    'features.autoVoice': '自动语音',
    'features.autoVoiceDesc': 'AI将朗读回答',
    'features.autoImages': '自动图像',
    'features.autoImagesDesc': '自动生成视觉辅助',
    'features.mindMaps': '思维导图',
    'features.mindMapsDesc': '创建交互式思维导图',
    'features.emojis': '表情符号',
    'features.emojisDesc': '在回答中添加表情符号',
    'features.help': '帮助和教程',
    'features.helpDesc': '学习如何使用所有功能',
    'features.settings': '高级设置',
    'features.settingsDesc': '配置语音速度、图像样式等',
    
    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.close': '关闭',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.yes': '是',
    'common.no': '否',
    'common.ok': '确定',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.export': '导出',
    'common.import': '导入',
    'common.language': '语言',
    
    // Time
    'time.minutes': '分钟',
    'time.hours': '小时',
    'time.days': '天',
    'time.weeks': '周',
    'time.months': '月',
    'time.years': '年',
  }
} as const;

// Zustand store for language management
interface LanguageStore {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: keyof typeof translations.en) => string;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      setLanguage: (language: LanguageCode) => set({ currentLanguage: language }),
      t: (key: keyof typeof translations.en) => {
        const { currentLanguage } = get();
        const translation = translations[currentLanguage]?.[key] || translations.en[key];
        return translation || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);

// Hook for easy translation access
export const useTranslation = () => {
  const { t, currentLanguage, setLanguage } = useLanguageStore();
  
  return {
    t,
    currentLanguage,
    setLanguage,
    languages,
    isRTL: currentLanguage === 'ar', // Right-to-left for Arabic
  };
};