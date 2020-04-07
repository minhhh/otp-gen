FROM node:10-alpine as builder

WORKDIR '/app'
COPY ./package.json ./
RUN yarn install
COPY . .
RUN npm run test
RUN npm run build
RUN rm -frv node_modules
RUN yarn install --prod

FROM node:10-alpine
WORKDIR '/app'
COPY --from=builder /app/build /app
COPY --from=builder /app/node_modules /app/node_modules
ENTRYPOINT ["node", "index.js"]
