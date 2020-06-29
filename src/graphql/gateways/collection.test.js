import     EasyGraphQLTester from 'easygraphql-tester'

import { typeDefs as collectionSchema } from './collection'

const tester = new EasyGraphQLTester(collectionSchema)

describe('my tests', () => {
  it.skip('a test', () => true)
})

