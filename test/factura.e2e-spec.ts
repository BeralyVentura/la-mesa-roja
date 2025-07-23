import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('FacturaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/factura/:ordenId (POST) → debería generar factura', async () => {
    const ordenId = 1; // Asegúrate de que exista una orden con este ID

    const response = await request(app.getHttpServer())
      .post(`/factura/${ordenId}`)
      .expect(201);

    expect(response.body.total).toBeDefined();
  });
});
