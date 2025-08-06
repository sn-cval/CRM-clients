'use strict';

const main = document.querySelector('main')
const table = main.querySelector('.table__body')
const content = main.querySelector('.contacts__content')
const searchInput = document.querySelector('.header__input')
const searchList = document.querySelector('.header__list')
const addBtnClient = document.querySelector('.contacts__button')

let sortDefault = 'id'

//Функция создания 1 элемента таблицы
function createTrTable(client) {
  const tableTr = document.createElement('tr');

  const tdId = document.createElement('td');
  const tdName = document.createElement('td');
  const tdTimeCreate = document.createElement('td');
  const tdTimeUpdate = document.createElement('td');
  const tdContact = document.createElement('td');
  const tdAction = document.createElement('td');

  const contactBlock = document.createElement('div');
  const dateCreate = document.createElement('span');
  const timeCreate = document.createElement('span');
  const dateUpdate = document.createElement('span');
  const timeUpdate = document.createElement('span');

  const btnEdit = document.createElement('button');
  const btnDelete = document.createElement('button');

  const spinnerEdit = document.createElement('span')

  tableTr.classList.add('table__client');
  tdId.classList.add('table__id');
  tdName.classList.add('table__name');
  tdTimeCreate.classList.add('table__time');
  tdTimeUpdate.classList.add('table__time');
  tdContact.classList.add('table__contact');
  tdAction.classList.add('table__action');

  contactBlock.classList.add('contact__flex');

  dateCreate.classList.add('table__date');
  timeCreate.classList.add('table__clock');
  dateUpdate.classList.add('table__date');
  timeUpdate.classList.add('table__clock');
  btnEdit.classList.add('btn__edit', 'btn');
  btnDelete.classList.add('btn__delete', 'btn');
  spinnerEdit.classList.add('spinner__edit')

  tdId.textContent = client.id;
  tdName.textContent = getFullNameClient(client);
  dateCreate.textContent = getDate(client).dateCreate
  timeCreate.textContent = getDate(client).timeCreate
  dateUpdate.textContent = getDate(client).dateUpdate
  timeUpdate.textContent = getDate(client).timeUpdate

  btnEdit.textContent = 'Изменить';
  btnDelete.textContent = 'Удалить';

  spinnerEdit.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/></svg>'

  tdTimeCreate.append(dateCreate);
  tdTimeCreate.append(timeCreate);
  tdTimeUpdate.append(dateUpdate);
  tdTimeUpdate.append(timeUpdate);

  tdContact.append(contactBlock);

  tdAction.append(btnEdit);
  tdAction.append(btnDelete);
  btnEdit.append(spinnerEdit)

  tableTr.append(tdId);
  tableTr.append(tdName);
  tableTr.append(tdTimeCreate);
  tableTr.append(tdTimeUpdate);
  tableTr.append(tdContact);
  tableTr.append(tdAction);

  table.append(tableTr)

  if (client.contacts.length > 0 && client.contacts.length >= 5) {

    for (let i = 0; i < 4; i++) {
      createContact(client.contacts[i])
    }

    const contactQuantity = document.createElement('button')
    contactQuantity.classList.add('contact__quantity')
    contactQuantity.textContent = `+${client.contacts.length - 4}`
    contactBlock.append(contactQuantity)

    contactQuantity.addEventListener('click', () => {
      for (let i = 4; i < client.contacts.length; i++) {
        createContact(client.contacts[i])
        contactQuantity.style.display = 'none'
      }
    })

  } else if (client.contacts.length > 0 && client.contacts.length < 5) {
    client.contacts.forEach(item => {
      createContact(item)
    })
  }

  // Функция отрисовки контактов

  function createContact(array) {
    const contactItem = document.createElement('div')
    const contact = document.createElement('span')
    const tooltip = document.createElement('span')

    contactItem.classList.add('contact__block')
    contact.classList.add('contact__content')
    tooltip.classList.add('contact__tooltip')

    if (array.type === 'Телефон' || array.type === 'Доп. телефон') {
      contact.classList.add('contact__content--phone')
    } else if (array.type === 'Email') {
      contact.classList.add('contact__content--email')
    } else if (array.type === 'Facebook') {
      contact.classList.add('contact__content--fb')
    } else if (array.type === 'Vk') {
      contact.classList.add('contact__content--vk')
    } else if (array.type === 'Другое') {
      contact.classList.add('contact__content--other')
    }

    tooltip.insertAdjacentHTML('beforeend', `<span>${array.type}:</span><span class="contact--value">${array.value}</span>`)

    contactItem.append(contact)
    contactItem.append(tooltip)
    contactBlock.append(contactItem)
  }

  btnDelete.addEventListener('click', () => {
    openModalDelete(tableTr, client)
  })

  btnEdit.addEventListener('click', () => {
    spinnerEdit.style.display = 'inline-block'
    btnEdit.classList.add('btn__edit--wait')

    setTimeout(() => {
      openModalEdit(tableTr, client)

      spinnerEdit.style.display = 'none'
      btnEdit.classList.remove('btn__edit--wait')
    },1500)
  })

  return tableTr
}

