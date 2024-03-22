FROM node
WORKDIR /
COPY . .
RUN npm install
RUN npm install pm2 typescript -g && tsc --build
CMD [ "pm2-runtime", "ecosystem.config.js" ]
