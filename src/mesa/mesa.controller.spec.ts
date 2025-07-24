import { Test, TestingModule } from '@nestjs/testing';
import { MesaController } from './mesa.controller';
import { MesaService } from './mesa.service';

describe('MesaController', () => {
  let controller: MesaController;
  let service: MesaService;

  const mockMesaService = {
    create: jest.fn().mockResolvedValue({ id: 1, disponible: true }),
    findAll: jest.fn().mockResolvedValue([{ id: 1, disponible: true }]),
    marcarComoOcupada: jest.fn().mockResolvedValue({ id: 1, disponible: false }),
    marcarComoDisponible: jest.fn().mockResolvedValue({ id: 1, disponible: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesaController],
      providers: [
        {
          provide: MesaService,
          useValue: mockMesaService,
        },
      ],
    }).compile();

    controller = module.get<MesaController>(MesaController);
    service = module.get<MesaService>(MesaService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear una nueva mesa', async () => {
    const result = await controller.create();
    expect(result).toEqual({ id: 1, disponible: true });
    expect(service.create).toHaveBeenCalled();
  });

  it('debería retornar todas las mesas', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 1, disponible: true }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('debería marcar una mesa como ocupada', async () => {
    const result = await controller.ocupar(1);
    expect(result.disponible).toBe(false);
    expect(service.marcarComoOcupada).toHaveBeenCalledWith(1);
  });

  it('debería marcar una mesa como disponible', async () => {
    const result = await controller.disponible(1);
    expect(result.disponible).toBe(true);
    expect(service.marcarComoDisponible).toHaveBeenCalledWith(1);
  });
});
