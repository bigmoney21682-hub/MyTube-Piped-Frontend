// src/debug/debugBus.js
const subscribers = new Set();

export function debugLog(type, message, data = null) {
  const entry = {
    id: Date.now() + Math.random(),
    type,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  for (const sub of subscribers) {
    sub(entry);
  }
}

export function subscribeDebug(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}
