export class CalculoTotalesService {
  calcularTotal(platillos: { precio: number; cantidad: number }[]): number {
    return platillos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }
}