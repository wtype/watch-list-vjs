const form = document.querySelector('form');
const input = document.querySelector('form input');
const resultsElement = document.querySelector('#results');
const watch = document.querySelector('#watch');
const watchList = document.querySelector('#watchList');
const close = document.querySelector('#close');
const movies = document.querySelector('#movies');

const API_KEY = ''; // API KEY FROM OMDB
const API = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=`;

function getMovieTemplate(movie, button = true) {
  if (button) {
    return `
    <div class="movie">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <span>${movie.Year}</span>
      <button data-id="${movie.imdbID}" type="button">Watch Later</button>
    </div>
  `;
  }
  return `
    <div class="movie">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <span>${movie.Year}</span>
    </div>
  `;
}

function showResults(results) {
  resultsElement.innerHTML = results.reduce(
    (html, movie) => html + getMovieTemplate(movie),
    ''
  );

  const watchLaterButtons = document.querySelectorAll('.movie button');
  watchLaterButtons.forEach(button => {
    button.addEventListener('click', e => {
      const { id } = button.dataset;
      const movie = results.find(movie => movie.imdbID === id);
      movies.innerHTML += getMovieTemplate(movie, false);
    });
  });
}

async function getResults(searchTerm) {
  const url = `${API}${searchTerm}`;

  const response = await fetch(url);
  const data = await response.json();
  if (data.Error) throw new Error(data.Error);
  return data.Search;
}

async function formSubmitted(e) {
  e.preventDefault();
  const searchTerm = input.value;
  try {
    const results = await getResults(searchTerm);
    showResults(results);
  } catch (error) {
    resultsElement.innerText = 'No Results Found';
  }
}

function openList(e) {
  watchList.classList.toggle('hidden');
}

form.addEventListener('submit', formSubmitted);
watch.addEventListener('click', openList);
close.addEventListener('click', openList);
