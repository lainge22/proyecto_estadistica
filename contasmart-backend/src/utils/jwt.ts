import jwt from 'jsonwebtoken';

const SECRET = 'super_firma_secreta_para_contasmart_2026';

console.log("Secreto actual:", SECRET); // <--- AÑADE ESTO
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, SECRET);
};