//Функция вывода фамилии, имени, отчества клиента

function getFullNameClient(element) {
  const fullNameClient = `${element.surname} ${element.name} ${element.lastName}`
  return fullNameClient
}

//Функция конвертирования даты и времени

function getDate(element) {
  const periodCreate = new Date(element.createdAt)
  const periodUpdate = new Date(element.updatedAt)

  const dateCreate = `${formattingDate(periodCreate.getDate())}.${formattingDate(periodCreate.getMonth() + 1)}.${periodCreate.getFullYear()}`
  const timeCreate = `${formattingDate(periodCreate.getHours())}:${formattingDate(periodCreate.getMinutes())}`

  const dateUpdate = `${formattingDate(periodUpdate.getDate())}.${formattingDate(periodUpdate.getMonth() + 1)}.${periodUpdate.getFullYear()}`
  const timeUpdate = `${formattingDate(periodUpdate.getHours())}:${formattingDate(periodUpdate.getMinutes())}`

  return { dateCreate, timeCreate, dateUpdate, timeUpdate }
}

//Функция форматирования даты

function formattingDate(date) {
  date = date < 10 ? '0' + date : date
  return date
}

// Функция создания прелоадера

function createLoader() {
  const blockPreloader = document.createElement('div')
  const loader = document.createElement('div')

  blockPreloader.classList.add('loader-block')
  loader.classList.add('loader')

  blockPreloader.append(loader)
  content.append(blockPreloader)
}

// Функция открытия модального окна "Удалить клиента"

