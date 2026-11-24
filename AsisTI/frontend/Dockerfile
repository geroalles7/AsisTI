# Imagen oficial de Node.js
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código del frontend
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Iniciar Vite escuchando desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
