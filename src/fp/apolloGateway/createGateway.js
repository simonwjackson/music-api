import { ApolloGateway } from '@apollo/gateway'
import { construct } from 'ramda' 

const createGateway = construct(ApolloGateway)

export default createGateway