function openModalDelete(element, item) {

  const modal = document.createElement('div');
  modal.classList.add('modal-delete')

  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal-delete__container">
        <div class="modal-delete__content">
          <button class="btn-close modal-delete__close"></button>
          <h2 class="title modal-delete__title">Удалить клиента</h2>
          <p class="text modal-delete__desc">Вы действительно хотите удалить данного клиента?</p>
          <button class="button modal-delete__btn">
          <svg class="modal-delete__spinner" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
            Удалить
          </button>
          <button class="modal-delete__cancel">Отмена</button>
        </div>
      </div>
    `)

  main.after(modal)

  modal.querySelector('.modal-delete__btn').addEventListener('click', async () => {
    const spinner = modal.querySelector('.modal-delete__spinner')
  
    try {
      await deleteClient(item)
      spinner.style.display = 'inline-block'

      setTimeout(() => {
        element.remove()
        closeModal(modal) 
      }, 1500)

    } catch (error) {
      console.log(error)
    } finally {

      setTimeout(() => {
        spinner.style.display = 'none'
      }, 1500)

    }
  })

  modal.querySelector('.modal-delete__close').addEventListener('click', () => {
    closeModal(modal)
  })

  modal.querySelector('.modal-delete__cancel').addEventListener('click', () => {
    closeModal(modal)
  })
}

// Функция закрытия модального окна "Удалить клиента"

function closeModal(element) {
  element.remove()
}

// Функция сортировка массива по возрастанию при загрузки страницы

function sortClientUp(array, parametr) {
  array = array.sort((a, b) => {
    if (a[parametr] < b[parametr]) {
      return -1
    }
  })

  return array
}

// Функция удаление активного класса у header-элемента таблицы

function deleteActiveClass() {
  const header = document.querySelectorAll('[data-type]');

  header.forEach(item => {
    item.classList.remove('table__title--active')
  })
}

//Функция сортировки таблицы

const sortTable = () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tbody = table.querySelector('tbody');

  const directions = Array.from(headers).map(() => '');

  const transform = (type, content) => {
    switch (type) {
      case 'id':
        return parseFloat(content);
      case 'create':
      case 'update':
        const desc = content.split('.').join('-');
        const year = desc.slice(6, 10);
        const month = desc.slice(3, 5);
        const day = desc.slice(0, 2);
        const time = desc.slice(10);
        const result = `${year}-${month}-${day}T${time}Z`
        return Date.parse(result)
      case 'text':
      default:
        return content;
    }
  }

  const sortColumn = (index) => {
    const type = headers[index].getAttribute('data-type');
    const rows = tbody.querySelectorAll('tr');
    const direction = directions[index] || 'sortDown';
    const multiply = direction === 'sortDown' ? -1 : 1;
    const newRows = Array.from(rows);

    newRows.sort((row1, row2) => {
      const cellA = row1.querySelectorAll('td')[index].textContent;
      const cellB = row2.querySelectorAll('td')[index].textContent;

      const a = transform(type, cellA);
      const b = transform(type, cellB);

      switch (true) {
        case a > b:
          return 1 * multiply;
        case a < b:
          return -1 * multiply;
        default:
          break;
        case a === b:
          return 0;
      }
    });

    [].forEach.call(rows, (row) => {
      tbody.removeChild(row);
    });

    directions[index] = direction === 'sortDown' ? 'sortUp' : 'sortDown';

    newRows.forEach(newRow => {
      tbody.appendChild(newRow);
    });
  }

  [].forEach.call(headers, (header, index) => {
    header.addEventListener('click', () => {
      sortColumn(index);
      deleteActiveClass()
      header.classList.add('table__title--active')
      if (header.classList.contains('table__title--down')) {
        header.classList.remove('table__title--down')
        header.classList.add('table__title--up')
      } else {
        header.classList.add('table__title--down')
        header.classList.remove('table__title--up')
      }
    });
  });
}

// Создание выпадающего списка при поиске по таблице
function createItemSearch(client) {

  const findItem = document.createElement('li')
  const findLink = document.createElement('a')

  findItem.classList.add('header__item')
  findLink.classList.add('header__link')

  findLink.textContent = `${client.surname} ${client.name} ${client.lastName}`
  findLink.href = '#'

  findItem.append(findLink)
  searchList.append(findItem)
}

//Функция выделения найденного текста при поиске по таблице

function insertMark(str, pos, len) {
  return str.slice(0, pos) + '<mark>' + str.slice(pos, pos + len) + '</mark>' + str.slice(pos + len)
}

//Функция реализации поиска по таблице

async function searchItemClient() {
  const findLinks = document.querySelectorAll('.header__link')
  const value = searchInput.value.trim()

  searchInput.addEventListener('mouseout', () => {
    if(!searchList.classList.contains('hide')) {
      searchList.classList.add('hide')
    }
  })

  if (value !== '') {
    const result = await searchClient(value)
    table.innerHTML = ''

    result.forEach(item => {
      createTrTable(item)
    })

    findLinks.forEach(link => {
      if (link.innerText.toLowerCase().search(value.toLowerCase()) == -1) {
        link.classList.add('hide')
        link.innerHTML = link.innerText
      } else {
        link.classList.remove('hide')
        searchList.classList.remove('hide')

        const str = link.innerText
        link.innerHTML = insertMark(str, link.innerText.toLowerCase().search(value.toLowerCase()), value.length)
      }
    })
  } else {
    const result = await getClient()
    table.innerHTML = ''
    result.forEach(item => {
      createTrTable(item)
    })

    findLinks.forEach(link => {
      link.classList.remove('hide')
      searchList.classList.add('hide')
      link.innerHTML = link.innerText
    })
  }
}

//Функция определения debounce

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Функция получения всех клиентов с сервера

async function getClient() {
  try {
    const response = await fetch('https://crm-clients-4bb2.onrender.com/api/clients', {
      method: 'GET'
    })
    let data = await response.json();
    data = sortClientUp(data, sortDefault)

    return data
  } catch (error) {
    console.log(error);
  }
}

// Функция удаления клиента с сервера

async function deleteClient(item) {
  try {
    const response = await fetch(`https://crm-clients-4bb2.onrender.com/api/clients/${item.id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error);
  }
}

