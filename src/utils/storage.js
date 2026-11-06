import { get, set, del, keys } from 'idb-keyval';

const RECORDINGS_KEY_PREFIX = 'apprecorder_rec_';
const SETTINGS_KEY = 'apprecorder_settings';
const FAVORITES_KEY = 'apprecorder_fav_urls';

// Store a video blob in IndexedDB
export async function saveRecording({ id, blob, metadata = {} }) {
  const item = {
    id: id || `rec_${Date.now()}`,
    blob,
    name: metadata.name || `Recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`,
    timestamp: Date.now(),
    duration: metadata.duration || 0,
    resolution: metadata.resolution || '4K Ultra HD',
    deviceModel: metadata.deviceModel || 'iPhone 18 Pro Max',
    sizeBytes: blob.size,
    type: blob.type || 'video/webm',
  };

  try {
    await set(`${RECORDINGS_KEY_PREFIX}${item.id}`, item);
    return item;
  } catch (err) {
    console.error('Failed to save recording to IndexedDB:', err);
    throw err;
  }
}

// Retrieve all stored recordings from IndexedDB
export async function getAllRecordings() {
  try {
    const allKeys = await keys();
    const recordingKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith(RECORDINGS_KEY_PREFIX));
    const items = await Promise.all(recordingKeys.map((k) => get(k)));
    return items.filter(Boolean).sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error('Failed to load recordings from IndexedDB:', err);
    return [];
  }
}

// Delete a recording from IndexedDB
export async function deleteRecording(id) {
  await del(`${RECORDINGS_KEY_PREFIX}${id}`);
}

// Save user preferences locally
export function saveLocalSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function loadLocalSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Favorite URLs
export function getFavoriteUrls() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : ['https://servcate.com'];
  } catch (e) {
    return ['https://servcate.com'];
  }
}

export function saveFavoriteUrl(url) {
  try {
    const favs = getFavoriteUrls();
    if (!favs.includes(url)) {
      favs.unshift(url);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs.slice(0, 20)));
    }
  } catch (e) {
    console.error('Error saving favorite url:', e);
  }
}

