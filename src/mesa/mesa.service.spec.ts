import { Test, TestingModule } from '@nestjs/testing';
import { MesaService } from './mesa.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';
import { Repository } from 'typeorm';

const mockMesaRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
});

describe('MesaService', () => {
    let service: MesaService;
    let repo: Repository<Mesa>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MesaService,
                {
                    provide: getRepositoryToken(Mesa),
                    useFactory: mockMesaRepository,
                },
            ],
        }).compile();

        service = module.get<MesaService>(MesaService);
        repo = module.get<Repository<Mesa>>(getRepositoryToken(Mesa));
    });

    it('debería crear una nueva mesa', async () => {
        const mesa = { id: 1, disponible: true };
        jest.spyOn(repo, 'create').mockReturnValue(mesa as any);
        jest.spyOn(repo, 'save').mockResolvedValue(mesa as any);

        const result = await service.create();
        expect(result).toEqual(mesa);
        expect(repo.create).toHaveBeenCalled();
        expect(repo.save).toHaveBeenCalledWith(mesa);
    });

    it('debería marcar mesa como ocupada', async () => {
        const mesa = { id: 1, disponible: true };
        jest.spyOn(repo, 'findOneBy').mockResolvedValue(mesa as any);
        jest.spyOn(repo, 'save').mockImplementation(async (m) => {
            return { ...m, id: 1 } as Mesa;
        });

        const result = await service.marcarComoOcupada(1);
        expect(result.disponible).toBe(false);
    });

    it('debería marcar mesa como disponible', async () => {
        const mesa = { id: 1, disponible: false };
        jest.spyOn(repo, 'findOneBy').mockResolvedValue(mesa as any);
        jest.spyOn(repo, 'save').mockImplementation(async (m) => {
            return { ...m, id: 1 } as Mesa;
        });

        const result = await service.marcarComoDisponible(1);
        expect(result.disponible).toBe(true);
    });
});
