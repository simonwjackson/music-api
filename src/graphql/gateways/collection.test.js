// import { createTestClient } from 'apollo-server-testing'
//
// import { resolvers, typeDefs } from './collection'
//
// describe('my tests', () => {
//   it('fetches single launch', async () => {
//     expect.hasAssertions()
//
//     const userAPI = new UserAPI({ store })
//     const launchAPI = new LaunchAPI()
//
//     // create a test server to test against, using our production typeDefs,
//     // resolvers, and dataSources.
//     const server = new ApolloServer({
//       typeDefs,
//       resolvers,
//       dataSources: () => ({ userAPI, launchAPI }),
//       context: () => ({ user: { id: 1, email: 'a@a.a' } }),
//     })
//
//     // mock the dataSource's underlying fetch methods
//     jest.spyOn(launchAPI, 'get').mockImplementation(() => [mockLaunchResponse])
//     userAPI.store = mockStore
//     userAPI.store.trips.findAll.mockReturnValueOnce([
//       { dataValues: { launchId: 1 } },
//     ])
//
//     // use the test server to create a query function
//     const { query } = createTestClient(server)
//
//     // run query against the server and snapshot the output
//     const res = await query({ query: GET_LAUNCH, variables: { id: 1 } })
//
//     expect(res).toMatchInlineSnapshot()
//   })
// })
//
