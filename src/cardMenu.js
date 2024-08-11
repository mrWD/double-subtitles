const QUIZLET_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m25.3943 2.5455a21.1471 21.1471 0 0 0 -17.4149 7.3184 21.35 21.35 0 0 0 7.0043 33.2406 21.11 21.11 0 0 0 18.872-.4063.5875.5875 0 0 1 .3-.0638.5817.5817 0 0 1 .2913.0964 16.376 16.376 0 0 0 9.3119 2.7683.5932.5932 0 0 0 .5934-.5949v-7.2342a.5975.5975 0 0 0 -.1369-.3886.5863.5863 0 0 0 -.3553-.2063 8.395 8.395 0 0 1 -1.9819-.5711.5891.5891 0 0 1 -.3273-.3753.6173.6173 0 0 1 -.0177-.2551.6033.6033 0 0 1 .0892-.2389 21.3658 21.3658 0 0 0 -5.8561-29.5607 21.1237 21.1237 0 0 0 -10.3963-3.5413zm-14.217 21.273a12.9087 12.9087 0 0 1 7.9188-11.9366 12.7967 12.7967 0 0 1 14.0012 2.7921 12.9438 12.9438 0 0 1 -1.949 19.865 12.8043 12.8043 0 0 1 -16.2137-1.6038 12.9421 12.9421 0 0 1 -3.7661-9.1179z" fill="#4355ff" stroke="#4355ff" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ANKIAPP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="48pt" viewBox="0 0 48 48" width="48pt"><linearGradient id="a" gradientTransform="matrix(49.077 0 0 49.651 -1.017 -.909)" gradientUnits="userSpaceOnUse" x1="0" x2=".907488" y1=".5" y2=".920078"><stop offset="0" stop-color="#00c4ff"/><stop offset=".83888397938" stop-color="#0072ff"/></linearGradient><path d="m20.509 12.697c-.278 1.259-1.528 2.061-2.79 1.79-1.263-.271-2.062-1.519-1.785-2.784l1.484-6.893c.679-3.156 3.085-3.866 5.369-1.584l8.169 8.161 11.273-.91c3.218-.26 4.655 1.872 3.207 4.757l-4.934 9.829 3.826 9.915c1.162 3.012-.481 5.038-3.668 4.521l-11.318-1.836-8.939 7.36c-2.492 2.053-4.829 1.117-5.216-2.088l-1.3-10.771-9.97-6.346c-2.723-1.734-2.521-4.163.452-5.422l8.184-3.464c1.189-.503 2.562.052 3.066 1.24.503 1.188-.052 2.562-1.241 3.066l-5.369 2.281 9.254 5.884 1.24 10.296 8.505-6.996 11.126 1.801-3.744-9.698 4.761-9.465-10.973.889-7.768-7.756z" fill="url(#a)"/></svg>`
const GSHEETS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48"><path fill="#43a047" d="M37,45H11c-1.657,0-3-1.343-3-3V6c0-1.657,1.343-3,3-3h19l10,10v29C40,43.657,38.657,45,37,45z"></path><path fill="#c8e6c9" d="M40 13L30 13 30 3z"></path><path fill="#2e7d32" d="M30 13L40 23 40 13z"></path><path fill="#e8f5e9" d="M31,23H17h-2v2v2v2v2v2v2v2h18v-2v-2v-2v-2v-2v-2v-2H31z M17,25h4v2h-4V25z M17,29h4v2h-4V29z M17,33h4v2h-4V33z M31,35h-8v-2h8V35z M31,31h-8v-2h8V31z M31,27h-8v-2h8V27z"></path></svg>`;

const ANKIAPP_CHECKBOX = 'ankiapp-check';
const QUIZLET_CHECKBOX = 'quizlet-check';
const GSHEETS_CHECKBOX = 'gsheets-check';

const ANKIAPP_INPUT = 'ankiDeckName';
const QUIZLET_INPUT = 'quizletDeckName';
const GSHEETS_INPUT = 'gSheetSpreadsheetId';
const GSHEETS_RANGE = 'gSheetRangeName';

function openMenu({ text, translation }) {
  const menu = createMenu();

  const textInput = document.querySelector('#text-input');
  const translationInput = document.querySelector('#translation-input');

  textInput.value = text;
  translationInput.value = translation;

  menu.classList.toggle('visible');
}

