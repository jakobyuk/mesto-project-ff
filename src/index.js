import './pages/index.css';
import { createCard, likeCard, deleteCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import { openModal, closeModal, addEventListenerFunction } from './components/modal.js';

const placesList = document.querySelector('.places__list');

//модалки
const popupProfileEdit = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

//элементы на которые весим окна
const editButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button'); 

//формы
const editForm = document.forms['edit-profile'];
const addCardForm = document.forms['new-place'];

//функции с карточками
//рендеринг
function renderCard(cardContent) {
  const cardElement = createCard(cardContent, deleteCard, likeCard, showImagePopup);
  placesList.appendChild(cardElement);
  }

 //функция для добавления новой карточки через модалку
function addCard(newCardContent) {
  const cardElement = createCard(newCardContent, deleteCard, likeCard, showImagePopup);
  placesList.prepend(cardElement);
  }

//функция клика по карточке
function showImagePopup(image) {

  const popupImagePic = popupImage.querySelector('.popup__image');
  const popupImageName = popupImage.querySelector('.popup__caption');
  
  popupImagePic.src = image.src; 
  popupImagePic.alt = image.alt; 
  popupImageName.textContent = image.alt; 
  
    openModal(popupImage); 
  };

//вывели карточки на страницу
initialCards.forEach(cardContent => {
  renderCard(cardContent); 
});

//код для заполнения инпутов 
const fillEditFormInputs = () => {
  const nameInput = document.forms['edit-profile'].elements.name;
  const jobInput = document.forms['edit-profile'].elements.description;

  const profileName = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
};

//обработчик для формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault(); 

  const nameInput = document.forms['edit-profile'].elements.name;
  const jobInput = document.forms['edit-profile'].elements.description;

  const profileName = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupProfileEdit);
};

//обработчик формы с добавлением карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); 

  const inputCardTitle = addCardForm.elements['place-name'].value;
  const inputCardImage = addCardForm.elements.link.value;

  const newCardContent = {
      name: inputCardTitle,
      link: inputCardImage};

  addCard(newCardContent); 

  closeModal(popupAddCard);

  addCardForm.reset();
};

//прикрепляем обработчики к формам
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);

//повесили обработчики событий для открытия модальных окон
editButton.addEventListener('click', () => {
  fillEditFormInputs(); //заполняем инпуты перед открытием попапа
  openModal(popupProfileEdit); 
});
addCardButton.addEventListener('click', () => openModal(popupAddCard));

//слушатели для закрытия окон
addEventListenerFunction(popupProfileEdit);
addEventListenerFunction(popupAddCard);
addEventListenerFunction(popupImage);