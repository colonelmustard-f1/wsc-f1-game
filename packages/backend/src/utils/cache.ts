import { createClient, RedisClientType } from 'redis';

class Cache {
  private static instance: Cache;
  private client: RedisClientType;
  private connected: boolean = false;
  private readonly ttl: number = 24 * 60 * 60; // 24 hours in seconds

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
    });

    this.client.on('error', err => console.error('Redis Client Error:', err));
    this.client.on('connect', () => {
      this.connected = true;
      console.log('Connected to Redis');
    });
  }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  private async ensureConnection() {
    if (!this.connected) {
      await this.client.connect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      await this.ensureConnection();
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      await this.ensureConnection();
      await this.client.set(key, JSON.stringify(value), {
        EX: this.ttl
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async close(): Promise<void> {
    if (this.connected) {
      await this.client.quit();
      this.connected = false;
    }
  }
}

export const cache = Cache.getInstance();
