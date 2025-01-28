# Usa uma imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho dentro do contentor
WORKDIR /app

# Copia os ficheiros do package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os ficheiros do projeto para dentro do contentor
COPY . .

# Expõe a porta definida no .env
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "script.js"]
