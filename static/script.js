let pokemonData = [];
let abilitiesData = {};
let team = [];
let selectedPokemon = null;
let selectedAbility = null;
let allowDuplicatePokemon = false;   // toggle for duplicate Pokémon
let allowDuplicateAbilities = false; // toggle for duplicate abilities
let allowAdultPokemon = true;        // toggle adult Pokémon on/off
let enforceAdultOnStartup = true;    // force adult Pokémon initially

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

    let pool = [...pokemonData];

    // Only adult Pokémon if enforced
    if(enforceAdultOnStartup || !allowAdultPokemon){
        pool = pool.filter(p => p.adult === true);
    }

    // Remove Pokémon already in team if duplicates not allowed
    if(!allowDuplicatePokemon){
        const namesInTeam = team.map(t => t.pokemon.name);
        pool = pool.filter(p => !namesInTeam.includes(p.name));
    }

    const shuffled = pool.sort(() => 0.5 - Math.random());
    shuffled.slice(0,3).forEach(poke => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <div>${poke.name}</div>
            <div class="types">${poke.types.join(' / ')}</div>
        `;
        card.onclick = () => selectPokemon(poke);
        optionsDiv.appendChild(card);
    });
}

// When a Pokémon is selected
function selectPokemon(poke) {
    selectedPokemon = poke;
    showAbilities(poke);

    // Disable all Pokémon cards
    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.style.pointerEvents = 'none'; // disables click
        card.style.opacity = '0.6';       // visually show disabled
    });
}

// Show 3 random abilities
function showAbilities(poke) {
    const abilDiv = document.getElementById('ability-options');
    abilDiv.innerHTML = '';

    // Get all ability names from abilitiesData
    const allAbilities = Object.keys(abilitiesData);

    // Shuffle and pick 3 random abilities
    const shuffled = [...allAbilities].sort(() => 0.5 - Math.random());
    const randomAbilities = shuffled.slice(0, 3);

    randomAbilities.forEach(ab => {
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
#document.getElementById('confirm-ability').onclick = () => {
    if(selectedPokemon && selectedAbility){
        if(team.length < 6){
            team.push({pokemon: selectedPokemon, ability: selectedAbility});
            updateTeamPanel();

            // Reset selections
            selectedPokemon = null;
            selectedAbility = null;
            document.getElementById('ability-selection').classList.add('hidden');

            // Re-enable Pokémon cards
            document.querySelectorAll('.pokemon-card').forEach(card => {
                card.style.pointerEvents = 'auto';
                card.style.opacity = '1';
            });

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

document.getElementById('toggle-duplicates-pokemon').onchange = (e) => {
    allowDuplicatePokemon = e.target.checked;
};

document.getElementById('toggle-duplicates-abilities').onchange = (e) => {
    allowDuplicateAbilities = e.target.checked;
};

document.getElementById('toggle-adult-pokemon').onchange = (e) => {
    allowAdultPokemon = e.target.checked;
};

fetchData();





