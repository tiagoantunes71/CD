
# City Explorer

Este projeto consistem em um website onde podemos obter informações sobre o clima e as atrações turisticas da ciade em que estamos ou outra cidade

## Tecnologias Utilizadas

Este projeto utiliza as seguintes tecnologias:

- JavaScript
- HTML
- CSS
- Docker
- Node.js
- Express.js

## Estrutura do Projeto

A estrutura básica do projeto é a seguinte:

```
CD/
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

2. **Navegue até o diretório do projeto:**

   ```bash
   cd CD
   ```

3. **Se estiver a utilizar Docker, construa a imagem:**

   ```bash
   docker build -t cityexplorer .
   ```

4. **Execute o container:**

   ```bash
   docker run -p 3000:3000 cityexplorer
   ```

   A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Uso

1. **Abrir o terminal**
2. **Execute o container:**

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
