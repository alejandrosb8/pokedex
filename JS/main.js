//import { pokemonListElement } from './UI';
let pokemonArrayList = [];
let urls = [];

const pokemonList = document.getElementById('pokemonList');
const searchForm = document.getElementById('searchForm');
const searchBar = document.getElementById('searchBar');
const blacker = document.getElementById('blacker');

window.addEventListener('load', (e) => {
  blacker.classList.add('blacker-active');
  urls = [];
  pokemonArrayList = [];
  pokemonList.innerHTML = '';
  //fetch all pokemon data
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/?limit=898&offset=0`)
    .then((response) => {
      const data = response.data;

      for (let pokemon of data.results) {
        urls.push(pokemon.url);
      }

      let requests = urls.map((url) => axios.get(url));

      //fetch data of a single pokemon and put it into an array
      Promise.all(requests).then((res) => {
        res.forEach((pokemon) => {
          let thisPokemon = pokemon.data;
          pokemonArrayList.push({
            name: thisPokemon.name,
            order: thisPokemon.id,
            sprite: thisPokemon.sprites.other.home.front_default,
            types: thisPokemon.types,
          });
        });
        //sort the array in order to have a ordened array
        pokemonArrayList = pokemonArrayList.sort((a, b) => {
          return a.order - b.order;
        });

        //make html elements from each pokemon object from array
        pokemonArrayList.forEach((pokemon) => {
          pokemonList.appendChild(
            pokemonListElement(pokemon.name, pokemon.order, pokemon.sprite, pokemon.types)
          );
        });
        blacker.classList.remove('blacker-active');
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchPokemon(searchBar.value);
});

function searchPokemon(search) {
  pokemonList.innerHTML = '';

  let searchArray = pokemonArrayList.filter((x) => {
    return x.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
  });

  searchArray.forEach((pokemon) => {
    pokemonList.appendChild(
      pokemonListElement(pokemon.name, pokemon.order, pokemon.sprite, pokemon.types)
    );
  });
}

function pokemonListElement(pname, pnumber, psprite, ptypes) {
  const listElement = document.createElement('li');
  const linkElement = document.createElement('a');

  const image = document.createElement('img');
  image.classList.add('main__pokeImage;');
  image.src = psprite;
  image.alt = 'image of a pokemon';

  const order = document.createElement('p');
  order.classList.add('main__pokenumber');
  order.textContent = 'Nº ' + pnumber;

  const name = document.createElement('p');
  name.classList.add('main__pokename');
  name.textContent = capitalizeFirstLetter(pname);

  const typesTab = document.createElement('div');

  for (let types of ptypes) {
    let currentType = types.type.name;
    const typeTab = document.createElement('p');
    typeTab.textContent = capitalizeFirstLetter(currentType);

    typeTab.classList.add('background-color-' + currentType);

    typesTab.appendChild(typeTab);
  }

  linkElement.href = `./pokemon.html?id=${pnumber}`;

  linkElement.append(image, order, name, typesTab);
  listElement.appendChild(linkElement);
  return listElement;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
