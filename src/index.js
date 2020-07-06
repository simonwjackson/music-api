/* eslint-disable fp/no-unused-expression */
import { path } from 'ramda'

import { createApp } from './graphql'

const port = path(['env', 'PORT'], process) || 4000
const audience = path(['env', 'JWT_AUDIENCE'], process)
const domain = path(['env', 'JWT_DOMAIN'], process)


createApp({
  express: { port },
  jwt: { audience, domain }
})
  .listen({ port }, () =>
    console.log('🚀 Server ready')
  )
