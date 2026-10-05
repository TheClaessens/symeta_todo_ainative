export interface LoginPayload {
  email: string;
  /**
   * The user's ID, conforming to the JWT standard
   */
  sub: string;
}

type Payload = LoginPayload;

export const parseJWT = <T extends Payload>(token: string): T => {
  const payloadBase64 = token.split('.')[1];
  if (!payloadBase64) {
    throw new Error('Invalid token');
  }
  const payloadJson = atob(payloadBase64);
  return JSON.parse(payloadJson);
};
