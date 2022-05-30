import './sass/main.scss';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchImages from './js/fetchImages'
import { infScroll } from './js/infiniteScroll';
import {Notify} from 'notiflix';

const refs = {
    form: document.querySelector('.search-form'),
    headerFormInput: document.querySelector('.search-form__input'),
    gallery: document.querySelector('.gallery')
}
const { headerFormInput, gallery, form } = refs;

const trimmedInputValue = () => headerFormInput.value.trim();
let pageNumber = 1;

const searchImages = async (e) => {
    e.preventDefault();
    if (trimmedInputValue() === '') {
        return Notify.info('Type anything first please, will ya?');
    } else {
        try {
            clearGalleryMarkup();
            const fetchImg = await fetchImages(trimmedInputValue());
            return makeGalleryItemsMarkup(fetchImg);
        } catch (error) {
            () => {
                return console.log(error);
            }
        }
    }
}

form.addEventListener('submit', searchImages)

const makeGalleryItemsMarkup = data => {
    const arrayOfResults = data.data.hits;
    if (arrayOfResults.length === 0) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else {
        Notify.success(`Hooray! We found ${data.data.totalHits} images.`)
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
            <p class="gallery__received-data">
            <b>Likes</b> ${likes}
            </p>
            <p class="gallery__received-data">
            <b>Views</b> ${views}
            </p>
            <p class="gallery__received-data">
            <b>Comments</b> ${comments}
            </p>
            <p class="gallery__received-data">
            <b>Downloads</b> ${downloads}
            </p>
        </div>
        </li>`;
        }).join('');
        return insertImages(markupOfResults);
    }
};

function clearGalleryMarkup() {
    gallery.innerHTML = '';
};

function insertImages(images) {
    gallery.insertAdjacentHTML('beforeend', images);
};

new SimpleLightbox('.gallery__item .gallery__link', {
    close: true,
});