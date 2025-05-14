import './pages/index.css';
import { createCard, likeCard } from './components/card.js';
import { initialCards } from './components/cards.js';
import { openModal, closeModal, addEventListenerFunction } from './components/modal.js';
import { enableValidation, clearValidation, validationConfig } from './components/validation.js';
import { config, checkResponse, getUserInfo, getInitialCards, editProfile, addNewCard, deleteCardFromServer } from './components/api.js';


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
function renderCard(cardContent, userId) {
  const cardElement = createCard(cardContent, likeCard, showImagePopup, userId, handleDeleteCard);
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

//обработчик для формы редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault(); 

  const nameInput = document.forms['edit-profile'].elements.name;
  const jobInput = document.forms['edit-profile'].elements.description;

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
  });
};

//обработчик формы с добавлением карточки
//добавление на сервер
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); 

  const inputCardTitle = addCardForm.elements['place-name'].value;
  const inputCardImage = addCardForm.elements.link.value;

  const newCardContent = {
      name: inputCardTitle,
      link: inputCardImage
    };

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
function handleDeleteCard(cardId, cardElement) {
  return deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove(); 
    })
    .catch(error => {
      console.error(error);
    });
}

 //функция для добавления новой карточки через модалку
 function addCard(newCardContent) {
  const cardElement = createCard(newCardContent, likeCard, showImagePopup);
  placesList.prepend(cardElement);
  }

//прикрепляем обработчики к формам
editForm.addEventListener('submit', handleEditFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);

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

//слушатели для закрытия окон
addEventListenerFunction(popupProfileEdit, () => {
  clearValidation(editForm, validationConfig); //чистим валидацию
});
addEventListenerFunction(popupAddCard);
addEventListenerFunction(popupImage);

//загрузка карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {

    const profileName = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
    const profileImage = document.querySelector('.profile__image');

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    //сохраняем ID пользователя 
    const userId = userData._id;
    //отображаем карточки
    cards.forEach(card => renderCard(card, userId));
  })
  .catch((error) => {
    console.error(error);
  });

//валидация
enableValidation(validationConfig);