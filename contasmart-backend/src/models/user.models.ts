import pool from '../config/db'; // Asumiendo que tienes configurado mysql2/promise

export class UserModel {
  /**
   * Busca un usuario por su correo electrónico
   */
  static async findByEmail(email: string) {
    const [rows]: any = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0]; // Retorna el usuario si existe, o undefined
  }

  /**
   * Busca un usuario por su ID
   */
  static async findById(id: number) {
    const [rows]: any = await pool.query(
      'SELECT id, nombre, apellido, email, rol_id, is_active FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  /**
   * Crea un nuevo usuario en la base de datos
   */
  static async createUser(userData: any) {
    const { rol_id, nombre, apellido, email, password_hash } = userData;
    const [result]: any = await pool.query(
      `INSERT INTO usuarios (rol_id, nombre, apellido, email, password_hash) 
       VALUES (?, ?, ?, ?, ?)`,
      [rol_id, nombre, apellido, email, password_hash]
    );
    return result.insertId; // Retorna el ID del nuevo registro
  }

  /**
   * Guarda un token de recuperación y su fecha de expiración
   */
  static async saveResetToken(userId: number, token: string, expires: Date) {
    await pool.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [token, expires, userId]
    );
  }

  /**
   * Actualiza la contraseña y limpia los tokens de recuperación
   */
  static async updatePassword(userId: number, newPasswordHash: string) {
    await pool.query(
      `UPDATE usuarios 
       SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL 
       WHERE id = ?`,
      [newPasswordHash, userId]
    );
  }
}