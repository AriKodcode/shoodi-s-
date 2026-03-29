FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_BACKEND_HOST
ARG VITE_BACKEND_PORT
ARG VITE_BACKEND_ROUTE

# הזרקת המשתנים לתוך Vite בזמן ה-Build
ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST
ENV VITE_BACKEND_PORT=$VITE_BACKEND_PORT
ENV VITE_BACKEND_ROUTE=$VITE_BACKEND_ROUTE

COPY . .
RUN npm run build

# שימוש ב-Image שמותאם ל-OpenShift (ללא root)
FROM nginxinc/nginx-unprivileged:alpine

# העתקת קובץ ה-קונפיגורציה שלך
COPY nginx.conf /etc/nginx/conf.d/default.conf

# העתקת התוצר הסופי מה-builder
COPY --from=builder /app/dist /usr/share/nginx/html

# ב-OpenShift משתמשים בפורט 8080 במקום 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]