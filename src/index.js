import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const unorderedList = document.querySelector('.country-list');
const divContainerEl = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputFn, DEBOUNCE_DELAY));

function onInputFn(event) {
  const searchValue = event.target.value.trim();
  if (!searchValue) {
    unorderedList.innerHTML = '';
    divContainerEl.innerHTML = '';
    return;
  }
  fetchCountries(searchValue)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found! Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        const markupPreview = renderPreview(data);
        unorderedList.innerHTML = markupPreview;
        divContainerEl.innerHTML = '';
      } else {
        const markupCard = renderCountryCard(data);
        divContainerEl.innerHTML = markupCard;
        unorderedList.innerHTML = '';
      }
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name.');
      unorderedList.innerHTML = '';
      divContainerEl.innerHTML = '';
    });
}

function renderPreview(data) {
  return data
    .map(({ name, flags }) => {
      return `<li><img src="${flags.png}" alt="${name.official}"  ><p>${name.official}</p></li>`;
    })
    .join('');
}

function renderCountryCard(data) {
  return data
    .map(({ name, capital, population, flags, languages }) => {
      return `
      <li><img src="${flags.png}" alt="${name.official}"><span>${
        name.official
      }</span>
      <p><b>Capital:</b> ${capital}</p> <p><b>Population</b>: ${population}</p><p><b>Languages:</b> ${Object.values(
        languages
      )}</p> 
        </li>`;
    })
    .join('');
}
