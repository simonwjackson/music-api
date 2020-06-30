/* eslint-disable fp/no-unused-expression */
import { path } from 'ramda'
import { notEmpty } from 'utils'

import { createApp } from './graphql'

const port = path(['env', 'PORT'], process) || 4000
const USER = path(['env', 'HTTP_USER'], process)
const PASS = path(['env', 'HTTP_PASS'], process)

const users = notEmpty(USER) || notEmpty(PASS) ? { [USER]: PASS } : {}

createApp({ port, users })
  .listen({ port }, () =>
    console.log('🚀 Server ready')
  )
