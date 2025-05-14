const cardTemplate = document.querySelector('#card-template');

// function deleteCard(event) {
//   const card = event.target.closest('.card');
//   card.remove();
// }

//функция лайка
function likeCard(event) {
  const heart = event.target; 
  const card = heart.closest('.card');
  const likeCounter = card.querySelector('.card__like-counter');

  const isLiked = card.dataset.isLiked === 'true';
  if (isLiked) {
    card.dataset.isLiked = false;
    heart.classList.remove('card__like-button_is-active');
    likeCounter.textContent = String(Number(likeCounter.textContent) - 1);
    if (likeCounter.textContent === '0') {
      likeCounter.classList.remove('card__like-counter_is-active');
    }
  } else {
    card.dataset.isLiked = true;
    heart.classList.add('card__like-button_is-active');
    likeCounter.textContent = String(Number(likeCounter.textContent) + 1);
    likeCounter.classList.add('card__like-counter_is-active');
  }
}

function createCard(cardContent, likeCard, showImagePopup, userId, handleDeleteCard) {
  const cardElement = cardTemplate.content.cloneNode(true);
  
  const cardId = cardContent._id;
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button').addEventListener('click', likeCard);

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

  // кнопка удаления видна только для своих карточек
  if (cardContent.owner._id !== userId) {
    deleteButton.classList.add('card__delete-button_unactive');
  } else {
    deleteButton.addEventListener('click', () => {
      handleDeleteCard(cardId, cardElement);
    })
  }
  return cardElement;
}

export { createCard, likeCard };