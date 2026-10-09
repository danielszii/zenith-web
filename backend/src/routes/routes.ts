import { Router } from "express";

import { validationMiddleware } from "../middlewares/validationMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

import { AtletaController } from "../controllers/AtletaController.js";
import { ClubeController } from "../controllers/ClubeController.js";
import { CampeonatoController } from "../controllers/CampeonatoController.js";
import { PartidaController } from "../controllers/PartidaController.js";
import { EventoController } from "../controllers/EventoController.js";
import { AuthController } from "../controllers/AuthController.js"; // Novo
import { MobileController } from "../controllers/MobileController.js";
import { EstatisticaController } from "../controllers/EstatisticaController.js";

import { AtletaService } from "../services/AtletaService.js";
import { ClubeService } from "../services/ClubeService.js";
import { CampeonatoService } from "../services/CampeonatoService.js";
import { PartidaService } from "../services/PartidaService.js";
import { EventoService } from "../services/EventoService.js";
import { AuthService } from "../services/AuthService.js"; // Novo

import { AtletaRepository } from "../repositories/AtletaRepository.js";
import { ClubeRepository } from "../repositories/ClubeRepository.js";
import { CampeonatoRepository } from "../repositories/CampeonatoRepository.js";
import { EventoRepository } from "../repositories/EventoRepository.js";
import { PartidaRepository } from "../repositories/PartidaRepository.js";
import { UsuarioRepository } from "../repositories/UsuarioRepository.js"; // Novo
import { MobileRepository } from "../repositories/MobileRepository.js";
import { MobileService } from "../services/MobileService.js";
import { EstatisticaService } from "../services/EstatisticaService.js";
import { EstatisticaRepository } from "../repositories/EstatisticaRepository.js";

import { CreateClubeDTO } from "../dtos/CreateClubeDTO.js";
import { CreateCampeonatoDTO } from "../dtos/CreateCampeonatoDTO.js";
import { CreateAtletaDTO } from "../dtos/CreateAtletaDTO.js";
import { CreatePartidaDTO } from "../dtos/CreatePartidaDTO.js";
import { CreateEventoSumulaDTO } from "../dtos/CreateEventoSumulaDTO.js";
import { CreateUsuarioDTO } from "../dtos/CreateUsuarioDTO.js"; // Novo

const routes = Router();

const atletaController = new AtletaController(new AtletaService(new AtletaRepository()));
const clubeController = new ClubeController(new ClubeService(new ClubeRepository()));
const campeonatoController = new CampeonatoController(new CampeonatoService(new CampeonatoRepository()));
const partidaController = new PartidaController(new PartidaService(new PartidaRepository(), new EventoRepository()));
const eventoController = new EventoController(new EventoService(new PartidaRepository(), new EventoRepository()));
const authController = new AuthController(new AuthService(new UsuarioRepository())); // Novo
const mobileController = new MobileController(new MobileService(new MobileRepository()));
const estatisticaController = new EstatisticaController(new EstatisticaService(new EstatisticaRepository()));

// ROTAS DE AUTENTICAÇÃO (PÚBLICAS)
routes.post('/auth/registrar', authMiddleware, roleMiddleware(['admin']), validationMiddleware(CreateUsuarioDTO), (req, res, next) => authController.registrar(req, res, next));
routes.post('/auth/login', (req, res, next) => authController.login(req, res, next));

