FROM node:12.16.1-alpine as base
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent --production && yarn cache clean

FROM base as builder
RUN yarn install --frozen-lockfile --silent
COPY . .
RUN yarn build

FROM base
WORKDIR /usr/src/app
COPY --from=builder dist dist
COPY api api
RUN  mkdir log && chown -R node:node log
USER node
EXPOSE 9000/tcp
ENV NODE_ENV production
CMD [ "node", "dist/start.js" ]
