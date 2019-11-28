FROM node:8

ENV PORT=80
ENV NOME_FILA=Colaboradores
ENV NOMETABELA=tabela_colaboradores

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD [ "node", "index.js" ]