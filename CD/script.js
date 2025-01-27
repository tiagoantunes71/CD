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

// Configuração do Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Função auxiliar para buscar imagens da Unsplash
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

// Endpoint para buscar atrações
app.get("/atracoes", async (req, res) => {
    try {
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        const geoResponse = await fetch(`http://ip-api.com/json/${userIP}`);
        const geoData = await geoResponse.json();
        if (geoData.status !== "success") {
            return res.status(400).json({ error: "Não foi possível obter a localização" });
        }

        const { lat, lon, city, country } = geoData;

        // Busca atrações da API Foursquare
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

        // Processa as atrações e busca imagens
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

        res.json({ city, country, attractions });
    } catch (error) {
        console.error("Erro:", error.message);
        res.status(500).json({ error: "Erro ao processar a requisição" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
