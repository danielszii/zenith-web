import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { CreateUsuarioDTO } from '../dtos/CreateUsuarioDTO.js';
import { BusinessRuleError } from '../errors/BusinessRuleError.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { Usuario } from '../models/Usuario.js';
import type { UsuarioRepository } from '../repositories/UsuarioRepository.js';

export class AuthService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async cadastrarUsuario(dados: CreateUsuarioDTO) {
    const usuarioExiste = await this.usuarioRepository.findByEmail(dados.email);
    if (usuarioExiste) throw new BusinessRuleError('Este e-mail já está cadastrado no sistema.');

    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);
    const usuario = Usuario.construir(dados.nome, dados.email, senhaCriptografada, dados.role);
    return this.usuarioRepository.create(usuario);
  }

  async login(email: string, senha: string) {
    if (!email || !senha) throw new UnauthorizedError('E-mail e senha são obrigatórios.');

    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      throw new UnauthorizedError('Credenciais inválidas: e-mail ou senha incorretos.');
    }

    const token = jwt.sign({ id: usuario.id_usuario, role: usuario.role }, env.jwtSecret, { expiresIn: '8h' });
    return {
      usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, role: usuario.role },
      token,
    };
  }
}
