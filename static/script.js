let pokemonData = [];
let abilitiesData = {};
let team = [];

let selectedPokemon = null;
let selectedAbility = null;

let allowDuplicatePokemon = false;
let allowDuplicateAbilities = false;
let allowAdultPokemon = true;

// Fetch JSONs
async function fetchData() {
    const pokeResp = await fetch('/static/pokemon.json');
    const abilResp = await fetch('/static/abilities.json');

    pokemonData = await pokeResp.json();
    abilitiesData = await abilResp.json();

    showRandomPokemon();
}

function showRandomPokemon() {
    const optionsDiv = document.getElementById('pokemon-options');
    optionsDiv.innerHTML = '';

    let pool = [...pokemonData];

    /* ---- ADULT FILTER ---- */
    if (!allowAdultPokemon) {
        pool = pool.filter(p => !p.isNfe); 
    }

    /* ---- DUPLICATE POKEMON FILTER ---- */
    if (!allowDuplicatePokemon) {
        const used = team.map(t => t.pokemon.name);
        pool = pool.filter(p => !used.includes(p.name));
    }

    const shuffled = pool.sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 3);

    picks.forEach(poke => {
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

function selectPokemon(poke) {
    selectedPokemon = poke;
    showAbilities();
}

function showAbilities() {
    const abilDiv = document.getElementById('ability-options');
    abilDiv.innerHTML = '';

    let pool = Object.keys(abilitiesData);

    /* ---- DUPLICATE ABILITY FILTER ---- */
    if (!allowDuplicateAbilities) {
        const used = team.map(t => t.ability);
        pool = pool.filter(a => !used.includes(a));
    }

    const shuffled = pool.sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 3);

    picks.forEach(ab => {
        const card = document.createElement('div');
        card.className = 'ability-card';
        card.textContent = ab;
        card.setAttribute("data-desc", abilitiesData[ab] || "");

        card.onclick = () => {
            selectedAbility = ab;

            document.querySelectorAll('.ability-card').forEach(c => {
                c.style.background = '#e0e0e0';
            });

            card.style.background = '#4CAF50';
        };

        abilDiv.appendChild(card);
    });

    document.getElementById('ability-selection').classList.remove('hidden');
}

document.getElementById('confirm-ability').onclick = () => {
    if (!selectedPokemon || !selectedAbility) return;

    if (team.length >= 6) return;

    team.push({
        pokemon: selectedPokemon,
        ability: selectedAbility
    });

    updateTeamPanel();

    selectedPokemon = null;
    selectedAbility = null;

    document.getElementById('ability-selection').classList.add('hidden');

    showRandomPokemon();
};

function updateTeamPanel() {
    const slots = document.querySelectorAll('.slot');

    slots.forEach((slot, i) => {
        slot.innerHTML = '';

        if (team[i]) {
            slot.innerHTML = `
                <div>${team[i].pokemon.name}</div>
                <div style="font-size:11px">${team[i].ability}</div>
            `;
        }
    });
}

document.getElementById('reset-btn').onclick = () => {
    team = [];
    updateTeamPanel();
    showRandomPokemon();
};

/* ---------- TOGGLES ---------- */

document.getElementById('toggle-duplicates-pokemon').onchange = e => {
    allowDuplicatePokemon = e.target.checked;
};

document.getElementById('toggle-duplicates-abilities').onchange = e => {
    allowDuplicateAbilities = e.target.checked;
};

document.getElementById('toggle-adult-pokemon').onchange = e => {
    allowAdultPokemon = e.target.checked;
};

fetchData();
