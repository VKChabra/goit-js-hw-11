import './sass/main.scss';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import './js/fetchImages'
import {Notify} from 'notiflix';
import fetchImages from "./js/fetchImages";

const refs = {
    form: document.querySelector('.top-form'),
    headerFormInput: document.querySelector('.top-form__input'),
    headerFormSearchBtn: document.querySelector('.top-form__search-btn'),
    gallery: document.querySelector('.gallery')
}
const { headerFormInput, headerFormSearchBtn, gallery, form } = refs;

const trimmedInputValue = () => headerFormInput.value.trim();

const searchImages = async (e) => {
    e.preventDefault();
    if (trimmedInputValue() === '') {
        return Notify.info('Type anything first please, will ya?');
    } else {
        try {
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
    checkIfFound(data);
    const markupOfResults = arrayOfResults.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<li class="gallery__item">
        <a class="gallery__link" href="${largeImageURL}">
            <img
            class="gallery__image"
            src="${webformatURL}"
            alt="${tags}"
            />
        </a>
        <ul class="gallery__item-data">
            <li class='gallery__received-data>Likes:
            ${likes}</li>
            <li class='gallery__received-data>Views:
            ${views}</li>
            <li class='gallery__received-data>Comments:
            ${comments}</li>
            <li class='gallery__received-data>Downloads:
            ${downloads}</li>
        </ul>
        </li>`;
    }).join('');
    return insertImages(markupOfResults);
};

function checkIfFound(e) {
    if (e.data.hits.length === 0) {
        return Notify.failure('Nothing was found')
    }
}

function insertImages(images) {
    gallery.insertAdjacentHTML('beforeend', images);
}