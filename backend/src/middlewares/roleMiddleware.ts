import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (rolesPermitidas: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.usuarioLogado;

    if (!usuario) {
      return res
        .status(401)
        .json({ status: "error", message: "Usuário não autenticado." });
    }

    // Valida se a role do usuário logado está inclusa na lista de permissões da rota
    if (!rolesPermitidas.includes(usuario.role)) {
      return res.status(403).json({
        status: "error",
        message:
          "Acesso negado: Você não tem permissão para acessar este recurso.",
      });
    }

    return next();
  };
};
