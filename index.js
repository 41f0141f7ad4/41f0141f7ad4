// Strategy: Thử HTTPS trước, nếu fail thì thử HTTP
const callProxyAPI = async (url, params, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logRequest(url, attempt);
      const response = await axiosInstance.get(url, { params });
      return response;
    } catch (error) {
      logError(error, url, attempt);
      
      // Nếu là lỗi SSL và chưa thử hết retry, thử lại
      if (attempt < retries && 
          (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || 
           error.message.includes('SSL'))) {
        console.log(`Retrying... (${attempt}/${retries})`);
        continue;
      }
      throw error;
    }
  }
};

// Sử dụng trong hàm chính
const response = await callProxyAPI(url, {
  key: API_KEY,
  loaiproxy: loaiproxy_api,
  soluong: numOfProxiesBought,
  ngay: 30,
  type: 'HTTP',
  user: 'kayproxy',
  password: 'random',
});
