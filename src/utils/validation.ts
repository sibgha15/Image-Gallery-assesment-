const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/** Exactly 10 digits, numbers only */
export function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}
