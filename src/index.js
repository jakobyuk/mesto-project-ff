import './pages/index.css';
import { createCard, renderCard, addCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import { openModal, closeModal, addEventListenerFunction, handleEditFormSubmit, handleAddCardFormSubmit, showImagePopup } from './components/modal.js';
import { popupProfileEdit, popupAddCard, popupImage } from './components/modal.js';

//элементы на которые весим окна
const editButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button'); 

//формы
const editForm = document.forms['edit-profile'];
const addCardForm = document.forms['new-place'];

//вывели карточки на страницу
initialCards.forEach(cardContent => {
  renderCard(cardContent); 
});

//объявляем именно после рендеринга карточек, тк только так будут включены все карточки
const cardImages = document.querySelectorAll('.card__image'); 

// Прикрепляем обработчики к формам
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);

//повесили обработчики событий для открытия модальных окон
editButton.addEventListener('click', () => openModal(popupProfileEdit));
addCardButton.addEventListener('click', () => openModal(popupAddCard));
cardImages.forEach(image => {
  image.addEventListener('click', () => openModal(popupImage));
});

//слушатели для закрытия окон
addEventListenerFunction(popupProfileEdit);
addEventListenerFunction(popupAddCard);
addEventListenerFunction(popupImage);