export class CreateOrdenDto {
    mesa: number;
    usuario: string;
    items: {
      platilloId: number;
      nombre: string;
      categoria: string;
      precio: number;
      cantidad: number;
    }[];
  }
  