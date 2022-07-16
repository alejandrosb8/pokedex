//import { pokemonListElement } from './UI';

const pokemonList = document.getElementById('pokemonList');

window.addEventListener('load', (e) => {
  //getApi('?limit=100000&offset=0');
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0`)
    .then((response) => {
      const data = response.data;

      for (let p of data.results) {
        axios
          .get(p.url)
          .then((pResponse) => {
            const pdata = pResponse.data;
            console.log(pdata);
            pokemonList.appendChild(
              pokemonListElement(pdata.name, pdata.order, pdata.sprites.front_default, pdata.types)
            );
          })
          .catch((pError) => {
            console.log(pError);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function getApi(search) {
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${search}`)
    .then((response) => {
      const data = response.data;
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function pokemonListElement(pname, pnumber, psprite, ptypes) {
  const listElement = document.createElement('li');

  const image = document.createElement('img');
  image.classList.add('main__pokeImage;');
  image.src = psprite;

  const order = document.createElement('p');
  order.classList.add('main__pokenumber');
  order.textContent = 'Nº ' + pnumber;

  const name = document.createElement('p');
  order.classList.add('main__pokename');
  name.textContent = pname;

  const typesTab = document.createElement('div');

  for (let type of ptypes) {
    const typeTab = document.createElement('p');
    typeTab.textContent = type.name;
    typesTab.appendChild(typeTab);
  }

  listElement.append(image, order, name, typesTab);
}
