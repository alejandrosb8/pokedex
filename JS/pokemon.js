const spriteFront = document.getElementById('spriteFront');
const spriteBehind = document.getElementById('spriteBehind');
const spriteFrontShiny = document.getElementById('spriteFrontShiny');
const spriteBehindShiny = document.getElementById('spriteBehindShiny');
const htmlName = document.getElementById('name');
const htmlPokedexNumber = document.getElementById('pokedexNumber');
const htmlTypes = document.getElementById('types');
const htmlAbilities = document.getElementById('abilities');
const htmlHiddenAbility = document.getElementById('hiddenAbilities');
const htmlWeight = document.getElementById('weight');
const htmlHeight = document.getElementById('height');
const htmlHP = document.getElementById('hp');
const htmlAttack = document.getElementById('attack');
const htmlDefense = document.getElementById('defense');
const htmlSpecialAttack = document.getElementById('special-attack');
const htmlSpecialDefense = document.getElementById('special-defense');
const htmlSpeed = document.getElementById('speed');
const htmlTotal = document.getElementById('total');
const htmllevelingList = document.getElementById('levelingList');
const htmltmList = document.getElementById('tmList');
const htmltutoringList = document.getElementById('tutoringList');
const htmlbreedingList = document.getElementById('breedingList');
const breedingDiv = document.getElementById('breedingDiv');
const htmlprev = document.getElementById('prev');
const htmlnext = document.getElementById('next');

window.addEventListener('load', (e) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const pokemonId = Number(urlParams.get('id'));

  let nextLink = pokemonId + 1 <= 898 ? pokemonId + 1 : 1;
  let prevLink = pokemonId - 1 >= 1 ? pokemonId - 1 : 898;

  htmlprev.href = `./pokemon.html?id=${prevLink}`;
  htmlnext.href = `./pokemon.html?id=${nextLink}`;

  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then((response) => {
      const data = response.data;

      //pokemon data
      title.textContent = capitalizeFirstLetter(data.name);
      spriteFront.src = data.sprites.front_default;
      spriteBehind.src = data.sprites.back_default;
      spriteFrontShiny.src = data.sprites.front_shiny;
      spriteBehindShiny.src = data.sprites.back_shiny;

      htmlName.textContent += capitalizeFirstLetter(data.name);

      htmlPokedexNumber.textContent += data.id;

      const htmlTypesContainer = document.createElement('div');
      htmlTypesContainer.classList.add('types__container');
      htmlTypes.appendChild(htmlTypesContainer);

      for (t of data.types) {
        let currentType = t.type.name;
        const htmltype = document.createElement('p');
        htmltype.classList.add(`background-color-${currentType}`);
        htmltype.textContent = capitalizeFirstLetter(currentType);
        htmlTypesContainer.appendChild(htmltype);
      }

      let abilities = data.abilities.filter((x) => !x.is_hidden);
      if (abilities.length > 1) {
        let abilityText =
          capitalizeFirstLetter(abilities[0].ability.name) +
          ', ' +
          capitalizeFirstLetter(abilities[1].ability.name);

        abilityText = abilityText.replace(/-/gi, ' ');

        htmlAbilities.textContent += abilityText;
      } else {
        let abilityText = capitalizeFirstLetter(abilities[0].ability.name);

        abilityText = abilityText.replace(/-/gi, ' ');

        htmlAbilities.textContent += abilityText;
      }

      let hiddenAbility = data.abilities.filter((x) => x.is_hidden);
      let hiddenAbilityText = hiddenAbility[0].ability.name;
      hiddenAbilityText = hiddenAbilityText.replace(/-/gi, ' ');
      htmlHiddenAbility.textContent += capitalizeFirstLetter(hiddenAbilityText);

      htmlHeight.textContent += data.height / 10 + 'm';
      htmlWeight.textContent += data.weight / 10 + 'kg';

      htmlHP.textContent += data.stats[0].base_stat;
      htmlAttack.textContent += data.stats[1].base_stat;
      htmlDefense.textContent += data.stats[2].base_stat;
      htmlSpecialAttack.textContent += data.stats[3].base_stat;
      htmlSpecialDefense.textContent += data.stats[4].base_stat;
      htmlSpeed.textContent += data.stats[5].base_stat;

      let arrayTotal = data.stats.map((x) => {
        return x.base_stat;
      });

      htmlTotal.textContent += arrayTotal.reduce((a, b) => {
        return a + b;
      });

      let movesArray = [];

      let moveLenght = data.moves.length;
      let count = 0;
      data.moves.forEach((m) => {
        let maxLenght = m.version_group_details.length;

        axios
          .get(m.move.url)
          .then((ress) => {
            let moveData = ress.data;
            movesArray.push({
              name: m.move.name,
              level: m.version_group_details[maxLenght - 1].level_learned_at,
              type: moveData.type.name,
              learn: m.version_group_details[maxLenght - 1].move_learn_method.name,
            });
            count += 1;
            if (count == moveLenght) {
              movesArray.sort((a, b) => {
                return a.level - b.level;
              });

              const levelingListArray = movesArray.filter((x) => x.learn == 'level-up');
              const tmListArray = movesArray.filter((x) => x.learn == 'machine');
              const tutoringListArray = movesArray.filter((x) => x.learn == 'tutor');
              const breedingListArray = movesArray.filter((x) => x.learn == 'egg');

              levelingListArray.forEach((element) => {
                htmllevelingList.appendChild(
                  createMoveListElement(element.name, element.level, element.type, element.learn)
                );
              });
              tmListArray.forEach((element) => {
                htmltmList.appendChild(
                  createMoveListElement(element.name, element.level, element.type, element.learn)
                );
              });
              tutoringListArray.forEach((element) => {
                htmltutoringList.appendChild(
                  createMoveListElement(element.name, element.level, element.type, element.learn)
                );
              });
              if (breedingListArray.length > 0) {
                breedingListArray.forEach((element) => {
                  htmlbreedingList.appendChild(
                    createMoveListElement(element.name, element.level, element.type, element.learn)
                  );
                });
              } else {
                breedingDiv.classList.add('breeding-disable');
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });

        movesArray.forEach((element) => {
          console.log(element.name);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

function createMoveListElement(mName, mLevel, mType, mMethod) {
  const hmoveElement = document.createElement('li');

  const hname = document.createElement('p');
  hname.classList.add('move-name');
  hname.textContent = capitalizeFirstLetter(mName);

  const htype = document.createElement('p');
  htype.classList.add('move-type');
  htype.classList.add(`background-color-${mType}`);
  htype.textContent = mType;

  hmoveElement.append(hname, htype);

  if (mMethod == 'level-up') {
    const hlevel = document.createElement('p');
    hlevel.classList.add('level-learn');
    hlevel.textContent = mLevel;
    hmoveElement.appendChild(hlevel);
  }

  return hmoveElement;
}

function capitalizeFirstLetter(string) {
  let thisString = string.replace(/-/gi, ' ');
  const words = thisString.split(' ');

  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(' ');
}
