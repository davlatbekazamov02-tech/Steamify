/**
 * APPLICATION CONSTANTS
 * Centralized configuration values
 */

// ========================================
// ANIMATION TIMINGS
// ========================================
export const ANIMATION_SPEED = {
  TYPING: 150,           // Typing animation delay (ms)
  CAROUSEL: 5000,        // Carousel slide interval (ms)
  TOAST: 3000,           // Toast notification duration (ms)
  LOADING: 1000,         // Minimum loading state duration (ms)
  TRANSITION: 300,       // Standard transition duration (ms)
} as const;

// ========================================
// QR TOKEN
// ========================================
export const QR_TOKEN_TIMEOUT = 60; // QR token amal qilish vaqti (soniya)

// ========================================
// DATA LIMITS
// ========================================
export const LIMITS = {
  // Display limits
  TOP_PARTICIPANTS: 5,
  UPCOMING_EVENTS: 4,
  RECENT_APPLICATIONS: 10,
  LEADERBOARD_PAGE_SIZE: 20,
  
  // Input limits
  MAX_BIO_LENGTH: 500,
  MAX_NAME_LENGTH: 50,
  MAX_ROLE_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  // File upload limits
  MAX_IMAGE_SIZE_MB: 5,
  MAX_FILE_SIZE_MB: 10,
  
  // Team limits
  MAX_TEAMS_PER_REGION: 20,
  MAX_MEMBERS_PER_TEAM: 10,
} as const;

// ========================================
// URLS va ENDPOINTS
// ========================================
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || `${APP_URL}/api`;

export const EXTERNAL_URLS = {
  TELEGRAM: 'https://t.me/STEMIFYuz',
  INSTAGRAM: 'https://www.instagram.com/STEMIFY.uz/',
  WEBSITE: 'https://STEMIFY.uz',
} as const;

// ========================================
// STORAGE KEYS
// ========================================
export const STORAGE_KEYS = {
  THEME: 'steamify_theme',
  USER_PROFILE: 'steamify_user_profile',
  ROLE: 'steamify_role',
  TEAMS: 'steamify_teams',
  LANGUAGE: 'steamify_language',
} as const;

// ========================================
// COOKIE NAMES
// ========================================
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'steamify_auth',
  ROLE: 'steamify_role',
  REFRESH_TOKEN: 'steamify_refresh',
} as const;

// ========================================
// API ROUTES
// ========================================
export const API_ROUTES = {
  LEADERBOARD: '/api/leaderboard',
  MY_RANK: '/api/me/rank',
  QR_VERIFY: '/api/qr/verify',
  SWITCH_ROLE: '/api/auth/switch-role',
  TEAM: '/api/team',
  TEAM_BY_ID: (id: string) => `/api/team/${id}`,
} as const;

// ========================================
// ROUTES (PAGE PATHS)
// ========================================
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EVENTS: '/events',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  MY_QR: '/my-qr',
  MY_APPLICATIONS: '/my-applications',
  REFERRAL: '/referral',
  SETTINGS: '/settings',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_TEAM: '/admin/team',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_USERS: '/admin/users',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_SETTINGS: '/admin/system-settings',
  ADMIN_ADMINS: '/admin/admins',
  
  // Mentor
  MENTOR_SCANNER: '/mentor/scanner',
  MENTOR_SESSIONS: '/mentor/sessions',
  MENTOR_TEAMS: '/mentor/teams',
} as const;

