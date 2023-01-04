# Telegram Temp-mail bot


## 📋Description
This bot can generate temp-mail email addresses using api and "Redis"

## 🦾 How to run?
1. Clone the project
2. Write `npm i` command
3. Create `.env` file
4. Write your redis url and your telegram bot token in env file like this:
```
BOT_TOKEN=<your telegram bot token>
REDIS_URL=<your redis url>
```
5. Run `npm start` command to run the bot
6. That's it!

## 🐳 How to build with docker

1. Write your telegram token and redis url like before
2. Make sure that you are in directory with bot and write `sudo docker build -f Dockerfile temp-mail-bot .` command to create docker image.
3. Run container with command `docker run -d temp-mail-bot`
4. That's it!

