FROM node:8

ARG aws_access_key_id
ARG aws_secret_access_key

ENV PORT=80
ENV NOME_FILA=Colaboradores
ENV NOMETABELA=tabela_colaboradores

ENV AWS_ACCESS_KEY_ID $aws_access_key_id
ENV AWS_SECRET_ACCESS_KEY $aws_secret_access_key
ENV AWS_REGION=us-east-2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 81

CMD [ "node", "index.js" ]