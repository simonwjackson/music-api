import { shouldChallenge } from './utils'

describe('utils', () => {
  it('shouldChallenge', () => {
    expect.assertions(4)

    expect(
      shouldChallenge({
        env: {
          HTTP_USER: null,
          HTTP_PASS: undefined
        }
      })
    ).toBe(false)

    expect(
      shouldChallenge({
        env: {
          HTTP_USER: '',
          HTTP_PASS: ''
        }
      })
    ).toBe(false)

    expect(
      shouldChallenge({
        env: {
          HTTP_USER: 'a',
          HTTP_PASS: ''
        }
      })
    ).toBe(true)

    expect(
      shouldChallenge({
        env: {
          HTTP_USER: 'a',
          HTTP_PASS: 'b'
        }
      })
    ).toBe(true)
  })
})
