export const eventAlias = {
    "App\\Events\\ChatMessageEvent": "chat_message",
    "App\\Events\\ChatroomClearEvent" : "chat_clear",
    "App\\Events\\GiftEvent": "gift",
    "App\\Events\\BanEvent": "ban",
    // Diğer eventler eklenebilir
};

class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(eventName, callback) {
    console.log(`Subscribed: ${eventName}`);

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  unsubscribe(eventName, callback) {
    console.log(`Unsubscribe: ${eventName}`);

    if (!this.listeners[eventName]) return;
    this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
  }

  emit(eventName, data) {
    console.log(`Emitting: ${eventName}`, data);

    if (!this.listeners[eventName]) return;
    this.listeners[eventName].forEach(callback => callback(data));
  }
}

export const eventBus = new EventBus();
