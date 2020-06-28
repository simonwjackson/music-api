import { shouldChallenge } from './'

test('shouldChallenge', () => {
  const res = shouldChallenge({
    env: {
      HTTP_USER: '',
      HTTP_PASS: ''
    }
  })

  expect(res).toEqual(false)
})
