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

export { openModal, closeModal, addEventListenerFunction};