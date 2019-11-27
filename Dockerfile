FROM node:12.13 as base

ARG registry

RUN if [ ! -z "$registry" ] ; then npm config set registry "$registry" ; fi

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY /src ./src

COPY tslint.json ./
COPY tsconfig.json ./
COPY yttringar.json ./
COPY .sassrc.js ./
COPY .postcssrc.js ./
COPY .posthtmlrc.js ./
COPY README.md ./

RUN npm run build

CMD npm run start
