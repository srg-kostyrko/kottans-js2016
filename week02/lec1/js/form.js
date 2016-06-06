const cardInput = document.getElementById('credit-card-number');
const cardTypes = [
  'visa',
  'master',
  'maestro',
];

updateCardClass();
cardInput.addEventListener('keyup', updateCardClass);

const urgencyInput = document.getElementById('job-urgency');
updateUrgencyLabels();
urgencyInput.addEventListener('change', updateUrgencyLabels);

function updateCardClass() {
  cardInput.classList.remove(...cardTypes);
  const type = Payment.fns.cardType(cardInput.value);
  if (type !== null) {
    cardInput.classList.add(type);
  }
}

function updateUrgencyLabels() {
  const labels = Array.from(document.querySelectorAll('.range-labels label'));
  labels.forEach((label) => {
    if (label.dataset.value == urgencyInput.value) {
      label.classList.add('selected');
    } else {
      label.classList.remove('selected');
    }
  });
}