// Функция поиска клиентов с сервера

async function searchClient(value) {
  try {
    const response = await fetch(`https://crm-clients-4bb2.onrender.com/api/clients?search=${value}`, {
      method: 'GET'
    })
    const data = await response.json()
    return data
  } catch (eror) {
    console.log(eror)
  }
}

// Функция добавления клиента на сервера

async function createClient(client) {
  try {
    const response = await fetch('https://crm-clients-4bb2.onrender.com/api/clients', {
      method: 'POST',
      body: JSON.stringify(client)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.log(error);
  }
}

// Функция изменения клиента на сервере

async function editClient(client, id) {
  try {
    const response = await fetch(`https://crm-clients-4bb2.onrender.com/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(client)
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const debounceSearchItem = debounce(searchItemClient, 300)

  createLoader()
  sortTable()

  try {
    const clients = await getClient()

    clients.forEach(client => {
      createTrTable(client)
      createItemSearch(client)
    });

  } catch (error) {
    console.log(error)
  } finally {
    setTimeout(() => {
      document.querySelector('.loader-block').style.display = 'none'
    }, 1500)
  }

  searchInput.addEventListener('input', debounceSearchItem)
  addBtnClient.addEventListener('click', createModal)
})

// Функция создания модального окна "Новый клиент"

function createModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal-add')
  modal.id = "add"

  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal__container modal-add__container">
        <div class="modal__content modal-add__content">
          <button class="btn-close modal-add__close"></button>
          <h2 class="title modal-add__title">Новый клиент</h2>
          <form class="modal__form modal-add__form" action="#" method="POST">
            <div class="modal__block modal-add__block">
              <input class="input modal__input modal-add__input input--required" name="surname" type="text" id="surname">
              <span class="modal__name modal-add__name">Фамилия<span class="modal__icon modal-add__icon">*</span></span>
              <span class="modal__error modal-add__error"></span>
            </div>
            <div class="modal__block modal-add__block">
              <input class="input modal__input modal-add__input input--required" name="name" type="text" id="name">
              <span class="modal__name modal-add__name">Имя<span class="modal__icon modal-add__icon">*</span></span>
              <span class="modal__error modal-add__error"></span>
            </div>
            <div class="modal__block modal-add__block">
              <input class="input modal__input modal-add__input" name="lastname" type="text" id="lastname">
              <span class="modal__name modal-add__name">Отчество</span>
              <span class="modal__error modal-add__error"></span>
            </div>
            <div class="modal__contacts modal-add__contacts">
              <button class="modal__btn-contact modal-add__btn-contact">Добавить контакт</button>
            </div>
            <button class="button modal__btn modal-add__btn" type=""submit>
            <svg class="modal__spinner modal-add__spinner" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
              Сохранить
            </button>
          </form>
          <button class="modal-add__cancel">Отмена</button>
        </div>
      </div>
    `)

  main.after(modal)

  const inputBlocks = modal.querySelectorAll('.modal__block')
  const inputName = modal.querySelector('#name')
  const inputSurname = modal.querySelector('#surname')
  const inputLastName = modal.querySelector('#lastname')
  const formAddClient = modal.querySelector('.modal-add__form')

  changeStyleBlockForm(inputBlocks)

  modal.querySelector('.modal-add__close').addEventListener('click', () => {
    closeModal(modal)
  })

  modal.querySelector('.modal-add__cancel').addEventListener('click', () => {
    closeModal(modal)
  })  

  formAddClient.addEventListener('submit', async (e) => {
    e.preventDefault()

    const contactsBlock = modal.querySelectorAll('.modal__block-contact')
    const spinner = modal.querySelector('.modal__spinner')

    let clientObj = {}
    let contactArray = []

    if (contactsBlock.length >= 0) {
      contactsBlock.forEach(item => {
        contactArray.push({
          type: item.querySelector('.modal__btn-list').textContent,
          value: item.querySelector('.modal__input-contact').value
        })
      })
    }

    if (validationForm(inputBlocks, contactsBlock)) {
      clientObj.name = inputName.value.slice(0, 1).toUpperCase() + inputName.value.slice(1).toLowerCase()
      clientObj.surname = inputSurname.value.slice(0, 1).toUpperCase() + inputSurname.value.slice(1).toLowerCase()
      clientObj.lastName = inputLastName.value.slice(0, 1).toUpperCase() + inputLastName.value.slice(1).toLowerCase()
      clientObj.contacts = contactArray

      try {
        spinner.style.display = 'inline-block'
        const result = await createClient(clientObj)

        setTimeout(() => {
          createTrTable(result)
          modal.remove()
        }, 1500)

      } catch (error) {
        console.log(error)
      } finally {

        setTimeout(() => {
          spinner.style.display = 'none'
        }, 1500)

      }
    }
  })

  const btnAddContact = modal.querySelector('.modal__btn-contact')
  btnAddContact.addEventListener('click', (e) => {
    e.preventDefault()

    addBlockContact(modal, btnAddContact)
  })
}

function addBlockContact(block, btn) {
  const contactItemBlock = block.querySelectorAll('.modal__block-contact')
  const blockContact = block.querySelector('.modal__contacts')

    if (contactItemBlock.length < 10) {
      createFormContact(blockContact, 'Телефон')
    }

    if (contactItemBlock.length === 9) {
      btn.classList.add('modal__btn-contact--disactive')
    }
}

// Изменение стилей блока с input-ом

function changeStyleBlockForm(blocks) {
  blocks.forEach(item => {
    const inputName = item.querySelector('.modal__name')
    const input = item.querySelector('.input')
    const error = item.querySelector('.modal__error')

    inputName.addEventListener('click', () => {
      inputName.classList.add('modal__name--active')
      input.focus()
      error.classList.remove('modal__error--active')
      input.classList.remove('modal__input--error')
    })

    inputName.addEventListener('mouseover', () => {
      input.classList.add('modal__input--hover')
    })

    inputName.addEventListener('mouseout', () => {
      input.classList.remove('modal__input--hover')
    })

    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        inputName.classList.add('modal__name--active')
        error.classList.remove('modal__error--active')
        input.classList.remove('modal__input--error')
      } else {
        input.value = '';
      }
    })

    if(input.value.trim() !== '') {
      inputName.classList.add('modal__name--active')
    }
  })
}

