FROM node:14.16.0-alpine3.12 as base
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --silent --production && yarn cache clean

FROM base as builder
RUN yarn install --frozen-lockfile --silent
COPY . .
RUN yarn build

FROM base
ARG BRIDGE_ENV
ARG REDIS_URL
ARG REDIS_PORT
ARG BRIDGE_API_EXTERNAL_URL
ARG DSS_URL
WORKDIR /usr/src/app
COPY --from=builder dist dist
COPY api api
RUN  mkdir log && chown -R node:node log
USER node
EXPOSE 9002/tcp
ENV NODE_ENV production
CMD [ "node", "dist/start.js" ]
