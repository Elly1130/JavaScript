'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelectorAll('.show-modal');

for (let i = 0; i < btnOpenModal.length; i++)
  btnOpenModal[i].addEventListener('click', openModal);

// Click X to close modal
btnCloseModal.addEventListener('click', closeModal);
// Click spaces outside modal to close modal
overlay.addEventListener('click', closeModal);
// Press 'Esc' to close modal
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

function openModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
