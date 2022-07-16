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

  for (let type in ptypes) {
    const typeTab = document.createElement('p');
    typeTab.textContent = type.name;
    typesTab.appendChild(typeTab);
  }

  listElement.append(image, order, name, typesTab);
}

export { pokemonListElement };
