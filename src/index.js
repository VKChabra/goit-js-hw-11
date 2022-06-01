import './sass/main.scss';
import fetchImages from './js/fetchImages';
import {Notify} from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import infScroll from './js/infiniteScroll';

const additionalInfoNotify = () => {
    Notify.info('Infinite scroll will (probably) be added in future updates, thanks for understanding');
setTimeout(() => {
    Notify.warning('And I have no idea why SimpleLightBox is not working, I have tried my best')
}, 3500);
}

additionalInfoNotify();

const refs = {
    form: document.querySelector('.search-form'),
    headerFormInput: document.querySelector('.search-form__input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}
const { headerFormInput, gallery, form, loadMoreBtn } = refs;

// console.dir(document.querySelector('.search-form__search-btn').outerText);

const trimmedInputValue = () => {
    searchQuery = headerFormInput.value.trim();
    return headerFormInput.value.trim();
};

let searchQuery = '';
let pageNumber = 1;

const searchImages = async (e) => {
    e.preventDefault();
    if (trimmedInputValue() === '') {
        return Notify.info('Type anything first please, will ya?');
    } else {
        try {
            clearGalleryMarkup();
            const fetchImg = await fetchImages(trimmedInputValue());
            console.log(searchQuery);
            makeGalleryItems(fetchImg);
            loadMoreBtn.classList.remove('is-hidden');
        } catch (error) {
            () => {
                return console.log(error);
            }
        }
    }
}

form.addEventListener('submit', searchImages)

const makeGalleryItems = data => {
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

const linkLightbox = '.gallery .gallery__link';
new SimpleLightbox(linkLightbox, {
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
        try {
            const fetchImg = await fetchImages(trimmedInputValue());
            makeGalleryItems(fetchImg);
        } catch (error) {
            () => {
                return console.log(error);
            }
        }
}

loadMoreBtn.addEventListener('click', renderLoadButton);