export default async function fetchImages(inputValue) {
    const axios = require('axios');
    const API_KEY = '27686313-742ded8f698756fd4afe04a50';
    return await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&per_page=10`);
}