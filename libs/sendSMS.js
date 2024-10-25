export const sendSMS = async (number, message, templateid) => {
    const apiUrl = `http://sms.azmobia.com/http-tokenkeyapi.php`;
  
    const params = {
      'authentic-key': '343947686f7374696e673130301729339791', // Replace with the actual key if needed
      'senderid': 'GHOSTW',
      'route': 1,
      'number': number,
      'message': message,
      'templateid': templateid,
    };
  
    const queryString = new URLSearchParams(params).toString();
    const requestUrl = `${apiUrl}?${queryString}`;
  
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  };
  