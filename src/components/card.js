import { showImagePopup } from './modal.js';

const cardTemplate = document.querySelector('#card-template');
const placesList = document.querySelector('.places__list');

function deleteCard(event) {
  const card = event.target.closest('.card');
  card.remove();
}

//функция лайка
function likeCard(event) {
  const heart = event.target; 
  heart.classList.toggle('card__like-button_is-active'); 
}

function createCard(cardContent) {
  const cardElement = cardTemplate.content.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button').addEventListener('click', deleteCard);
  const likeButton = cardElement.querySelector('.card__like-button').addEventListener('click', likeCard);

  cardImage.src = cardContent.link;
  cardImage.alt = cardContent.name;
  cardTitle.textContent = cardContent.name;

  cardImage.addEventListener('click', () => showImagePopup(cardImage));

  return cardElement;
}

function renderCard(cardContent) {
  const cardElement = createCard(cardContent);
  placesList.appendChild(cardElement);
  }

 //функция для добавления новой карточки через модалку
function addCard(newCardContent) {
  const cardElement = createCard(newCardContent);
  placesList.prepend(cardElement);
  }

export { deleteCard, createCard, renderCard, addCard };