function createMenu() {
  const existedMenu = document.querySelector('#menu');

  if (existedMenu) {
    return existedMenu;
  }

  const menu = document.createElement('div');
  const btnGroup = document.createElement('div');

  menu.classList.add('menu');
  menu.setAttribute('id', 'menu');

  menu.appendChild(createInput('text-input'));
  menu.appendChild(createInput('translation-input'));

  menu.appendChild(createServiceCheckbox(ANKIAPP_CHECKBOX, ANKIAPP_SVG, 'Anki'));
  menu.appendChild(createServiceForm(ANKIAPP_INPUT));

  menu.appendChild(createServiceCheckbox(QUIZLET_CHECKBOX, QUIZLET_SVG, 'Quizlet'));
  menu.appendChild(createServiceForm(QUIZLET_INPUT));

  menu.appendChild(createServiceCheckbox(GSHEETS_CHECKBOX, GSHEETS_SVG, 'Google Sheet'));
  menu.appendChild(createServiceForm(GSHEETS_INPUT, GSHEETS_RANGE));

  btnGroup.classList.add('btnGroup');
  btnGroup.appendChild(createCancelButton());
  btnGroup.appendChild(createSaveButton());

  menu.appendChild(btnGroup);

  document.body.appendChild(menu);

  return menu;
}

function createCancelButton() {
  const cancelButton = document.createElement('button');

  cancelButton.classList.add('cancelButton');
  cancelButton.textContent = 'Cancel';

  cancelButton.addEventListener('click', () => {
    const menu = document.querySelector('#menu');

    menu.classList.remove('visible');
  });

  return cancelButton;
}

function createSaveButton() {
  const saveButton = document.createElement('button');

  saveButton.classList.add('saveButton');
  saveButton.textContent = 'Save';

  saveButton.addEventListener('click', () => {
    const textInput = document.querySelector('#text-input');
    const translationInput = document.querySelector('#translation-input');

    saveCards({
      text: textInput.value,
      translation: translationInput.value,
    });
  });

  return saveButton;
}

function createInput(name) {
  const input = document.createElement('textarea');

  input.classList.add('serviceInput');

  input.setAttribute('id', name);
  input.setAttribute('name', name);
  input.setAttribute('type', 'text');

  return input;
}

function createServiceCheckbox(id, svg, name) {
  const checkbox = `<input class="saveCheckbox" type="checkbox" value="${id}">`;
  const saveButton = document.createElement('label');

  saveButton.classList.add('serviceCheckbox');
  saveButton.innerHTML = checkbox + svg + `<span>${name}</span>`;

  return saveButton;
}

function saveCards({ text, translation }) {
  const checkboxes = document.querySelectorAll('.saveCheckbox');
  const mapCheckBoxToService = {
    [ANKIAPP_CHECKBOX]: () => {
      const deckName = document.getElementById(ANKIAPP_INPUT).value;
      saveToAnki({ deckName, text, translation });
    },
    [QUIZLET_CHECKBOX]: () => {
      const deckName = document.getElementById(QUIZLET_INPUT).value;
      saveToQuizlet({ deckName, text, translation });
    },
    [GSHEETS_CHECKBOX]: () => {
      const spreadsheetId = document.getElementById(GSHEETS_INPUT).value;
      const rangeName = document.getElementById(GSHEETS_RANGE).value;
      saveToGSheet({ spreadsheetId, rangeName, text, translation });
    },
  };

  Array.from(checkboxes).forEach(checkbox => {
    if (checkbox.checked) {
      mapCheckBoxToService[checkbox.value]();
    }
  });
}

function createServiceForm(...fields) {
  const div = document.createElement('div');

  div.classList.add('serviceForm');

  fields.forEach(field => {
    const input = document.createElement('input');

    input.setAttribute('id', field);
    input.setAttribute('name', field);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', field);

    input.addEventListener('keypress', (e) => {
      if (e.key !== 'Tab') {
        e.stopPropagation();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') {
        e.stopPropagation();
      }
    });

    input.addEventListener('keyup', (e) => {
      if (e.key !== 'Tab') {
        e.stopPropagation();
      }
    });

    div.appendChild(input);
  });

  return div;
}