// ROTAS DE CLUBES
routes.post('/clubes', authMiddleware, roleMiddleware(['admin', 'gestor']), validationMiddleware(CreateClubeDTO), (req, res, next) => clubeController.store(req, res, next));
routes.get('/clubes', (req, res, next) => clubeController.index(req, res, next));
routes.put('/clubes/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), validationMiddleware(CreateClubeDTO, { partial: true }), (req, res, next) => clubeController.update(req, res, next));
routes.delete('/clubes/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => clubeController.delete(req, res, next));
routes.get('/clubes/:id', (req, res, next) => clubeController.show(req, res, next));

// ROTAS DE CAMPEONATOS
// Protegida: Apenas Administradores podem criar campeonatos (API-02)
routes.post('/campeonatos', authMiddleware, roleMiddleware(['admin', 'gestor']), validationMiddleware(CreateCampeonatoDTO), (req, res, next) => campeonatoController.store(req, res, next));
routes.get('/campeonatos', (req, res, next) => campeonatoController.index(req, res, next));
routes.put('/campeonatos/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), validationMiddleware(CreateCampeonatoDTO, { partial: true }), (req, res, next) => campeonatoController.update(req, res, next));
routes.delete('/campeonatos/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => campeonatoController.delete(req, res, next));
routes.get('/campeonatos/:id', (req, res, next) => campeonatoController.show(req, res, next));
routes.post('/campeonatos/inscricoes', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => campeonatoController.inscreverClube(req, res, next));
routes.get('/campeonatos/:id/tabela', (req, res, next) => campeonatoController.showTabela(req, res, next));

// CENTRAL PÚBLICA DO PORTAL
routes.get('/public/estatisticas', (req, res, next) => estatisticaController.index(req, res, next));
routes.get('/public/atletas', (req, res, next) => atletaController.publicIndex(req, res, next));
routes.get('/public/atletas/:id', (req, res, next) => atletaController.publicShow(req, res, next));
routes.get('/public/atletas/:id/estatisticas', (req, res, next) => atletaController.obterEstatisticas(req, res, next));

// ROTAS DE ATLETAS
routes.post('/atletas', authMiddleware, roleMiddleware(['admin', 'gestor']), validationMiddleware(CreateAtletaDTO), (req, res, next) => atletaController.store(req, res, next));
routes.get('/atletas', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => atletaController.index(req, res, next));
routes.put('/atletas/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), validationMiddleware(CreateAtletaDTO, { partial: true }), (req, res, next) => atletaController.update(req, res, next));
routes.delete('/atletas/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => atletaController.delete(req, res, next));
routes.get('/atletas/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => atletaController.show(req, res, next));
routes.get('/atletas/:id/estatisticas', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => atletaController.obterEstatisticas(req, res, next));

// ROTAS DE PARTIDAS
routes.post('/partidas', authMiddleware, roleMiddleware(['admin', 'gestor']), validationMiddleware(CreatePartidaDTO), (req, res, next) => partidaController.store(req, res, next));
routes.get('/partidas', (req, res, next) => partidaController.index(req, res, next));
routes.get('/partidas/:id', (req, res, next) => partidaController.show(req, res, next));
routes.patch('/partidas/:id/status', authMiddleware, roleMiddleware(['admin', 'gestor', 'mesario']), (req, res, next) => partidaController.updateStatus(req, res, next));
routes.post('/partidas/:id/validar-elenco', authMiddleware, roleMiddleware(['admin', 'mesario']), (req, res, next) => partidaController.validarElenco(req, res, next));
routes.delete('/partidas/:id', authMiddleware, roleMiddleware(['admin', 'gestor']), (req, res, next) => partidaController.delete(req, res, next));

// ROTAS DA SÚMULA E EVENTOS
routes.post('/eventos', authMiddleware, roleMiddleware(['admin', 'mesario']), validationMiddleware(CreateEventoSumulaDTO), (req, res, next) => eventoController.store(req, res, next));
routes.get('/partidas/:id/sumula', (req, res, next) => partidaController.showSumula(req, res, next));

// APP MOBILE OFFLINE-FIRST
routes.get('/mobile/mesarios', authMiddleware, roleMiddleware(['admin']), mobileController.officials);
routes.get('/mobile/partidas', authMiddleware, roleMiddleware(['admin', 'mesario']), mobileController.list);
routes.get('/mobile/partidas/:id/pacote', authMiddleware, roleMiddleware(['admin', 'mesario']), mobileController.package);
routes.post('/mobile/sync', authMiddleware, roleMiddleware(['admin', 'mesario']), mobileController.sync);
routes.post('/mobile/partidas/:id/atribuir', authMiddleware, roleMiddleware(['admin']), mobileController.assign);

export default routes;
