export interface JwtPayload {
  sub: number;
  correo: string;
  rol: 'admin' | 'mesero' | 'cocinero' | 'cliente';
}
