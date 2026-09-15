/**
 * SECURITY UTILITIES
 * XSS Prevention, URL Validation, Input Sanitization
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Sanitize plain text (strip all HTML)
 */
export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/**
 * Allowed image domains whitelist
 */
const ALLOWED_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'steamify.uz',
  'res.cloudinary.com',
  'cdn.steamify.uz',
];

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    
    // Check protocol
    if (parsed.protocol !== 'https:') return false;
    
    // Check domain whitelist
    return ALLOWED_IMAGE_DOMAINS.some(domain => 
      parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Get safe image URL or fallback
 */
export function getSafeImageUrl(url: string, fallback = '/images/default-avatar.png'): string {
  return isValidImageUrl(url) ? url : fallback;
}

/**
 * Validate Telegram username
 */
const TELEGRAM_REGEX = /^@?[a-zA-Z0-9_]{5,32}$/;

export function isValidTelegramUsername(username: string): boolean {
  if (!username) return false;
  return TELEGRAM_REGEX.test(username);
}

/**
 * Get safe Telegram URL
 */
export function getSafeTelegramUrl(username: string): string | null {
  const cleaned = username.replace('@', '');
  if (!isValidTelegramUsername(cleaned)) return null;
  return `https://t.me/${cleaned}`;
}

/**
 * Validate LinkedIn username
 */
const LINKEDIN_REGEX = /^[a-zA-Z0-9-]{3,100}$/;

export function isValidLinkedInUsername(username: string): boolean {
  if (!username) return false;
  return LINKEDIN_REGEX.test(username);
}

/**
 * Get safe LinkedIn URL
 */
export function getSafeLinkedInUrl(username: string): string | null {
  if (!isValidLinkedInUsername(username)) return null;
  return `https://linkedin.com/in/${username}`;
}

/**
 * Validate GitHub username
 */
const GITHUB_REGEX = /^[a-zA-Z0-9-]{1,39}$/;

export function isValidGitHubUsername(username: string): boolean {
  if (!username) return false;
  return GITHUB_REGEX.test(username);
}

/**
 * Get safe GitHub URL
 */
export function getSafeGitHubUrl(username: string): string | null {
  if (!isValidGitHubUsername(username)) return null;
  return `https://github.com/${username}`;
}

/**
 * Validate email
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

/**
 * Get safe mailto URL
 */
export function getSafeMailtoUrl(email: string): string | null {
  if (!isValidEmail(email)) return null;
  return `mailto:${email}`;
}

/**
 * Validate generic URL
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate social links
 */
export interface SocialLinks {
  telegram?: string;
  linkedin?: string;
  github?: string;
  email?: string;
}

export interface SafeSocialLinks {
  telegram?: string | null;
  linkedin?: string | null;
  github?: string | null;
  email?: string | null;
}

export function getSafeSocialLinks(links?: SocialLinks): SafeSocialLinks {
  if (!links) return {};
  
  return {
    telegram: links.telegram ? getSafeTelegramUrl(links.telegram) : null,
    linkedin: links.linkedin ? getSafeLinkedInUrl(links.linkedin) : null,
    github: links.github ? getSafeGitHubUrl(links.github) : null,
    email: links.email ? getSafeMailtoUrl(links.email) : null,
  };
}

/**
 * Input length validation
 */
export function validateLength(
  value: string, 
  min: number, 
  max: number
): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Sanitize user input for display
 */
export interface UserInput {
  firstName: string;
  lastName: string;
  role: string;
  bio: string;
}

export function sanitizeUserInput(input: UserInput): UserInput {
  return {
    firstName: sanitizeText(input.firstName).trim(),
    lastName: sanitizeText(input.lastName).trim(),
    role: sanitizeText(input.role).trim(),
    bio: sanitizeText(input.bio).trim(),
  };
}

/**
 * Rate limiting helper (basic)
 */
const requestCounts = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get existing requests
  const requests = requestCounts.get(identifier) || [];
  
  // Filter requests within window
  const recentRequests = requests.filter(time => time > windowStart);
  
  // Check limit
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  // Add new request
  recentRequests.push(now);
  requestCounts.set(identifier, recentRequests);
  
  return true;
}

/**
 * Generate safe file name
 */
export function getSafeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Prevent SQL injection (basic)
 */
export function escapeSqlString(value: string): string {
  return value
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}
