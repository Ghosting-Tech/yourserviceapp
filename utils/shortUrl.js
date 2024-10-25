import axios from "axios";

const shortUrl = async (url) => {
  const urlRes = await axios.get(`https://ulvis.net/api.php?url=${url}&private=1`);

  const shortenedUrl = urlRes.data
  const cleanUrl = shortenedUrl.replace(/^https?:\/\//, ""); // Removes 'https://' or 'http://'
  return cleanUrl;
};
export default shortUrl;
