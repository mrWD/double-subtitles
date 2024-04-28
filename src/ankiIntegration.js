function openAnkit() {
  window.open('https://ankiuser.net/add', '_blank');

  setTimeout(() => {
    fillAnkiCard({ text, translation });
  }, 5000);
}

function fillAnkiCard(data) {
  const labelList = [...document.querySelectorAll('.col-form-label')];

  for (let index = 0; index < labelList.length; index++) {
    const label = labelList[index];

    if (label.textContent === 'Front') {
      label.parentElement.querySelector('.field').value = data.text;
    }

    if (label.textContent === 'Back') {
      label.parentElement.querySelector('.field').value = data.translation;
    }
  }
}
