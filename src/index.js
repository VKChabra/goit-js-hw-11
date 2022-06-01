import './sass/main.scss';
import ApiService from './js/fetchImages';
import {Notify} from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const apiService = new ApiService();

Notify.warning('No idea why SimpleLightBox is not working, I have tried my best');

const refs = {
    form: document.querySelector('.search-form'),
    headerFormInput: document.querySelector('.search-form__input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}
const { headerFormInput, gallery, form, loadMoreBtn } = refs;

// console.dir(document.querySelector('.search-form__search-btn').outerText);

const trimmedInputValue = () => headerFormInput.value.trim();

const searchImages = async (e) => {
    e.preventDefault();
    if (trimmedInputValue() === '') {
        return Notify.info('Type anything first please, will ya?');
    } else {
        clearGalleryMarkup();
        apiService.query = trimmedInputValue();
        apiService.resetPage();
        const fetchImg = await apiService.fetchImages();
        makeAndRenderGalleryItems(fetchImg);
        }
}

form.addEventListener('submit', searchImages)

const makeAndRenderGalleryItems = data => {
    const arrayOfResults = data.data.hits;
    const dataTotalHits = data.data.totalHits;
    if (arrayOfResults.length === 0) {
        hideLoadMoreBtn();
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else {
        showLoadMoreBtn();
        Notify.success(`Hooray! We found ${dataTotalHits} images.`)
        const markupOfResults = arrayOfResults.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<li class="gallery__item">
        <a class="gallery__link" href="${largeImageURL}">
            <img
            class="gallery__image"
            src="${webformatURL}"
            alt="${tags}"
            loading="lazy"
            />
        </a>
        <div class="gallery-info">
            <p class="gallery-info__received-data">
            <b>Likes</b>${likes}
            </p>
            <p class="gallery-info__received-data">
            <b>Views</b>${views}
            </p>
            <p class="gallery-info__received-data">
            <b>Comments</b>${comments}
            </p>
            <p class="gallery-info__received-data">
            <b>Downloads</b>${downloads}
            </p>
        </div>
        </li>`;
        }).join('');
        return insertImages(markupOfResults);
    }
};

new SimpleLightbox('.gallery .gallery__link', {
    close: true,
    captionsData: 'alt',
});

function clearGalleryMarkup() {
    gallery.innerHTML = '';
};

function insertImages(images) {
    gallery.insertAdjacentHTML('beforeend', images);
};

const renderLoadButton = async (e) => {
    e.preventDefault();
    const fetchImg = await apiService.fetchImages();
    makeAndRenderGalleryItems(fetchImg);
}

loadMoreBtn.addEventListener('click', renderLoadButton);

function showLoadMoreBtn() {
    loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
    loadMoreBtn.classList.add('is-hidden');
}