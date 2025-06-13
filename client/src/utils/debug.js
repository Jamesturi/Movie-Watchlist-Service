// client/src/utils/debug.js
const debugApi = {
  checkToken: () => {
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    if (token) {
      console.log('Token preview:', token.substring(0, 15) + '...');
    }
    return !!token;
  },
  
  checkHeaders: () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
    console.log('Headers that would be sent:', headers);
    return headers;
  },
  
  pingApi: async (endpoint = '/api/test/public') => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: debugApi.checkHeaders()
      });
      
      clearTimeout(timeoutId);
      console.log('API response:', await response.json());
      return true;
    } catch (error) {
      console.error('API ping failed:', error);
      return false;
    }
  },
  
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Auth data cleared');
  }
};

// Add to window for console access
window.debugApi = debugApi;

export default debugApi;