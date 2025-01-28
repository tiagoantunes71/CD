
# City Explorer

Este projeto consistem em um website onde podemos obter informações sobre o clima e as atrações turisticas da ciade em que estamos ou outra cidade

## Tecnologias Utilizadas

Este projeto utiliza as seguintes tecnologias:

- JavaScript
- HTML
- Bootstrap
- CSS
- Docker
- Node.js
- Express.js

## Estrutura do Projeto

A estrutura básica do projeto é a seguinte:

```
├── index.html
├── styles.css
├── script.js
├── .dockerignore
├── .env
├── Dockerfile
├── docker-compose.yml
├── package-lock.json
├── package.json
├── /node_modules
└── README.md
```

- **index.html**: Ficheiro principal HTML que serve de entrada para a aplicação.
- **styles.css**: Folha de estilos CSS para estilização da aplicação.
- **script.js**: Ficheiro JavaScript contendo a lógica da aplicação.
- **Dockerfile**: Ficheiro de configuração para criação da imagem Docker da aplicação.
- **.env**: Keys das APIs

## Pré-requisitos
- Docker instalado e pronto a ser utilizado.
- Chaves API para:
    - **FOURSQUARE**: Permite encontrar atrações turisticas perto da localizaçao escolhida pelo utilizador [aqui](https://location.foursquare.com/developer/).
    - **IP-API**: Permite obter a localização do utilizador [aqui](https://members.ip-api.com/)
    - **OpenWeather**: Permite obter as imfromações meteorológicas sobre a cidade escolhida pelo utilizador [aqui](https://openweathermap.org/).
    - **Unsplash**: Permite obter imagens das atrações turisticas [aqui](https://unsplash.com/developers).
- Uma conta supabase para utilização da base de dados. Crie uma conta [aqui](https://supabase.com/).
  
## Instalação

Para configurar o ambiente de desenvolvimento, siga os passos abaixo:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/tiagoantunes71/CD.git
   ```

2. **Se estiver a utilizar Docker, construa a imagem:**

   ```bash
   docker build -t cityexplorer .
   ```

2. **Caso queira usar a imagem do repositório original:**

   ```bash
   docker pull marcogomes05/city-explorer .
   ```

3. **Execute o contentor:**

   ```bash
   docker run -p 3000:3000 city-explorer
   ```

   A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Uso

1. **Abrir o terminal**
2. **Execute o contentor:**

   ```bash
   docker run -p 3000:3000 cityexplorer
   ``
3. **Abrir a pagina *index.html* com live server**
4. Caso queira saber o clima e as atrações turisticas na sua localização pressione em *Use my location*, caso queira pesquisar outra cidade bas ta escrever na barra de pesquisa e clicar no botão *search* 

## Supabase

Criação da tabela *atracoes* com as colunas id, ip, latitude, longitude, atracoes, timestamp e city.
  - **id**: Ordem de execução
  - **ip**: ip do utilizador.
  - **latitude**: Latitude do utilizador
  - **longitude**: Longitude do utilizador
  - **atracoes**: Atrações turisticas perto da cidade do utilizador
  - **timestamp**: Data e hora de acesso do utilizador.
  - **city**: Cidade escolhida pelo utilizador.


A API retornará uma resposta JSON no seguinte formato:
```json
{
    "city": "Vila Nova de Famalicão",
    "latitude": 41.4065175,
    "longitude": -8.5187481,
    "atracoes": [
        {
            "name": "Parque da Devesa",
            "address": "Alameda Doutor Francisco Sá Carneiro, 4760-286 Vila Nova de Famalicão",
            "photo": "https://fastly.4sqi.net/img/general/original/1390919135_0qP_htH80ntEkzlh0c53rI5iPE_K0RgYH6MnqIulPyM.jpg"
        },
        {
            "name": "Parque Sagres",
            "address": "Rua Luís Barroso, Vila Nova de Famalicão",
            "photo": "https://fastly.4sqi.net/img/general/original/89551307_Me-9pnF3APqDSP63yTCCbyqw6Ml5PoV9_RsH_s7-QrU.jpg"
        },
        {
            "name": "Parque 1° de Maio",
            "address": "Morada não disponível",
            "photo": "https://fastly.4sqi.net/img/general/original/40889435_5cx1_GjUYlTYRRmEg_8BmKTnFgwdUCaKH_Vc_O53AJY.jpg"
        },
        {
            "name": "Parque de Sinçães",
            "address": "Avenida Carlos Bacelar, Vila Nova de Famalicão",
            "photo": "https://fastly.4sqi.net/img/general/original/81939712_JNEq9LoVBkGgCa2rlEAVR5Oghm2rtEJtJAPd2m7g4WU.jpg"
        },
        {
            "name": "ciclovia Vnf",
            "address": "Morada não disponível",
            "photo": "https://fastly.4sqi.net/img/general/original/2190146_TDFXzTrAv_U7xAXo98QpWR6kwQiL6rBeTj8Tiu59jtE.jpg"
        },
        {
            "name": "Quinta da Praia",
            "address": "Morada não disponível",
            "photo": "https://fastly.4sqi.net/img/general/original/42641717_9qxqLH_2cyChKqviZmaZLiSSgJU4afQW0LvXHJyIVtw.jpg"
        },
        {
            "name": "Monte do Facho",
            "address": "Vila Nova de Famalicão",
            "photo": "https://fastly.4sqi.net/img/general/original/23115477_LfbER_nWU0P4VnOJ9EWeot0EAZn2rMzN7gjyKjZe2Fc.jpg"
        }
    ],
    "temperatura": "🌧️ 10.2°C, chuva fraca"
}