// Функция валидации формы контакта

function validationForm(form, contacts) {

  let patternText = /[a-zA-Zа-яА-Я ]+$/;
  let patternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  let validation = true

  form.forEach(item => {
    const input = item.querySelector('.input')
    const error = item.querySelector('.modal__error')

    if (input.classList.contains('input--required') && input.value.trim() == '') {
      validation = false

      input.classList.add('modal__input--error')
      error.classList.add('modal__error--active')
      error.textContent = 'Заполните поле'
    }

    if (!patternText.test(input.value) && input.value !== '') {
      validation = false

      input.classList.add('modal__input--error')
      error.classList.add('modal__error--active')
      error.textContent = 'Введите корректные данные'
    }
  })

  if (contacts.length > 0) {
    contacts.forEach(contact => {
      const input = contact.querySelector('.modal__input-contact')
      const error = contact.querySelector('.modal__contact-error')

      if (input.value.trim() == '') {
        validation = false;
        input.classList.add('modal__input-contact--error')
        error.classList.add('modal__contact-error--active')
        error.textContent = 'Введите данные'
      }

      switch (input.name) {
        case 'email':
          if (!patternEmail.test(input.value)) {
            validation = false;
            input.classList.add('modal__input-contact--error')
            error.classList.add('modal__contact-error--active');
            error.textContent = 'Введите корректный email'
          }
          break;
        case 'phone':
          const phone = input.inputmask.unmaskedvalue()
          if (phone.length < 10) {
            validation = false;
            input.classList.add('modal__input-contact--error')
            error.classList.add('modal__contact-error--active');
            error.textContent = 'Введите корректный номер телефона'
          }
          break;
        default:
          break
      }
    })
  }

  return validation
}

