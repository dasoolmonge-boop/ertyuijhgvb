# Инструкция по развертыванию (деплою) магазина KUZEL

Интернет-магазин тувинской национальной одежды KUZEL готов к развертыванию на любом VPS-сервере (Ubuntu / Debian / AlmaLinux) или в Docker-контейнере.

---

## 1. Настройка Telegram-бота

1. Откройте в Telegram бота **[@magazin_Tyva_bot](https://t.me/magazin_Tyva_bot)** (или создайте нового через [@BotFather](https://t.me/BotFather)).
2. **ОБЯЗАТЕЛЬНО:** Нажмите **Start** (`/start`), чтобы бот получил разрешение отправлять вам уведомления о заказах.
3. Узнайте свой Telegram ID через бота [@userinfobot](https://t.me/userinfobot) (например, `1066867845`).
4. Если администраторов несколько, укажите их ID через запятую в `.env`:
   ```bash
   TELEGRAM_ADMIN_IDS=1066867845,987654321
   ```

---

## 2. Вариант А: Деплой через Docker Compose (Рекомендуемый)

Убедитесь, что на сервере установлены `docker` и `docker compose`.

1. Скопируйте файлы проекта на сервер:
   ```bash
   git clone <URL_РЕПОЗИТОРИЯ> /var/www/kuzel-shop
   cd /var/www/kuzel-shop
   ```

2. Создайте файл `.env` на основе `.env.example`:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Укажите токен бота и ID администраторов:
   ```env
   PORT=3001
   TELEGRAM_BOT_TOKEN=9271658532:AAF8tZ-EwlMOsnJBbslV1ZanZM0e7ouqAo8
   TELEGRAM_ADMIN_IDS=1066867845
   NODE_ENV=production
   ```

3. Запустите контейнер:
   ```bash
   docker compose up -d --build
   ```

4. Проверьте статус:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

Сайт и API будут доступны на порту `3001`. База заказов и заявок сохраняется в локальной папке `./data/`, которая примонтирована в контейнер.

---

## 3. Вариант Б: Деплой на чистом сервере (Node.js + PM2)

1. Установите Node.js (версия 20 или новее) и PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. Склонируйте репозиторий и установите зависимости:
   ```bash
   cd /var/www/kuzel-shop
   npm ci
   ```

3. Соберите фронтенд:
   ```bash
   npm run build
   ```

4. Создайте и настройте `.env`:
   ```bash
   cp .env.example .env
   nano .env
   ```

5. Запустите сервис через PM2:
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

---

## 4. Настройка Nginx с SSL (HTTPS)

Пример конфигурации Nginx (`/etc/nginx/sites-available/kuzel.conf`):

```nginx
server {
    listen 80;
    server_name kuzel.shop www.kuzel.shop;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активация и получение бесплатного SSL-сертификата Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/kuzel.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d kuzel.shop -d www.kuzel.shop
```

---

## 5. Проверка работы

- **Проверка статуса сервера:**
  `curl http://localhost:3001/api/health`
- **Просмотр заказов через Telegram:**
  Напишите боту команду `/orders` в Telegram.
