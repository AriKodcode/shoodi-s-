# 1. שימוש בגרסה קלה של Node.js
FROM node:20-alpine

# 2. הגדרת תיקיית עבודה
WORKDIR /app

# 3. העתקת קבצי הגדרות התלויות והתקנתן
# אנחנו מעתיקים אותם בנפרד כדי לנצל את ה-Cache של Docker
COPY package*.json ./
RUN npm install --production

# 4. העתקת שאר קוד המקור
COPY . .

# 5. חשיפת הפורט עליו השרת מאזין (למשל 3000 או 5000)
EXPOSE 3000

# 6. פקודת ההרצה של השרת
# וודא שב-package.json יש לך סקריפט בשם start (למשל: "node index.js")
CMD ["npm", "start"]