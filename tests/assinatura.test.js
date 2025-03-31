const request = require('supertest');
const { app } = require('../src/infrastructure/server');
require('./setup');

describe('Testes de Assinatura', () => {
  it('Deve criar uma nova assinatura', async () => {
    const response = await request(app).post('/gestao/assinaturas').send({
      codPlano: 1,
      codCli: 1,
      inicioFidelidade: '2025-01-01',
      fimFidelidade: '2026-01-01',
      custoFinal: 100.00,
      descricao: 'Plano promocional'
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('codigo');
  });

  it('Deve listar todas as assinaturas', async () => {
    const response = await request(app).get('/gestao/assinaturas');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});