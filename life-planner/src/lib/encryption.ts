import CryptoJS from 'crypto-js';

const STORAGE_KEY_PREFIX = 'life_planner_';

/**
 * Generate a random encryption key
 */
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

/**
 * Encrypt data using AES-256
 */
export function encrypt(data: string, key: string): string {
  try {
    return CryptoJS.AES.encrypt(data, key).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-256
 */
export function decrypt(encryptedData: string, key: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - invalid key or corrupted data');
  }
}

/**
 * Hash a password for verification
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

/**
 * Securely store the encryption key in localStorage
 * Note: This is encrypted with a user password
 */
export function storeEncryptionKey(key: string, password: string): void {
  const hashedPassword = hashPassword(password);
  const encryptedKey = encrypt(key, hashedPassword);
  localStorage.setItem(`${STORAGE_KEY_PREFIX}encryption_key`, encryptedKey);
}

/**
 * Retrieve the encryption key from localStorage
 */
export function retrieveEncryptionKey(password: string): string | null {
  try {
    const encryptedKey = localStorage.getItem(`${STORAGE_KEY_PREFIX}encryption_key`);
    if (!encryptedKey) return null;

    const hashedPassword = hashPassword(password);
    return decrypt(encryptedKey, hashedPassword);
  } catch (error) {
    console.error('Failed to retrieve encryption key:', error);
    return null;
  }
}

/**
 * Check if encryption is set up
 */
export function isEncryptionSetup(): boolean {
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}encryption_key`) !== null;
}

/**
 * Remove encryption key (for reset/logout)
 */
export function clearEncryptionKey(): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}encryption_key`);
}

/**
 * Encrypt object for storage
 */
export function encryptObject<T>(obj: T, key: string): string {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString, key);
}

/**
 * Decrypt object from storage
 */
export function decryptObject<T>(encryptedData: string, key: string): T {
  const decrypted = decrypt(encryptedData, key);
  return JSON.parse(decrypted) as T;
}
