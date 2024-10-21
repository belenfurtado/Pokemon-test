import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import random

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)

# CORS middleware to allow requests from Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify the origin of your Angular app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon"
MAX_POKEMON_ID = 50  # Restrict to the first 50 Pokémon

@app.get("/pokemon/random")
async def get_random_pokemon():
    try:
        async with httpx.AsyncClient() as client:
            # Obtener la lista de Pokémon (limitada a los primeros 150 por simplicidad)
            response = await client.get("https://pokeapi.co/api/v2/pokemon?limit=150")
            response.raise_for_status()  # Lanza error para respuestas malas (4xx y 5xx)
            data = response.json()

            # Seleccionar un Pokémon aleatorio
            pokemon = random.choice(data['results'])

            # Obtener detalles del Pokémon seleccionado
            pokemon_response = await client.get(pokemon['url'])
            pokemon_response.raise_for_status()
            pokemon_data = pokemon_response.json()

            # Obtener la URL de la imagen de alta resolución
            pokemon_image_url = pokemon_data['sprites']['other']['official-artwork']['front_default']

            # Generar los nombres falsos sin repetir el nombre original
            possible_options = [p['name'] for p in data['results'] if p['name'] != pokemon['name']]
            decoy_options = random.sample(possible_options, 3)

            # Mezclar las opciones
            options = decoy_options + [pokemon['name']]
            random.shuffle(options)

            return {
                "name": pokemon['name'],
                "sprites": {
                    "official_artwork": pokemon_image_url
                },
                "options": options
            }

    except httpx.HTTPStatusError as e:
        logging.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        return JSONResponse(status_code=e.response.status_code, content={"message": "Error fetching data from PokéAPI"})

    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "Error fetching data from PokéAPI"})

@app.post("/pokemon/verify")
async def verify_pokemon(pokemon_id: int, guessed_name: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{POKEMON_API_URL}/{pokemon_id}")
        pokemon_data = response.json()

    true_name = pokemon_data['name']
    full_image = pokemon_data['sprites']['front_default']  # Full Pokémon image

    is_correct = guessed_name.lower() == true_name.lower()

    return {
        "is_correct": is_correct,
        "correct_name": true_name,
        "full_image": full_image
    }