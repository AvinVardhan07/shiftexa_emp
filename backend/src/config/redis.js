// Redis / Cache Client Abstraction
class MockRedisClient {
  constructor() {
    this.store = new Map();
    console.log('[Redis] Initialized fallback in-memory state engine');
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async set(key, value, mode, ttl) {
    this.store.set(key, value);
    if (ttl) {
      setTimeout(() => this.store.delete(key), ttl * 1000);
    }
    return 'OK';
  }

  async del(key) {
    return this.store.delete(key);
  }
}

let redisClient = new MockRedisClient();

module.exports = redisClient;
