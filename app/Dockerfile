# Imagem de Origem
FROM node:13-alpine
# Diretório de trabalho(é onde a aplicação ficará dentro do container).
ADD . /code
WORKDIR /code
# Adicionando `/app/node_modules/.bin` para o $PATH
ENV PATH /code/node_modules/.bin:$PATH
# Instalando dependências da aplicação e armazenando em cache.
COPY package.json /code/package.json
RUN npm install --silent
RUN npm i --save date-fns@next @date-io/date-fns@1.x
# start app
EXPOSE 3000
CMD ["npm", "start"]