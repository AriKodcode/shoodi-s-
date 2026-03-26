FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_BACKEND_HOST
ARG VITE_BACKEND_PORT
ARG VITE_BACKEND_ROUTE

# הפיכתם למשתני סביבה ש-Vite מזהה בזמן ה-Build
ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST
ENV VITE_BACKEND_PORT=$VITE_BACKEND_PORT
ENV VITE_BACKEND_ROUTE=$VITE_BACKEND_ROUTE
COPY . .

RUN npm run build

COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]