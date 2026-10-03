import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js";
import { BusinessRuleError } from "../errors/BusinessRuleError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { CreateUsuarioDTO } from "../dtos/CreateUsuarioDTO.js";
import { Usuario } from "../models/Usuario.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_local";

export class AuthService {
  public constructor(private readonly usuarioRepository: UsuarioRepository) {}

  // API-03: Criptografia no cadastro
  async cadastrarUsuario(dados: CreateUsuarioDTO) {
    const usuarioExiste = await this.usuarioRepository.findByEmail(dados.email);
    if (usuarioExiste) {
      throw new BusinessRuleError("Este e-mail já está cadastrado no sistema.");
    }

    // Salto de criptografia (salt) = 10 (padrão de mercado seguro)
    const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

    const usuarioModel = Usuario.construir(
      dados.nome,
      dados.email,
      senhaCriptografada,
      dados.role,
    );

    return await this.usuarioRepository.create(usuarioModel);
  }

  // API-01: Emissão do Token JWT após checagem da senha
  async login(email: string, senhaPura: string) {
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new NotFoundError(
        "Credenciais inválidas: e-mail ou senha incorretos.",
      );
    }

    // API-03: Compara a senha digitada com o hash criptografado salvo no banco
    const senhaCorreta = await bcrypt.compare(senhaPura, usuario.senha);
    if (!senhaCorreta) {
      throw new BusinessRuleError(
        "Credenciais inválidas: e-mail ou senha incorretos.",
      );
    }

    // Gera o token carregando o ID e a Role do usuário (API-02 / RBAC)
    const token = jwt.sign(
      { id: usuario.id_usuario, role: usuario.role },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    // Retorna os dados do usuário logado e o token stateless
    return {
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
      token,
    };
  }
}
