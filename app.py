from flask import Flask, jsonify, render_template
import json
import random

app = Flask(__name__)

# -------------------------
# Load JSON data
# -------------------------

with open("all.json", encoding="utf-8") as f:
    POKEDEX = json.load(f)

with open("abilities.json", encoding="utf-8") as f:
    ABILITY_DATA = json.load(f)

ABILITY_NAMES = list(ABILITY_DATA.keys())


# -------------------------
# Routes
# -------------------------

@app.route("/")
def home():
    return render_template("index.html")


# Return 3 random Pokémon
@app.route("/random_pokemon")
def random_pokemon():
    picks = random.sample(POKEDEX, 3)

    results = []
    for p in picks:
        results.append({
            "name": p["name"],
            "types": p.get("types", []),
            "sprite": p.get("sprite", "")
        })

    return jsonify(results)


# Return 3 random abilities WITH descriptions
@app.route("/random_abilities")
def random_abilities():
    picks = random.sample(ABILITY_NAMES, 3)

    results = []
    for ability in picks:
        results.append({
            "name": ability,
            "description": ABILITY_DATA.get(ability, "No description found.")
        })

    return jsonify(results)


# -------------------------
# Run server
# -------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)