// ========================================
// USER ROLES
// ========================================
export const USER_ROLES = {
  USER: 'USER',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type UserRole = keyof typeof USER_ROLES;

// ========================================
// REGIONS (VILOYATLAR)
// ========================================
export const REGIONS = {
  ALL: 'all',
  TOSHKENT: 'toshkent',
  SAMARQAND: 'samarqand',
  BUXORO: 'buxoro',
  ANDIJON: 'andijon',
  FARGONA: 'farg\'ona',
  NAMANGAN: 'namangan',
  QASHQADARYO: 'qashqadaryo',
  SURXONDARYO: 'surxondaryo',
  XORAZM: 'xorazm',
  NAVOIY: 'navoiy',
  JIZZAX: 'jizzax',
  SIRDARYO: 'sirdaryo',
  QORAQALPOGISTON: 'qoraqalpog\'iston',
  TOSHKENT_VILOYAT: 'toshkent_viloyat',
} as const;

export const TOTAL_REGIONS = 14;

// ========================================
// STEAM CATEGORIES
// ========================================
export const STEAM_CATEGORIES = {
  SCIENCE:     'Science',
  TECHNOLOGY:  'Technology',
  ENGINEERING: 'Engineering',
  MATHEMATICS: 'Mathematics',
} as const;

export const TOTAL_STEAM_CATEGORIES = 5;

// ========================================
// EVENT CATEGORIES
// ========================================
export const EVENT_CATEGORIES = [
  'Hackathon',
  'Workshop',
  'Sessiya',
  'Lager',
  'Musobaqa',
  'Konferensiya',
  'Webinar',
  'Masterclass',
] as const;

// ========================================
// XP REWARDS
// ========================================
export const XP_REWARDS = {
  EVENT_PARTICIPATION: 50,
  WORKSHOP_COMPLETION: 30,
  CHALLENGE_FIRST_PLACE: 100,
  CHALLENGE_SECOND_PLACE: 70,
  CHALLENGE_THIRD_PLACE: 50,
  REFERRAL: 20,
  PROFILE_COMPLETION: 10,
  DAILY_LOGIN: 5,
  SESSION_CHECKIN: 10,       // Mentor sessiyasida davomat uchun
} as const;

// ========================================
// THEME OPTIONS
// ========================================
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];

// ========================================
// LANGUAGES
// ========================================
export const LANGUAGES = {
  UZ: 'uz',
  EN: 'en',
  RU: 'ru',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// ========================================
// ERROR MESSAGES
// ========================================
export const ERROR_MESSAGES = {
  GENERIC: 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.',
  NETWORK: 'Internet aloqasi yo\'q. Qayta ulanib ko\'ring.',
  UNAUTHORIZED: 'Tizimga kirish talab qilinadi.',
  FORBIDDEN: 'Sizda bu amalni bajarish huquqi yo\'q.',
  NOT_FOUND: 'Sahifa topilmadi.',
  VALIDATION: 'Ma\'lumotlar noto\'g\'ri. Qayta tekshiring.',
  SERVER: 'Server xatosi. Keyinroq qayta urinib ko\'ring.',
} as const;

// ========================================
// SUCCESS MESSAGES
// ========================================
export const SUCCESS_MESSAGES = {
  SAVED: 'Muvaffaqiyatli saqlandi!',
  DELETED: 'Muvaffaqiyatli o\'chirildi!',
  UPDATED: 'Muvaffaqiyatli yangilandi!',
  CREATED: 'Muvaffaqiyatli yaratildi!',
  COPIED: 'Nusxa olindi!',
  SENT: 'Yuborildi!',
} as const;

// ========================================
// VALIDATION PATTERNS
// ========================================
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_UZ: /^\+998[0-9]{9}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  TELEGRAM: /^@?[a-zA-Z0-9_]{5,32}$/,
  URL: /^https?:\/\/.+/,
} as const;

// ========================================
// IMAGE SETTINGS
// ========================================
export const IMAGE_SETTINGS = {
  QUALITY: 90,
  FORMATS: ['image/jpeg', 'image/png', 'image/webp'] as const,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  THUMBNAIL_SIZE: 400,
} as const;

// ========================================
// PAGINATION
// ========================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 10,
} as const;

// ========================================
// RATE LIMITING
// ========================================
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 60,
  LOGIN_ATTEMPTS_PER_HOUR: 5,
  PASSWORD_RESET_PER_DAY: 3,
  FILE_UPLOADS_PER_HOUR: 10,
} as const;

// ========================================
// DATE FORMATS
// ========================================
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;

// ========================================
// SOCIAL MEDIA PLATFORMS
// ========================================
export const SOCIAL_PLATFORMS = {
  TELEGRAM: 'telegram',
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
  EMAIL: 'email',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
} as const;

// ========================================
// DEVELOPMENT FLAGS
// ========================================
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

// ========================================
// FEATURE FLAGS
// ========================================
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true',
  ENABLE_CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const;
