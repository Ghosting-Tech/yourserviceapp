const sendSmsMessage = async (number, message, templateid) => {
  const response = await fetch("/api/send-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number,
      message,
      templateid,
    }),
  });

  const data = await response.json();
  return data;
};
export default sendSmsMessage;