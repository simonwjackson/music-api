import {
  applyMiddleware,
  createServer 
} from 'fp/apolloServer'
import {
  always,
  curry,
  map,
  mergeLeft,
  pipe,
  toPairs,
} from 'ramda'

const _createService = (app, port, [name, settings]) => pipe(
  // TODO: Refactor into HOC 
  mergeLeft({
    context: ({ req }) => {
      const user = req.headers.user ? JSON.parse(req.headers.user) : null

      return { user }
    }
  }),
  createServer,
  applyMiddleware({
    app,
    path: `/${name}`
  }),
  always({
    url: `http://localhost:${port}/${name}`,
    name,
  })
)(settings)

const createService = curry(_createService)

const createServiceList = curry(
  /** @type {(app: express, port: number, gateways: []) => serviceList} */
  (app, port, gateways) => pipe(
    toPairs,
    map(createService(app, port))
  )(gateways)
)

export default curry(createServiceList)

