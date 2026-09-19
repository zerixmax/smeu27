# 1. faza: Izgradnja statičkog paketa (Build Stage)
FROM node:22-alpine AS build

WORKDIR /app

# Kopiranje definicija paketa
COPY package*.json ./

# Instalacija ovisnosti
RUN npm ci --legacy-peer-deps

# Kopiranje cjelokupnog koda
COPY . .

# Pokretanje provjere tipova i statičkog generiranja
RUN npm run build

# 2. faza: Nginx produkcijski poslužitelj (Serve Stage)
FROM nginx:alpine AS runtime

# Kopiranje prilagođene Nginx konfiguracije
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiranje generiranog dist/ sadržaja iz build faze
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
