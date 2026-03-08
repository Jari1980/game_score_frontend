import { ref } from 'vue';
import { getAuthToken } from '@/data/auth';

const socket = ref<WebSocket | null>(null);
const isConnected = ref(false);
const latestMatch = ref<any | null>(null);

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const getWsUrl = () => {
  const url = new URL(API_ENDPOINT);

  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';

  return `${protocol}//${url.host}/ws`;
};

export const useWebSocket = () => {
  const connect = () => {
    if (socket.value) return;

    const token = getAuthToken();
    if (!token) return;

    const wsUrl = `${getWsUrl()}?token=${token}`;

    socket.value = new WebSocket(wsUrl);

    socket.value.onopen = () => {
      console.log('WebSocket connected');
      isConnected.value = true;
    };

    socket.value.onclose = () => {
      console.log('WebSocket disconnected');
      isConnected.value = false;
      socket.value = null;

      setTimeout(connect, 10000);
    };

    socket.value.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'NEW_MATCH') {
        latestMatch.value = message.payload;
      }
    };
  };

  const disconnect = () => {
    socket.value?.close();
    socket.value = null;
    isConnected.value = false;
  };

  return {
    connect,
    disconnect,
    isConnected,
    latestMatch,
  };
};