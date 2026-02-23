FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host makes Vite listen on 0.0.0.0 so it's reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
