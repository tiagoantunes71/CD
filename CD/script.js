import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();




const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Configuração do Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Endpoint principal para buscar atrações
app.get('/atracoes', async (req, res) => {
    try {
        // Obtém o IP do usuário
        const ipResponse = await fetch('https://api64.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        
        // Obtém a localização do usuário
        const geoResponse = await fetch(`http://ip-api.com/json/${userIP}`);
        const geoData = await geoResponse.json();
        if (geoData.status !== "success") {
            return res.status(400).json({ error: 'Não foi possível obter a localização' });
        }
        
        const { lat, lon, city, country } = geoData;
        
        // Obtém atrações turísticas próximas via Foursquare
        const placesResponse = await fetch(`https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=5000&categories=16000`, {
            method: 'GET',
            headers: {
                'Authorization': process.env.FOURSQUARE_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        const placesData = await placesResponse.json();
        const attractions = placesData.results.map(place => place.name).filter(name => name);
        
        // Salva os dados no Supabase
        const { data, error } = await supabase
            .from('atracoes')
            .insert([{ ip: userIP, latitude: lat, longitude: lon, atracoes: attractions, timestamp: new Date() }]);
        
        if (error) {
            return res.status(500).json({ error: 'Erro ao salvar no Supabase', details: error });
        }
        
        res.json({ city, country, attractions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar a requisição' });
    }

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
