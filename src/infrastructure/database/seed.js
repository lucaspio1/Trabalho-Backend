const db = require('./database');
const Cliente = require('../../domain/entities/Cliente');
const Plano = require('../../domain/entities/Plano');
const Assinatura = require('../../domain/entities/Assinatura');
const Pagamento = require('../../domain/entities/Pagamento');

const seedDatabase = async () => {
    try {
        await db.sync({ force: true }); // Apaga e recria as tabelas

        // Criar clientes
        const clientes = await Cliente.bulkCreate([
            { nome: 'João Silva', email: 'joao@email.com' },
            { nome: 'Maria Souza', email: 'maria@email.com' },
            { nome: 'Carlos Oliveira', email: 'carlos@email.com' },
            { nome: 'Ana Lima', email: 'ana@email.com' }
        ]);

        // Criar planos
        const planos = await Plano.bulkCreate([
            { nome: 'Plano Básico', custoMensal: 99.90, descricao: '100MB de internet' },
            { nome: 'Plano Premium', custoMensal: 199.90, descricao: '500MB de internet + TV' },
            { nome: 'Plano Empresarial', custoMensal: 299.90, descricao: '1GB de internet + Suporte 24h' },
            { nome: 'Plano Ultra', custoMensal: 399.90, descricao: '2GB de internet + TV + Telefone' }
        ]);

        // Criar assinaturas
        const assinaturas = await Assinatura.bulkCreate([
            {
                codPlano: planos[0].codigo,
                codCli: clientes[0].codigo,
                inicioFidelidade: new Date(),
                fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                custoFinal: 89.90,
                descricao: 'Desconto de fidelidade aplicado',
                dataUltimoPagamento: new Date()
            },
            {
                codPlano: planos[1].codigo,
                codCli: clientes[1].codigo,
                inicioFidelidade: new Date(),
                fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                custoFinal: 179.90,
                descricao: 'Plano premium com desconto anual',
                dataUltimoPagamento: new Date()
            },
            {
                codPlano: planos[2].codigo,
                codCli: clientes[2].codigo,
                inicioFidelidade: new Date(),
                fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                custoFinal: 279.90,
                descricao: 'Plano empresarial com suporte dedicado',
                dataUltimoPagamento: new Date()
            },
            {
                codPlano: planos[3].codigo,
                codCli: clientes[3].codigo,
                inicioFidelidade: new Date(),
                fimFidelidade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                custoFinal: 379.90,
                descricao: 'Plano ultra com todos os serviços incluídos',
                dataUltimoPagamento: new Date()
            }
        ]);

        // Criar alguns pagamentos de exemplo
        const hoje = new Date();
        const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
        const doisMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 2, hoje.getDate());

        await Pagamento.bulkCreate([
            // Pagamentos cliente 1
            { 
                codAss: assinaturas[0].codigo,
                valorPago: assinaturas[0].custoFinal,
                dataPagamento: hoje
            },
            { 
                codAss: assinaturas[0].codigo,
                valorPago: assinaturas[0].custoFinal,
                dataPagamento: mesPassado
            },
            { 
                codAss: assinaturas[0].codigo,
                valorPago: assinaturas[0].custoFinal,
                dataPagamento: doisMesesAtras
            },
            
            // Pagamentos cliente 2
            { 
                codAss: assinaturas[1].codigo,
                valorPago: assinaturas[1].custoFinal,
                dataPagamento: hoje
            },
            { 
                codAss: assinaturas[1].codigo,
                valorPago: assinaturas[1].custoFinal,
                dataPagamento: mesPassado
            },
            
            // Pagamentos cliente 3
            { 
                codAss: assinaturas[2].codigo,
                valorPago: assinaturas[2].custoFinal,
                dataPagamento: hoje
            },
            
            // Pagamentos cliente 4
            { 
                codAss: assinaturas[3].codigo,
                valorPago: assinaturas[3].custoFinal,
                dataPagamento: hoje
            },
            { 
                codAss: assinaturas[3].codigo,
                valorPago: assinaturas[3].custoFinal,
                dataPagamento: mesPassado
            }
        ]);

        console.log('Banco populado com sucesso!');
        
        // Se executado diretamente, encerrar o processo
        if (require.main === module) {
            process.exit(0);
        }
        
        return {
            clientes,
            planos,
            assinaturas
        };
    } catch (error) {
        console.error('Erro ao popular o banco de dados:', error);
        process.exit(1);
    }
};

// Executar a função de seed se este arquivo for executado diretamente
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;