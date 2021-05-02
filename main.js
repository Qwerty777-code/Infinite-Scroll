
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photoArray = [];
let isInitialLoad = true;

// Unsplash API
let initialCount = 5;
const query = 'car';
const apiKey = 'mqxyFt7D_dVyOeeY2OcGOrU_YZ6NYnsMM1v3OAnpayo';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&query=${query}&count=${initialCount}`;

function updateAPIURLWithNewCount (picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Вспомогательная функция для установки аттрибутов в эллементах DOM
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Создаем эллементы для ссылок & фотографий, добавляем в DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Запускаем функцию для каждого объекта в photosArray
  photosArray.forEach((photo) => {
    // Создаем <a> для ссылки на Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });
    // Создаем <img> для photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    });
    // Event Listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    // Помещаем <img> внутри <a>, затем помещаем оба внутри imageContainer эллемента
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Получаем фотографии из Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    // Отлавливатель ошибок здесь
  }
}

// Check to see если scrolling в нижней части страницы, загружаем больше Photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
    ready = false;
  getPhotos();
  }
});

// On Load
getPhotos();