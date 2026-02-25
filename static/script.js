let pokemonData = [];
let abilitiesData = {};
let team = [];
let selectedPokemon = null;
let selectedAbility = null;

// Fetch JSONs from server
async function fetchData() {
    const pokeResp = await fetch('/static/pokemon.json');
    const abilResp = await fetch('/static/abilities.json');
    pokemonData = await pokeResp.json();
    abilitiesData = await abilResp.json();
    showRandomPokemon();
}

// Show 3 random Pokémon
function showRandomPokemon() {
    const optionsDiv = document.getElementById('pokemon-options');
    optionsDiv.innerHTML = '';
    const shuffled = [...pokemonData].sort(() => 0.5 - Math.random());
    shuffled.slice(0,3).forEach(poke => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <div>${poke.name}</div>
            <div class="types">${(poke.types || []).join(' / ')}</div>
        `;
        card.onclick = () => selectPokemon(poke);
        optionsDiv.appendChild(card);
    });
}

// When a Pokémon is selected
function selectPokemon(poke) {
    selectedPokemon = poke;
    showAbilities(poke);
}

// Show 3 random abilities
function showAbilities(poke) {
    const abilDiv = document.getElementById('ability-options');
    abilDiv.innerHTML = '';

    // Default to empty array if abilities missing
    const abilitiesList = Array.isArray(poke.abilities) ? poke.abilities : [];

    if(abilitiesList.length === 0){
        abilDiv.innerHTML = '<div>No abilities available</div>';
        document.getElementById('ability-selection').classList.remove('hidden');
        return;
    }

    const shuffled = [...abilitiesList].sort(() => 0.5 - Math.random());
    shuffled.slice(0,3).forEach(ab => {
        const card = document.createElement('div');
        card.className = 'ability-card';
        card.setAttribute('data-desc', abilitiesData[ab] || 'No description available');
        card.textContent = ab;
        card.onclick = () => selectAbility(ab, card);
        abilDiv.appendChild(card);
    });
    document.getElementById('ability-selection').classList.remove('hidden');
}

// Select an ability
function selectAbility(ab, card) {
    selectedAbility = ab;
    // Highlight selection
    document.querySelectorAll('.ability-card').forEach(c => c.style.background = '#e0e0e0');
    card.style.background = '#4CAF50';
}

// Confirm ability selection
document.getElementById('confirm-ability').onclick = () => {
    if(selectedPokemon && selectedAbility) {
        if(team.length < 6){
            team.push({pokemon: selectedPokemon, ability: selectedAbility});
            updateTeamPanel();
            selectedPokemon = null;
            selectedAbility = null;
            document.getElementById('ability-selection').classList.add('hidden');
            showRandomPokemon();
        }
    }
}

// Update team panel display
function updateTeamPanel() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach((slot, idx) => {
        slot.innerHTML = '';
        if(team[idx]){
            const poke = team[idx].pokemon;
            const abil = team[idx].ability;
            slot.innerHTML = `
                <div>${poke.name}</div>
                <div style="font-size:10px">${abil}</div>
            `;
        }
    });
}

// Reset button
document.getElementById('reset-btn').onclick = () => {
    team = [];
    selectedPokemon = null;
    selectedAbility = null;
    document.getElementById('ability-selection').classList.add('hidden');
    updateTeamPanel();
    showRandomPokemon();
}

fetchData();
