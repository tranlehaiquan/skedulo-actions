import * as jwt from 'jsonwebtoken'

interface SkedJWT {
  // No idea what this is
  at_hash: string

  'https://api.skedulo.com/name': string
  'https://api.skedulo.com/organization_id': string
  'https://api.skedulo.com/username': string
  'https://api.skedulo.com/vendor': string

  nonce: string

  // Issuer
  iss: string
  // Sked-Env | UserId
  sub: string
  // Audience | Client ID
  aud: string
  // Expiry in Seconds
  exp: number
  // Issue date in seconds
  iat: number
}

interface JWTHeader {
  typ: string
  alg: 'RS256' | 'HS256'
  kid?: string
}

export interface DecodedJWT {
  header: JWTHeader
  payload: SkedJWT
}

export function decode(token: string): DecodedJWT {
  return jwt.decode(token, { complete: true }) as DecodedJWT
}
