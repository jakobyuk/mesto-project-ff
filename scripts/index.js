const cardTemplate = document.querySelector('#card-template');

function deleteCard(event) {
  const card = event.target.closest('.card');
  card.remove();
}

function addCard(cardContent) {
  const cardElement = cardTemplate.content.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button').addEventListener('click', deleteCard);;

  cardImage.src = cardContent.link;
  cardImage.alt = cardContent.name;
  cardTitle.textContent = cardContent.name;

  return cardElement;
}

const placesList = document.querySelector('.places__list');

function renderCard(cardContent) {
  const cardElement = addCard(cardContent);
  placesList.appendChild(cardElement);
  }
  
initialCards.forEach(renderCard);