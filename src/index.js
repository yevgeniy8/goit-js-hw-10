import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listCountryEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputClick, DEBOUNCE_DELAY));

function onInputClick(evt) {
  const inputValue = evt.target.value.trim();

  if (!inputValue) {
    listCountryEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(drawAPI)
    .catch(error => console.error(error));
}

function drawAPI(data) {
  if (data.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    listCountryEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  if (data.length === 1) {
    countryInfoEl.innerHTML = countriesMarkupOne(data);
    listCountryEl.innerHTML = '';
    return;
  }

  if (data.length > 1) {
    listCountryEl.innerHTML = countriesMarkupMore(data);
    countryInfoEl.innerHTML = '';
    return;
  }
}

function countriesMarkupOne(countries) {
  return countries
    .map(
      country => `<div class = "country">
	  <img src="${country.flags.svg}" alt="${
        country.name.official
      }" width="50" height="30">
				<h2>${country.name.official}</h2></div>
				<p><b>Capital: </b>${country.capital}</p>
				<p><b>Population: </b>${country.population}</p>
				<p><b>Languages: </b>${Object.values(country.languages)}</p>`
    )
    .join('');
}

function countriesMarkupMore(countries) {
  return countries
    .map(
      country =>
        `<li class = "country">
			<img src="${country.flags.svg}" alt="${country.name.official}" width="50" height="30">
			<p>${country.name.official}</p>
		</li>`
    )
    .join('');
}
