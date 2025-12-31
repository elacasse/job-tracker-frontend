FROM node:25

# Install system dependencies
RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y

RUN echo "alias ll='ls -lah'" >> /etc/bash.bashrc

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