// Функция создания блока контактов

function createFormContact(element, type, value = '') {
  const blockContactItem = document.createElement('div')
  const contactButton = document.createElement('button')
  const contactList = document.createElement('ul')
  const phoneItem = document.createElement('li')
  const phoneTwoItem = document.createElement('li')
  const emailItem = document.createElement('li')
  const vkItem = document.createElement('li')
  const fbItem = document.createElement('li')
  const otherItem = document.createElement('li')
  const inputContact = document.createElement('input')
  const closeContact = document.createElement('button')
  const spanError = document.createElement('span')

  blockContactItem.classList.add('modal__block-contact')
  contactButton.classList.add('modal__btn-list')
  contactList.classList.add('modal__list')
  inputContact.classList.add('input', 'modal__input-contact')
  closeContact.classList.add('modal__close-contact')
  phoneItem.classList.add('modal__item')
  phoneTwoItem.classList.add('modal__item')
  emailItem.classList.add('modal__item')
  vkItem.classList.add('modal__item')
  fbItem.classList.add('modal__item')
  otherItem.classList.add('modal__item')
  spanError.classList.add('modal__contact-error')

  contactButton.textContent = type
  phoneItem.textContent = 'Телефон'
  phoneTwoItem.textContent = 'Доп. телефон'
  emailItem.textContent = 'Email'
  vkItem.textContent = 'Vk'
  fbItem.textContent = 'Facebook'
  otherItem.textContent = 'Другое'
  inputContact.placeholder = 'Введите данные контакта'
  inputContact.value = value

  contactList.append(phoneItem)
  contactList.append(phoneTwoItem)
  contactList.append(emailItem)
  contactList.append(vkItem)
  contactList.append(fbItem)
  contactList.append(otherItem)
  blockContactItem.append(contactButton)
  blockContactItem.append(contactList)
  blockContactItem.append(inputContact)
  blockContactItem.append(spanError)
  blockContactItem.append(closeContact)
  element.prepend(blockContactItem)

  const inputMask = new Inputmask('+7 (999) 999-99-99');

  addAttributeInput(contactButton, inputContact)

  contactList.addEventListener('mouseleave', () => {
    contactButton.classList.remove('modal__btn-list--active')
    contactList.classList.remove('modal__list--active')
  })

  if (inputContact.name === 'phone') {
    inputMask.mask(inputContact)
  }

  if (inputContact.value.trim() !== '') {
    closeContact.classList.add('modal__close-contact--active')
  } else {
    closeContact.classList.remove('modal__close-contact--active')
  }

  inputContact.addEventListener('input', () => {
    if (spanError.classList.contains('modal__contact-error--active')) {
      spanError.classList.remove('modal__contact-error--active')
      inputContact.classList.remove('modal__input-contact--error')
    }

    if (inputContact.value.trim() !== '') {
      closeContact.classList.add('modal__close-contact--active')
    } else {
      closeContact.classList.remove('modal__close-contact--active')
      inputContact.value = ''
    }
  })

  closeContact.addEventListener('click', (e) => {
    const btnAddContact = document.querySelector('.modal__btn-contact')

    e.preventDefault()
    blockContactItem.remove()

    if (btnAddContact.classList.contains('modal__btn-contact--disactive')) {
      btnAddContact.classList.remove('modal__btn-contact--disactive')
    }
  })

  contactButton.addEventListener('click', (e) => {
    e.preventDefault()
    contactButton.classList.toggle('modal__btn-list--active')
    contactList.classList.toggle('modal__list--active')

    const contactsItem = blockContactItem.querySelectorAll('.modal__item')
    contactsItem.forEach(item => {

      if (item.textContent === contactButton.textContent) {
        item.classList.add('modal__item--desactive')
      } else {
        item.classList.remove('modal__item--desactive')
      }

      item.addEventListener('click', () => {
        contactButton.classList.remove('modal__btn-list--active')
        contactList.classList.remove('modal__list--active')

        if (inputContact.value !== '') {
          inputContact.value = ''
        }

        if (spanError.classList.contains('modal__contact-error--active')) {
          spanError.classList.remove('modal__contact-error--active')
          inputContact.classList.remove('modal__input-contact--error')
        }

        contactButton.textContent = item.textContent
        addAttributeInput(item, inputContact)
      })
    })
  })

  return {
    blockContactItem,
    contactButton,
    inputContact
  }
}

