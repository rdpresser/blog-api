FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "pnpm-lock.yaml", "./"]
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
EXPOSE 3000
#RUN chown -R node /usr/src/app
#USER node
ENV NODE_ENV=production
CMD ["pnpm", "run", "start"]
