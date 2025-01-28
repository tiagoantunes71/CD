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

const weatherEmojiMap = {
    Clear: "☀️", 
    Clouds: "☁️", 
    Rain: "🌧️", 
    Drizzle: "🌦️",
    Thunderstorm: "⛈️", 
    Mist: "🌫️", 
    Smoke: "💨", 
    Haze: "🌤️", 
    Dust: "🌪️", 
    Fog: "🌫️", 
    Sand: "🏜️", 
    Ash: "🌋", 
    Squall: "💨", 
    Tornado: "🌪️"
};

// Função para procurar a temperatura e adicionar emoji correspondente
const fetchWeather = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}&lang=pt`
        );
        const data = await response.json();

        if (data.weather && data.weather.length > 0 && data.main) {
            const weatherCondition = data.weather[0].main; // Condição principal (ex: Clear, Rain)
            const emoji = weatherEmojiMap[weatherCondition] || "🌍"; // Emoji correspondente ou padrão
            return `${emoji} ${data.main.temp}°C, ${data.weather[0].description}`;
        } else {
            throw new Error("Não foi possível obter a condição climática.");
        }
    } catch (error) {
        console.error("Erro ao procurar informações sobre o clima:", error);
        return "Dados indisponíveis.";
    }
};

// Função para procurar imagens do Foursquare
const fetchFoursquareImage = async (fsq_id) => {
    try {
        const response = await fetch(`https://api.foursquare.com/v3/places/${fsq_id}/photos`, {
            method: "GET",
            headers: {
                Authorization: process.env.FOURSQUARE_API_KEY,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao obter imagem do Foursquare para o ID ${fsq_id}`);
        }

        const photos = await response.json();
        
        // Verifica se há fotos disponíveis e constrói a URL correta
        if (photos.length > 0) {
            return `${photos[0].prefix}original${photos[0].suffix}`;
        } else {
            return null; // Retorna null se não houver fotos
        }
    } catch (error) {
        console.error("Erro ao procurar imagem do Foursquare:", error);
        return null; // Retorna null em caso de erro
    }
};

// Endpoint para procurar atrações e clima
app.get("/atracoes", async (req, res) => {
    try {
        let city, ip, lat, lon;
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        ip = ipData.ip;

        // Caso o utilizador forneça uma cidade
        if (req.query.cidade) {
            const cityName = req.query.cidade;
            const geoResponse = await fetch(
                `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
            );
            const geoData = await geoResponse.json();

            if (!geoData.length) {
                return res.status(400).json({ error: "Cidade não encontrada" });
            }

            city = geoData[0].name;
            lat = geoData[0].lat;
            lon = geoData[0].lon;
        } else {
            // Usar IP do utilizador caso nenhuma cidade seja fornecida
            const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
            const geoData = await geoResponse.json();

            if (geoData.status !== "success") {
                return res.status(400).json({ error: "Não foi possível obter a localização" });
            }

            city = geoData.city;
            lat = geoData.lat;
            lon = geoData.lon;
        }

        // Procurar clima com emoji
        const temperature = await fetchWeather(lat, lon);

        // Procurar atrações próximas com a API Foursquare
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
            throw new Error("Erro ao procurar atrações na API do Foursquare");
        }

        const placesData = await placesResponse.json();

        // Filtrar e mapear as atrações com imagens válidas
        const attractions = await Promise.all(
            placesData.results.map(async (place) => {
                const photoUrl = await fetchFoursquareImage(place.fsq_id);
                // Verifica se a atração tem imagem
                if (photoUrl) {
                    return {
                        name: place.name || "Atração sem nome",
                        address: place.location?.formatted_address || "Morada não disponível",
                        photo: photoUrl
                    };
                }
                return null; // Retorna null se não tiver foto
            })
        );

        // Filtra as atrações para remover os itens sem imagem (null)
        const validAttractions = attractions.filter(attraction => attraction !== null);

        // Salvar no Supabase
        const { error } = await supabase
            .from("atracoes")
            .insert([{ ip, city, latitude: lat, longitude: lon, atracoes: validAttractions }]);

        if (error) {
            console.error("Erro ao salvar no Supabase:", error.message);
            return res.status(500).json({ error: "Erro ao salvar no banco de dados" });
        }

        res.json({ city, latitude: lat, longitude: lon, atracoes: validAttractions, temperatura: temperature });

    } catch (error) {
        console.error("Erro no servidor:", error.message);
        res.status(500).json({ error: "Erro ao processar a requisição" });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor hospedado na porta ${PORT}`);
});
