import { SignJWT, jwtVerify } from "jose";

// Ensure the secret key is resolved as a Uint8Array for jose
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "super-secret-fintech-token-key-change-in-production";
  return new TextEncoder().encode(secret);
};

export interface JWTSessionPayload {
  id: string;
  email: string;
  name: string;
}

/**
 * Signs a user session payload into an encrypted JWT token
 * Valid for 7 days
 */
export async function signJWT(payload: JWTSessionPayload): Promise<string> {
  const secret = getSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * Verifies a JWT token and returns the decrypted payload if valid, or null if invalid/expired
 */
export async function verifyJWT(token: string): Promise<JWTSessionPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch (error) {
    console.error("JWT Verification error:", error);
    return null;
  }
}
