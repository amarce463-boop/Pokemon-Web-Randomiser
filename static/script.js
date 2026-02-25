const pokemonContainer = document.getElementById("pokemonContainer");
const abilityList = document.getElementById("abilityList");
const rollButton = document.getElementById("rollButton");

// Roll Pokémon and show cards
async function rollPokemon() {
    const response = await fetch("/random_pokemon");
    const data = await response.json();

    pokemonContainer.innerHTML = ""; // Clear old cards

    data.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${p.sprite || ''}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.types.join(" / ")}</p>
            <button onclick="rollAbilities()">Select</button>
        `;

        pokemonContainer.appendChild(card);
    });

    abilityList.innerHTML = ""; // Clear abilities
}

// Roll 3 random abilities
async function rollAbilities() {
    const response = await fetch("/random_abilities");
    const data = await response.json();

    abilityList.innerHTML = "";

    data.forEach(a => {
        const li = document.createElement("li");
        li.textContent = a.name;
        li.setAttribute("data-desc", a.description);
        abilityList.appendChild(li);
    });
}

// Event listener for roll button
rollButton.addEventListener("click", rollPokemon);

// Initialize
rollPokemon();
