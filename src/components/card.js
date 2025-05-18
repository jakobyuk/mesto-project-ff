import { putLike, deleteLike } from './api.js';

const cardTemplate = document.querySelector('#card-template');

//функция лайка
function likeCard(cardId, cardElement, userId) {
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
    // Удаляем лайк
    deleteLike(cardId)
      .then((updatedCard) => {
        likeButton.classList.remove('card__like-button_is-active');
        likeCounter.textContent = String(updatedCard.likes.length);
        if (updatedCard.likes.length === 0) {
          likeCounter.classList.remove('card__like-counter_is-active');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    // Постановка лайка
    putLike(cardId)
      .then((updatedCard) => {
        likeButton.classList.add('card__like-button_is-active');
        likeCounter.textContent = String(updatedCard.likes.length);
        likeCounter.classList.add('card__like-counter_is-active');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function createCard(cardContent, likeCard, showImagePopup, userId, handleCardDelete) {
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);
  
  const cardId = cardContent._id;
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', () => {
    likeCard(cardId, cardElement, userId);
  })

  cardImage.src = cardContent.link;
  cardImage.alt = cardContent.name;
  cardTitle.textContent = cardContent.name;

  cardImage.addEventListener('click', () => showImagePopup(cardImage));

  const isLiked = cardContent.likes.some(like => like._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
    cardElement.dataset.isLiked = true;
  }

  //счетчик лайков
  const likeCounter = cardElement.querySelector('.card__like-counter');
  likeCounter.textContent = cardContent.likes.length;
  if (cardContent.likes.length > 0) {
    likeCounter.classList.add('card__like-counter_is-active');
  }

  //удаление
  if (cardContent.owner._id !== userId) {
    deleteButton.classList.add('card__delete-button_unactive');
  } else {
    deleteButton.addEventListener('click', () => {
      handleCardDelete(cardId, cardElement);
    })
  }
  return cardElement;
}

export { createCard, likeCard };