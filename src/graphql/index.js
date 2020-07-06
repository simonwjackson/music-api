/* eslint-disable fp/no-unused-expression */ 
import { RemoteGraphQLDataSource } from '@apollo/gateway'
import { AuthenticationError } from 'apollo-server'
import express from 'express'
import expressJwt from 'express-jwt'
import {
  createGateway,
  createServiceList
} from 'fp/apolloGateway'
import {
  applyMiddleware,
  createServer,
} from 'fp/apolloServer'
import jwksRsa from 'jwks-rsa'
import { curry } from 'ramda'
import { notEmpty } from 'utils'

import * as gateways from './gateways' 


/**
 * @typedef {Object} JwtOptions creates a new type named 'SpecialType'
 * @property {string} domain JWT domain
 * @property {string} audience Audience / Client ID
 */

/**
 * @typedef {Object} ExpressOptions creates a new type named 'SpecialType'
 * @property {string} port a string property of SpecialType
 */

/** @typedef {Object} AppOptions creates a new type named 'SpecialType'
 * @property {ExpressOptions} express Auth0 client ID
 * @property {JwtOptions} [jwt] Auth0 client ID
 */

/** @param {AppOptions} options - a number property of SpecialType
 */
export const createApp = curry(
  /** @type {(options: AppOptions) => express} */ 
  options => {
    const app = express() 
    // @ts-ignore
    const gateway = createGateway({ 
      buildService({ url }) {
        return new RemoteGraphQLDataSource({
          url,
          willSendRequest({ request, context }) {
            request.http.headers.set(
              'user',
              context.user ? JSON.stringify(context.user) : null
            )
          }
        })
      },
      serviceList: createServiceList(app, options.express.port, gateways) 
    })

    const server = createServer({ 
      cors: { origin: '*' }, 
      gateway,
      subscriptions: false,
      context: ({ req }) => {
        const user = req.user || null

        return { user }
      }
    })


    if (notEmpty(options.jwt)){
      app.use(
        expressJwt({
          secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${options.jwt.domain}/.well-known/jwks.json`
          }),
          aud: options.jwt.audience,
          issuer: `https://${options.jwt.domain}/`,
          algorithms: ['RS256']
        })
      )


      app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') 
          res.json(new AuthenticationError('You must be logged in to do this'))
      })
    }

    // if (notEmpty(users))
    //   app.use(basicAuth({
    //     // @ts-ignore
    //     users,
    //     challenge: true,
    //   }))

    applyMiddleware({
      app,
      path: '/', 
    }, server)

    // @ts-ignore
    return app 
  })
