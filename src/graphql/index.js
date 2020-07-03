/* eslint-disable fp/no-unused-expression */ 
import express from 'express'
import basicAuth from 'express-basic-auth'
import {
  createGateway,
  createServiceList
} from 'fp/apolloGateway'
import {
  applyMiddleware,
  createServer,
} from 'fp/apolloServer'
import { curry } from 'ramda'
import { notEmpty } from 'utils'

import * as gateways from './gateways' 

/**
 * @typedef {Object} Options - creates a new type named 'SpecialType'
 * @property {string} port - a string property of SpecialType
 * @property {number} [users] - a number property of SpecialType
 *
 * @param {Options} options - a number property of SpecialType
 */
export const createApp = curry(
  /** @type {(options: Options) => express} */ 
  ({ port, users }) => {
    const app = express() 
    // @ts-ignore
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
        // @ts-ignore
        users,
        challenge: true,
      }))

    applyMiddleware({
      app,
      path: '/', 
    }, server)

    // @ts-ignore
    return app 
  })