// Добавление атрибутов в input при соответсвующем type

function addAttributeInput(element, input) {
  const inputMask = new Inputmask('+7 (999) 999-99-99');

  switch (element.textContent) {
    case 'Телефон':
    case 'Доп. телефон':
      input.type = 'tel'
      input.name = 'phone'
      input.id = 'phone'

      inputMask.mask(input)
      break;
    case 'Email':
      input.type = 'email'
      input.name = 'email'
      input.id = 'email'

      if (input.inputmask)
        input.inputmask.remove()
      break;
    case 'Vk':
      input.type = 'text'
      input.name = 'vk'
      input.id = 'vk'

      if (input.inputmask)
        input.inputmask.remove()
      break;
    case 'Facebook':
      input.type = 'text'
      input.name = 'facebook'
      input.id = 'facebook'

      if (input.inputmask)
        input.inputmask.remove()
      break;
    case 'Другое':
      input.type = 'text'
      input.name = 'other'
      input.id = 'other'

      if (input.inputmask)
        input.inputmask.remove()
      break;
  }
}

// Функция открытия модального окна "Изменить данные клиента"

function openModalEdit(element, item) {
  const modal = document.createElement('div')
  modal.classList.add('modal-edit')
  modal.id = "edit"

  modal.insertAdjacentHTML('afterbegin', `
    <div class="modal__container modal-edit__container">
        <div class="modal__content modal-edit__content">
          <button class="btn-close modal-edit__close"></button>
          <div class="modal-edit__block-top">
            <h2 class="title modal-edit__title">Изменить данные</h2>
            <span class="modal-edit__id">ID: ${item.id}</span>
          </div>
          <form class="modal__form modal-edit__form" action="#" method="POST">
            <div class="modal__block modal-edit__block">
              <input class="input modal__input modal-edit__input input--required" name="surname" type="text" id="surname" value="${item.surname}">
              <span class="modal__name modal-edit__name">Фамилия<span class="modal__icon modal-edit__icon">*</span></span>
              <span class="modal__error modal-edit__error"></span>
            </div>
            <div class="modal__block modal-edit__block">
              <input class="input modal__input modal-edit__input input--required" name="name" type="text" id="name" value="${item.name}">
              <span class="modal__name modal-edit__name">Имя<span class="modal__icon modal-edit__icon">*</span></span>
              <span class="modal__error modal-edit__error"></span>
            </div>
            <div class="modal__block modal-edit__block">
              <input class="input modal__input modal-edit__input" name="lastname" type="text" id="lastname" value="${item.lastName}">
              <span class="modal__name modal-edit__name">Отчество</span>
              <span class="modal__error modal-edit__error"></span>
            </div>
            <div class="modal__contacts modal-edit__contacts">
              <button class="modal__btn-contact modal-edit__btn-contact">Добавить контакт</button>
            </div>
            <button class="button modal__btn modal-edit__btn" type=""submit>
            <svg class="modal__spinner modal-edit__spinner" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
            </svg>
              Сохранить
            </button>
          </form>
          <button class="modal-edit__delete">Удалить контакт</button>
        </div>
      </div>
    `)

  main.after(modal)

  const blockContact = document.querySelector('.modal__contacts')
  const btnAddContact = modal.querySelector('.modal__btn-contact')
  const formEditClient = modal.querySelector('.modal-edit__form')
  const inputName = modal.querySelector('#name')
  const inputSurname = modal.querySelector('#surname')
  const inputLastName = modal.querySelector('#lastname')

  if (item.contacts.length === 10) {
    btnAddContact.classList.add('modal__btn-contact--disactive')
  }

  if (item.contacts.length > 0) {
    item.contacts.forEach(contact => {
      createFormContact(blockContact, contact.type, contact.value)
    })
  }

  const inputBlocks = modal.querySelectorAll('.modal__block')
  changeStyleBlockForm(inputBlocks)

  document.querySelector('.modal-edit__close').addEventListener('click', () => {
    closeModal(modal)
  })

  document.querySelector('.modal-edit__delete').addEventListener('click', () => {
    openModalDelete(element, item)
    closeModal(modal)
  })

  
  btnAddContact.addEventListener('click', (e) => {
    e.preventDefault()
    addBlockContact(modal, btnAddContact)
  })

  formEditClient.addEventListener('submit', async (e) => {
    e.preventDefault()

    const contactsBlock = modal.querySelectorAll('.modal__block-contact')
    const spinner = modal.querySelector('.modal__spinner')

    let clientObj = {}
    let contactArray = []

    if (contactsBlock.length >= 0) {
      contactsBlock.forEach(item => {
        contactArray.push({
          type: item.querySelector('.modal__btn-list').textContent,
          value: item.querySelector('.modal__input-contact').value
        })
      })
    }

    if (validationForm(inputBlocks, contactsBlock)) {
      clientObj.name = inputName.value.slice(0, 1).toUpperCase() + inputName.value.slice(1).toLowerCase()
      clientObj.surname = inputSurname.value.slice(0, 1).toUpperCase() + inputSurname.value.slice(1).toLowerCase()
      clientObj.lastName = inputLastName.value.slice(0, 1).toUpperCase() + inputLastName.value.slice(1).toLowerCase()
      clientObj.contacts = contactArray

      try {
        spinner.style.display = 'inline-block'
        const result = await editClient(clientObj, item.id)

        setTimeout(() => {
          element.remove()
          createTrTable(result)
          modal.remove()
        }, 1500)

      } catch (error) {
        console.log(error)
      } finally {

        setTimeout(() => {
          spinner.style.display = 'none'
        }, 1500)
      }

      console.log('ok')
    } else {
      console.log('false')
    }
  })
}
