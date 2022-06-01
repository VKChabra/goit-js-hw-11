import './sass/main.scss';
import ApiService from './js/fetchImages';
import {Notify} from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import LoadMoreBtn from './js/loadMoreBtn';

const apiService = new ApiService();

const refs = {
    form: document.querySelector('.search-form'),
    headerFormInput: document.querySelector('.search-form__input'),
    galleryList: document.querySelector('.gallery-list'),
}
const { headerFormInput, galleryList, form } = refs;
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: true,
});

const trimmedInputValue = () => headerFormInput.value.trim();

const searchImages = async (e) => {
    e.preventDefault();
    if (trimmedInputValue() === '') {
        return Notify.info('Type anything first please, will ya?');
    } else {
        loadMoreBtn.show();
        loadMoreBtn.disable();
        clearGalleryMarkup();
        apiService.query = trimmedInputValue();
        apiService.resetPage();
        const fetchImg = await apiService.fetchImages();
        Notify.success(`Hooray! We found ${fetchImg.data.totalHits} images.`)
        makeAndRenderGalleryItems(fetchImg);
        }
}

form.addEventListener('submit', searchImages)

const makeAndRenderGalleryItems = data => {
    try {
        const arrayOfResults = data.data.hits;
        if (arrayOfResults.length === 0) {
            loadMoreBtn.hide();
            return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        } else {
            loadMoreBtn.enable();
            loadMoreBtn.show();
            const markupOfResults = arrayOfResults.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<li class="gallery-list__item">
            <a class="gallery-list__link" href="${largeImageURL}">
                <img
                class="gallery-list__image"
                src="${webformatURL}"
                alt="${tags}"
                loading="lazy"
                />
            </a>
            <div class="gallery-list__info">
                <p class="gallery-list__info__received-data">
                <b>Likes</b>${likes}
                </p>
                <p class="gallery-list__info__received-data">
                <b>Views</b>${views}
                </p>
                <p class="gallery-list__info__received-data">
                <b>Comments</b>${comments}
                </p>
                <p class="gallery-list__info__received-data">
                <b>Downloads</b>${downloads}
                </p>
            </div>
            </li>`;
            }).join('');
            return insertImages(markupOfResults);
        }
    } catch (error) {
        loadMoreBtn.hide();
        console.log(error);
    }
};

function clearGalleryMarkup() {
    galleryList.innerHTML = '';
};

function insertImages(images) {
    galleryList.insertAdjacentHTML('beforeend', images);
    new SimpleLightbox('.gallery-list .gallery-list__link', {
        close: true,
        captionsData: 'alt',
    });
};

const renderLoadButton = async (e) => {
    e.preventDefault();
    loadMoreBtn.show();
    loadMoreBtn.disable();
    const fetchImg = await apiService.fetchImages();
    makeAndRenderGalleryItems(fetchImg);
}

loadMoreBtn.refs.button.addEventListener('click', renderLoadButton);