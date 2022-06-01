const axios = require('axios');

export default class loadMoreBtn {
    constructor() {
        this.searchQuery = '';
    }

    fetchImages() {
        const API_KEY = '27686313-742ded8f698756fd4afe04a50';
        return await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&per_page=40&page=1`);
    }
}