const request = require('supertest');
const { app } = require('../src/infrastructure/server');
require('./setup');

describe('Testes de Cliente', () => {
  it('Deve listar todos os clientes', async () => {
    const response = await request(app).get('/gestao/clientes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});