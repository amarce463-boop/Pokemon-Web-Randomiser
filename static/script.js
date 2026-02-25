async function getRandom() {
    const response = await fetch("/random");
    const data = await response.json();

    const pList = document.getElementById("pokemonList");
    pList.innerHTML = "";
    data.pokemon.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        pList.appendChild(li);
    });

    const aList = document.getElementById("abilityList");
    aList.innerHTML = "";
    data.abilities.forEach(a => {
        const li = document.createElement("li");
        li.textContent = a;
        aList.appendChild(li);
    });
}