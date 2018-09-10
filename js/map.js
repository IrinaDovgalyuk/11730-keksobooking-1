'use strict';

var COUNT_USERS = 8;
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var types = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var times = [
  '12:00',
  '13:00',
  '14:00'
];
var conditions = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var photoRooms = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var minX = 300;
var maxX = 1200;
var minY = 130;
var maxY = 650;

var map = document.querySelector('.map__pins');
var card = document.querySelector('#card');
var mapCard = card.querySelector('.map__card');

var listAds = generateAds();
insertPins(listAds);
generateOffer(listAds[0]);

// функция создания шаблона объявлений
function generateOffer(ad) {
  var offer = ad.offer;
  var author = ad.author;
  var listCards = mapCard.cloneNode(true);

  listCards.querySelector('.popup__title').textContent = offer.title;
  listCards.querySelector('.popup__text--address').textContent = offer.address;
  listCards.querySelector('.popup__text--price').innerHTML = getPrice(offer.price);
  listCards.querySelector('.popup__type').textContent = translatePlaceType(offer.type);
  listCards.querySelector('.popup__text--capacity').textContent = getGuestsAndRooms(offer.guests, offer.rooms);
  listCards.querySelector('.popup__text--time').textContent = getCheckinAndCheckout(offer.checkin, offer.checkout);
  removeListChilds(listCards.querySelector('.popup__features')); // удаляем то что имеется
  listCards.querySelector('.popup__features').appendChild(generateFeatures(offer.features)); // вставляем наши данные
  listCards.querySelector('.popup__description').textContent = offer.description;
  removeListChilds(listCards.querySelector('.popup__photos'));
  listCards.querySelector('.popup__photos').appendChild(generatePhotoAd(offer.photos));
  listCards.querySelector('.popup__avatar').src = author.avatar;

  card.removeChild(mapCard);
  card.appendChild(listCards);

}

// функция создания фото объекта
function generatePhotoAd(photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    var photoAd = document.createElement('img');
    photoAd.className = 'popup__photo';
    photoAd.width = 45;
    photoAd.height = 40;
    photoAd.src = photos[i];
    photoAd.alt = 'Фотография жилья';
    fragment.appendChild(photoAd);
  }
  return fragment;
}

// функция создания иконок удобств
function generateFeatures(feature) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < feature.length; i++) {
    var icon = document.createElement('li');
    icon.className = 'popup__feature popup__feature--' + feature[i];
    fragment.appendChild(icon);
  }
  return fragment;
}

// функция удаления внутренних элементов
function removeListChilds(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// функция вывода времени заезда и выезда
function getCheckinAndCheckout(checkin, checkout) {
  return 'Заезд после ' + checkin + ' , выезд до ' + checkout;
}

// функция вывода кол-ва гостей и комнат
function getGuestsAndRooms(guests, rooms) {
  return rooms + ' комнаты для ' + guests + ' гостей';
}

// функция приведения типов жилья
function translatePlaceType(types) {
  switch (types) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
  }
}

// функция вывода цены за ночь
function getPrice(price) {
  return price + ' ₽/ночь';
}

// поиск места в index.html и размещения меток на карте
function insertPins() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < listAds.length; i++) {
    fragment.appendChild(generatePin(listAds[i]));
  }
  map.appendChild(fragment);

}

// функция создания шаблона для размещенеия меток на карте
function generatePin(ad) {
  var placeLocation = document.createElement('button');
  var userAvatar = document.createElement('img');
  placeLocation.className = 'map__pin';
  placeLocation.style.left = (ad.location.x - PIN_HEIGHT) + 'px';
  placeLocation.style.top = (ad.location.y - (PIN_WIDTH/2))  + 'px';
  userAvatar.width = 40;
  userAvatar.height = 40;
  userAvatar.draggable = 'false';
  userAvatar.src = ad.author.avatar;
  userAvatar.alt = ad.offer.title;
  placeLocation.appendChild(userAvatar);
  return placeLocation;
}

// функция генерации массива объектов
function generateAds() {
  var ad = [];
  var usersAvatars = shuffleArray(generateAvatars());
  var usersTitles = shuffleArray(titles);

  for (var i = 0; i < COUNT_USERS; i++) {
    var coordinateX = getRandomInteger(minX, maxX);
    var coordinateY = getRandomInteger(minY, maxY);
    ad[i] = {
      'author': {
        'avatar': usersAvatars[i]
      },

      'offer': {
        'title': usersTitles[i],
        'address': (coordinateX + ', ' + coordinateY),
        'price': getRandomInteger(1000, 1000000),
        'type': getRandomArrayElement(types),
        'rooms': getRandomInteger(1, 5),
        'guests': getRandomInteger(1, 20),
        'checkin': getRandomArrayElement(times),
        'checkout': getRandomArrayElement(times),
        'features': getRandomArrayLength(conditions),
        'description': '',
        'photos': shuffleArray(photoRooms)
      },

      'location': {
        'x': coordinateX,
        'y': coordinateY
      }
    };
  }
  return ad;
}

// функция случайного целого числа
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// функция случайного значения из массива
function getRandomArrayElement(arr) {
  var rand = getRandomInteger(0, arr.length - 1)
  return arr[rand];
}

// функция, перемешивающая элементы массива
function shuffleArray(arr) {
  for(var i=0; i < arr.length - 1; i++) {
    var j = getRandomInteger(0, arr.length - 1);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };
  return arr;
}

// функция приведения массива к случайной длине
function getRandomArrayLength(arr) {
  var arrLength = getRandomInteger(0, arr.length);
  return arr.slice(0, arrLength);
}

// функция генерации массива с аватарками
function generateAvatars() {
  var listAvatars = [];
  for (var i = 1; i < COUNT_USERS + 1; i++) {
    var j = '0' + i;
    var avatars = 'img/avatars/user' + j + '.png';
    listAvatars.push(avatars);
  }
  return listAvatars;
}
