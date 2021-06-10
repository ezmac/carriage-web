FROM node

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run postinstall && npm run heroku-postbuild && rm -rf node_modules && npm install --production && \
  chmod 755 /usr/src/app/secrets-entrypoint.sh && \
  rm -rf /usr/src/app/.git && \
  chown -R node:node /usr/src/app

# we need pm2 globally
RUN yarn global add pm2

USER node

EXPOSE 4300

ENV NODE_ENV production

WORKDIR /usr/src/app

# Overwrite the entry-point script
ENTRYPOINT ["/usr/src/app/secrets-entrypoint.sh"]

CMD ["npm", "start"]