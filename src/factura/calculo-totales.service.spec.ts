import { CalculoTotalesService } from "./calculo-totales.service";

describe('CalculoTotalesService', () => {
  let service: CalculoTotalesService;

  beforeEach(() => {
    service = new CalculoTotalesService();
  });

  it('debe calcular correctamente el total', () => {
    const platillos = [
      { precio: 10, cantidad: 2 },
      { precio: 5, cantidad: 3 },
    ];
    expect(service.calcularTotal(platillos)).toBe(35);
  });
});