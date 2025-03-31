const db = require('./database');
const Cliente = require('../../domain/entities/Cliente');
const Plano = require('../../domain/entities/Plano');
const Assinatura = require('../../domain/entities/Assinatura');

const seedDatabase = async () => {
    await db.sync({ force: true }); // Apaga e recria as tabelas

    const clientes = await Cliente.bulkCreate([
        { nome: 'João Silva', email: 'joao@email.com' },
        { nome: 'Maria Souza', email: 'maria@email.com' },
        { nome: 'Carlos Oliveira', email: 'carlos@email.com' },
        { nome: 'Ana Lima', email: 'ana@email.com' }
    ]);

    const planos = await Plano.bulkCreate([
        { nome: 'Plano Básico', custoMensal: 99.90, descricao: '100MB de internet' },
        { nome: 'Plano Premium', custoMensal: 199.90, descricao: '500MB de internet + TV' },
        { nome: 'Plano Empresarial', custoMensal: 299.90, descricao: '1GB de internet + Suporte 24h' },
        { nome: 'Plano Ultra', custoMensal: 399.90, descricao: '2GB de internet + TV + Telefone' }
    ]);

    await Assinatura.bulkCreate([
        {
            codPlano: planos[0].codigo,
            codCli: clientes[0].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            custoFinal: 89.90,
            descricao: 'Desconto de fidelidade aplicado'
        },
        {
            codPlano: planos[1].codigo,
            codCli: clientes[1].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            custoFinal: 179.90,
            descricao: 'Plano premium com desconto anual'
        },
        {
            codPlano: planos[2].codigo,
            codCli: clientes[2].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            custoFinal: 279.90,
            descricao: 'Plano empresarial com suporte dedicado'
        },
        {
            codPlano: planos[3].codigo,
            codCli: clientes[3].codigo,
            inicioFidelidade: new Date(),
            fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            custoFinal: 379.90,
            descricao: 'Plano ultra com todos os serviços incluídos'
        }
    ]);

    console.log('Banco populado com sucesso!');
    process.exit();
};

seedDatabase();
