
# # Etapa de build usando Node 22
# FROM node:22-alpine AS builder
# WORKDIR /app

# # Copia primero solo package.json y package-lock.json para cachear npm ci
# COPY package*.json ./
# RUN npm ci

# # Copia el resto del código
# COPY . .

# RUN npm run build

# # Etapa de runtime con Node 22
# FROM node:22-alpine
# WORKDIR /app

# # Copia artefactos desde builder
# COPY --from=builder /app ./

# EXPOSE 3000
# CMD ["npm", "start"]


FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
