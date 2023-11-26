import Redis from "ioredis";

export default class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: "localhost",
      port: 6379,
    });
    this.client.on("connect", () => {
      console.log("Connected to Redis server");
    });
  }

  async set(key: string, value: string): Promise<string | null> {
    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async disconnect() {
    this.client.disconnect();
  }
}
