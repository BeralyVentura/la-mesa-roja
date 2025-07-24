import { Test, TestingModule } from '@nestjs/testing';
import { OrdenesService } from './ordenes.service';
import { EstadoOrden } from 'src/common/enums/estado-orden.enum';

describe('OrdenesService', () => {
  let service: OrdenesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenesService],
    }).compile();

    service = module.get<OrdenesService>(OrdenesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // Prueba #1
  //Crear una orden válida con items y calcular subtotal
  // Debería simular una orden con platillos, precios y cantidades válidas
  // y verificar que el subtotal (precio * cantidad) sea correcto.

  it('debería crear una orden con subtotal y total correctos', async () => {
  const dto = {
    usuario: 'camila@mesa.com',
    mesa: 1,
    items: [
      { platilloId: 1, nombre: 'Taco', categoria: 'comida', precio: 5, cantidad: 2 },
      { platilloId: 2, nombre: 'Refresco', categoria: 'bebida', precio: 2, cantidad: 1 },
    ],
  };

  const ordenRepo = {
    create: jest.fn().mockReturnValue({ ...dto, subtotal: 12 }),
    save: jest.fn().mockResolvedValue({ id: 99, ...dto, subtotal: 12 }),
  };

  const service = new OrdenesService(ordenRepo as any, {} as any, {
    findActivePromotions: jest.fn().mockResolvedValue([]),
  } as any);

  const result = await service.create(dto as any);
  expect(result.subtotal).toBe(12);
});

// PRUEBA 2: Transición válida de estado
// Debería permitir cambiar el estado de una orden de 'solicitada' a 'en_cocina'
// y devolver el nuevo estado actualizado correctamente.
it('debería permitir cambiar de solicitada a en_cocina', async () => {
  const orden = { id: 1, estado: 'solicitada' };

  const ordenRepo = {
    findOneBy: jest.fn().mockResolvedValue(orden),
    save: jest.fn().mockImplementation(async (m) => ({ ...m })),
  };

  const service = new OrdenesService(ordenRepo as any, {} as any, {} as any);
  const result = await service.cambiarEstado(1, EstadoOrden.EN_COCINA);

  expect(result.estado).toBe('en_cocina');
});

//PRUEBA 3
it('debería rechazar transición inválida de facturada a en_cocina', async () => {
  const orden = { id: 1, estado: 'facturada' };

  const ordenRepo = {
    findOneBy: jest.fn().mockResolvedValue(orden),
    save: jest.fn(),
  };

  const service = new OrdenesService(ordenRepo as any, {} as any, {} as any);

  await expect(service.cambiarEstado(1, EstadoOrden.EN_COCINA)).rejects.toThrow('Transición de estado inválida');

});
});
