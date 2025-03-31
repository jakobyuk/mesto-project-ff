import { addCard } from './card.js';

const popupProfileEdit = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const handleEscKeyUp = (event) => {
  if (event.key === 'Escape') {
    const popup = document.querySelector('.popup_is-opened'); 
    closeModal(popup);
  }
};

const openModal = (modal) => {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscKeyUp);
};

const closeModal = (modal) => {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscKeyUp);
};

const addEventListenerFunction = (popupElement) => {
 const popupClose = popupElement.querySelector('.popup__close');
  popupClose.addEventListener('click', () => {
    closeModal(popupElement);
  });

  popupElement.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('popup')) {
      closeModal(popupElement);
    }
  });
}

//код для формы с редактированием профиля

// Находим поля формы и вставляем то, что изначально на страничке
const nameInput = document.forms['edit-profile'].elements.name;
const jobInput = document.forms['edit-profile'].elements.description;

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

nameInput.value = profileName.textContent;
jobInput.value = profileDescription.textContent;

//обработчик для формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault(); 

  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(popupProfileEdit);
};

//код для формы с добавлением карточки
const addCardForm = document.forms['new-place'];

function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); 
  const inputCardTitle = addCardForm.elements['place-name'].value;
  const inputCardImage = addCardForm.elements.link.value;
  const newCardContent = {
      name: inputCardTitle,
      link: inputCardImage};
  addCard(newCardContent); 

  closeModal(popupAddCard);
};

//код для попапа с картинкой
function showImagePopup(image) {

  openModal(popupImage); 

  const popupImagePic = popupImage.querySelector('.popup__image');
  const popupImageName = popupImage.querySelector('.popup__caption');

  popupImagePic.src = image.src; 
  popupImagePic.alt = image.alt; 
  popupImageName.textContent = image.alt; 
};


export { openModal, closeModal, addEventListenerFunction, handleEditFormSubmit, handleAddCardFormSubmit, showImagePopup };
export { popupProfileEdit, popupAddCard, popupImage };