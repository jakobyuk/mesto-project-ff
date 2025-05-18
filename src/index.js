import './pages/index.css';
import { createCard, likeCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import { openModal, closeModal, addEventListenerFunction } from './components/modal.js';
import { enableValidation, clearValidation, validationConfig } from './components/validation.js';
import { config, checkResponse, getUserInfo, getInitialCards, editProfile, addNewCard, deleteCard, updateAvatar } from './components/api.js';


const placesList = document.querySelector('.places__list');

//модалки
const popupProfileEdit = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupAvatarEdit = document.querySelector('.popup_type_avatar');

//элементы на которые весим окна
const editButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button'); 
const profileImage = document.querySelector('.profile__image');


//формы
const editForm = document.forms['edit-profile'];
const addCardForm = document.forms['new-place'];
const editAvatarForm = document.forms['avatar'];

//функция ожидания загрузки
const showLoading = (isLoading, button) => {
  if(isLoading) {
    button.textContent = 'Сохранение...';
  }
  else {
    button.textContent = 'Сохранить';
  }
}

//рендеринг карточек
function renderCard(cardContent, userId) {
  const cardElement = createCard(cardContent, likeCard, showImagePopup, userId, handleCardDelete);
  placesList.appendChild(cardElement);
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

//код для заполнения инпутов 
const fillEditFormInputs = () => {
  const nameInput = document.forms['edit-profile'].elements.name;
  const jobInput = document.forms['edit-profile'].elements.description;

  const profileName = document.querySelector('.profile__title');
  const profileDescription = document.querySelector('.profile__description');

  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
};

//обработчик формы с редактированием аватара
function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault();
  showLoading(true, popupAvatarEdit.querySelector('.popup__button'));

  updateAvatar(editAvatarForm.elements['link'].value)
  .then((res) => {
    profileImage.setAttribute('style', `background-image: url('${res.avatar}')`);
    closeModal(popupAvatarEdit);
    editAvatarForm.reset();
    clearValidation(editAvatarForm, validationConfig);
  })
  .catch((err) => {
    console.error(err);
  });
};

//обработчик для формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault(); 

  const nameInput = document.forms['edit-profile'].elements.name;
  const jobInput = document.forms['edit-profile'].elements.description;

  showLoading(true, popupProfileEdit.querySelector('.popup__button'));

  //загрузка данных профиля с сервера
  editProfile(nameInput.value, jobInput.value)
  .then((updatedProfile) => {
    const profileName = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');

    profileName.textContent = updatedProfile.name;
    profileDescription.textContent = updatedProfile.about;

    closeModal(popupProfileEdit);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    showLoading(false, popupProfileEdit.querySelector('.popup__button'));
  })
};

//обработчик формы с добавлением карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); 

  const inputCardTitle = addCardForm.elements['place-name'].value;
  const inputCardImage = addCardForm.elements['link'].value;
  const newCardContent = {
      name: inputCardTitle,
      link: inputCardImage
    };

  showLoading(true, popupAddCard.querySelector('.popup__button'));

  //функция для добавления карточки с сервера
  addNewCard(inputCardTitle, inputCardImage)
  .then(newCard => {
    // После успешного добавления добавляем карточку в DOM
    addCard(newCard);
    closeModal(popupAddCard);
    addCardForm.reset();
    clearValidation(addCardForm, validationConfig);
  })
  .catch(error => {
    console.error(error);
  }); 
};

//удаление карточки, запрос к серверу
function handleCardDelete(cardId, cardElement) {
  return deleteCard(cardId)
    .then(() => {
      cardElement.remove(); 
    })
    .catch(error => {
      console.error(error);
    });
}

 //функция для добавления новой карточки через модалку
 function addCard(newCardContent, userId) {
  const cardElement = createCard(newCardContent, likeCard, showImagePopup, userId, handleCardDelete);
  placesList.prepend(cardElement);
  }

//прикрепляем обработчики к формам
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);
editAvatarForm.addEventListener('submit', handleEditAvatarFormSubmit);

//повесили обработчики событий для открытия модальных окон
editButton.addEventListener('click', () => {
  clearValidation(editForm, validationConfig); //чистим валидацию
  fillEditFormInputs(); //заполняем инпуты перед открытием попапа
  openModal(popupProfileEdit); 
});
addCardButton.addEventListener('click', () => {
  clearValidation(addCardForm, validationConfig); //очистка валидации
  openModal(popupAddCard);
});
profileImage.addEventListener('click', () => {
  clearValidation(editAvatarForm, validationConfig);
  openModal(popupAvatarEdit);
})


//слушатели для закрытия окон
addEventListenerFunction(popupProfileEdit, () => {
  clearValidation(editForm, validationConfig); 
});
addEventListenerFunction(popupAddCard);
addEventListenerFunction(popupImage);
addEventListenerFunction(popupAvatarEdit);

//загрузка карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {

    const profileName = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
    const profileImage = document.querySelector('.profile__image');

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    const userId = userData._id;
    
    cards.forEach(card => renderCard(card, userId));
  })
  .catch((error) => {
    console.error(error);
  });

//валидация
enableValidation(validationConfig);