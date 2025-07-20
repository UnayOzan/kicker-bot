export interface EventPayloads {
  "chat_message": { content: string; sender: { username: string } };
  "chat_clear": void;
  "gift": { sender: string; amount: number; };
  "ban": { username: string; reason: string; };
}

export const eventAlias: Record<string, keyof EventPayloads> = {
  "App\\Events\\ChatMessageEvent": "chat_message",
  "App\\Events\\ChatroomClearEvent": "chat_clear",
  "App\\Events\\GiftEvent": "gift",
  "App\\Events\\BanEvent": "ban",
};

type EventCallback<K extends keyof EventPayloads> = (data: EventPayloads[K]) => void;

class EventBus {
  private listeners: {
    [K in keyof EventPayloads]?: EventCallback<K>[];
  } = {};

  subscribe<K extends keyof EventPayloads>(eventName: K, callback: EventCallback<K>): void {
    console.log(`Subscribed: ${eventName}`);

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName]!.push(callback);
  }

  unsubscribe<K extends keyof EventPayloads>(eventName: K, callback: EventCallback<K>): void {
    console.log(`Unsubscribe: ${eventName}`);

    if (!this.listeners[eventName]) return;

    (this.listeners as any)[eventName] = this.listeners[eventName]!.filter(cb => cb !== callback);
  }

  emit<K extends keyof EventPayloads>(eventName: K, data: EventPayloads[K]): void {
    console.log(`Emitting: ${eventName}`, data);

    if (!this.listeners[eventName]) return;

    this.listeners[eventName]!.forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();
