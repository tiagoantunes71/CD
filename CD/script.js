import express from "express";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const fetchUnsplashImage = async (query) => {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        );
        const data = await response.json();
        return data.results?.[0]?.urls?.regular || "https://via.placeholder.com/150";
    } catch (error) {
        console.error("Erro ao buscar imagem no Unsplash:", error);
        return "https://via.placeholder.com/150";
    }
};

// Função atualizada para utilizar a OpenWeather API
const fetchWeather = async (lat, lon) => {
    try {
        // Usando a OpenWeather API para obter o clima
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}&lang=pt`);
        const data = await response.json();

        if (data.main && data.main.temp !== undefined) {
            return `${data.main.temp}°C`;
        } else {
            throw new Error("Temperatura não encontrada");
        }
    } catch (error) {
        console.error("Erro ao buscar temperatura:", error);
        return "Dados indisponíveis";
    }
};

app.get("/atracoes", async (req, res) => {
    try {
        let city, country, lat, lon;

        // Se o usuário passar uma cidade como parâmetro na URL
        if (req.query.cidade) {
            const cityName = req.query.cidade;
            const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`);
            const geoData = await geoResponse.json();

            if (!geoData.length) {
                return res.status(400).json({ error: "Cidade não encontrada" });
            }

            city = geoData[0].name;
            country = geoData[0].country;
            lat = geoData[0].lat;
            lon = geoData[0].lon;
        } else {
            // Se não houver cidade informada, usar IP do usuário
            const ipResponse = await fetch("https://api64.ipify.org?format=json");
            const ipData = await ipResponse.json();
            const userIP = ipData.ip;

            const geoResponse = await fetch(`http://ip-api.com/json/${userIP}`);
            const geoData = await geoResponse.json();
            if (geoData.status !== "success") {
                return res.status(400).json({ error: "Não foi possível obter a localização" });
            }

            city = geoData.city;
            country = geoData.country;
            lat = geoData.lat;
            lon = geoData.lon;
        }

        // Buscar temperatura
        const temperature = await fetchWeather(lat, lon);

        // Buscar atrações do Foursquare
        const placesResponse = await fetch(
            `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=5000&categories=16000`,
            {
                method: "GET",
                headers: {
                    Authorization: process.env.FOURSQUARE_API_KEY,
                    Accept: "application/json",
                },
            }
        );

        if (!placesResponse.ok) {
            throw new Error("Erro ao buscar atrações na API do Foursquare");
        }

        const placesData = await placesResponse.json();

        const attractions = await Promise.all(
            placesData.results.map(async (place) => {
                const photoUrl = await fetchUnsplashImage(place.name);
                return {
                    name: place.name || "Atração sem nome",
                    address: place.location?.formatted_address || "Endereço não disponível",
                    photo: photoUrl,
                    id: place.fsq_id,
                };
            })
        );

        res.json({ city, country, temperature, attractions });
    } catch (error) {
        console.error("Erro:", error.message);
        res.status(500).json({ error: "Erro ao processar a requisição" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
