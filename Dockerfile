FROM node:8

ENV PORT=81
ENV NOME_FILA=Colaboradores
ENV NOMETABELA=tabela_colaboradores

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 81

CMD [ "node", "index.js" ]