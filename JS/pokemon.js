const spriteFront = document.getElementById('spriteFront');
const spriteBehind = document.getElementById('spriteBehind');
const spriteFrontShiny = document.getElementById('spriteFrontShiny');
const spriteBehindShiny = document.getElementById('spriteBehindShiny');
const htmlName = document.getElementById('name');
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

window.addEventListener('load', (e) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const pokemonId = urlParams.get('id');

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
    })
    .catch((err) => {
      console.log(err);
    });
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
