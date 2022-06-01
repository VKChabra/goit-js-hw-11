const axios = require('axios');
import {Notify} from 'notiflix';

const API_KEY = '27686313-742ded8f698756fd4afe04a50';

export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchImages() {
        try {
            const getUrl = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&per_page=40&page=${this.page}`);
            this.page += 1;
            return getUrl;
        } catch (error) {
            if (error.response.status === 400) {
                Notify.failure("We're sorry, but you've reached the end of search results.");
            }
            console.log(error);
        }
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}