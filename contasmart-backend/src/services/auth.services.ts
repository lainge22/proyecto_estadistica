import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserModel } from '../models/user.models';
import { generateToken } from '../utils/jwt';

export class AuthService {
  
  static async register(userData: any) {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUserId = await UserModel.createUser({
      ...userData,
      password_hash: passwordHash,
    });

    return { id: newUserId, email: userData.email, rol_id: userData.rol_id };
  }

  static async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    // --- CORRECCIÓN AQUÍ ---
    // Pasamos un objeto plano. Esto evita errores de serialización.
    const token = generateToken({ id: user.id, rol: user.rol_id });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol_id: user.rol_id
      }
    };
  }

  static async forgotPassword(email: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    const expires = new Date(Date.now() + 20 * 60 * 1000); 

    await UserModel.saveResetToken(user.id, hashToken, expires);
    return resetToken;
  }

  static async resetPassword(email: string, token: string, newPassword: string) {
    const user = await UserModel.findByEmail(email);
    if (!user || !user.reset_token || !user.reset_token_expires) {
      throw new Error('Token inválido o expirado');
    }

    const hashedInputToken = crypto.createHash('sha256').update(token).digest('hex');

    if (hashedInputToken !== user.reset_token || new Date() > user.reset_token_expires) {
      throw new Error('Token inválido o expirado');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    await UserModel.updatePassword(user.id, newHash);
  }
}