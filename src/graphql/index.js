/* eslint-disable fp/no-unused-expression */ 
import express from 'express'
import basicAuth from 'express-basic-auth'
import {
  createGateway,
  createServiceList
} from 'fp/apolloGateway'
import {
  applyMiddleware,
  createServer 
} from 'fp/apolloServer'
import { notEmpty } from 'utils'

import * as gateways from './gateways' 


export const createApp = ({ port, users }) => {
  const app = express() 
  const gateway = createGateway({ serviceList: createServiceList(app, port, gateways) })

  const server = createServer({ 
    cors: {
      origin: '*',
      credentials: false,
    }, 
    gateway,
    subscriptions: false,
  })

  if (notEmpty(users)) 
    app.use(basicAuth({
      users,
      challenge: true,
    }))

  applyMiddleware({
    app,
    path: '/', 
  }, server)

  return app 
}
