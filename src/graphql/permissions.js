import {
  rule,
  shield 
} from 'graphql-shield'

const isAuthenticated = rule()((parent, args, { user }) => user !== null)

const permissions = shield({ Query: { viewer: isAuthenticated } })

export default permissions
