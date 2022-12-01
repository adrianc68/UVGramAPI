FROM node:16.18.1-buster
ENV NODE_ENV production
WORKDIR /app/
COPY package*.json /app/
RUN npm ci --only=production
COPY . /app/
EXPOSE 8080
USER node
CMD ["npm", "start"]