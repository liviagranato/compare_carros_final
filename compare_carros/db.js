const pg = require('pg');
const PASSWORD = '******'; //INSIRA SUA SENHA
const DATABASE = '******'; //INSIRA O NOME DO SEU DATABASE
const USER = '*******'; //INSIRA SEU USERNAME
const HOST = 'localhost';
const PORT = 5432; //CHECAR PORTA PADRÃO DE SUA CONEXÃO

const config = {
    host: HOST,
    user: USER,
    database: DATABASE,
    password: PASSWORD,
    port: PORT                 
};

const client = new pg.Client(config);

module.exports.connect = async function(){
    await client.connect(err => {
        if (err){
            throw err;
        } 
        else {
            criarTabelaQuery();
        }
    });
}

function criarTabelaQuery() {
    const query = `
        create table veiculos(
            Valor varchar(255),
            Marca varchar(255),
            Modelo varchar(255),
            AnoModelo int,
            Combustivel varchar(255),
            CodigoFipe varchar(255) primary key unique,
            MesReferencia varchar(255),
            TipoVeiculo int,
            SiglaCombustivel varchar(10)            
        );
        `;

    client
        .query(query)
        .then(() => {
            console.log('Tabela criada com sucesso');
            client.end();
        })
        .catch(err => console.log(err))
        .then(() => {
            console.log('Finalizando');
            process.exit();
        });
}


module.exports.salvarFavorito = async function(req){
    await client.connect(err => {
        if (err){
            throw err;
        } 
        else {
            let { valor, marca, modelo, ano, combustivel, codigoFipe, mesReferencia, tipoVeiculo, siglaCombustivel} = req;
            
            let query = 'INSERT INTO veiculos (Valor, Marca, Modelo, AnoModelo, Combustivel, CodigoFipe, MesReferencia, TipoVeiculo, SiglaCombustivel) VALUES ' +
                "('"+valor+"', '"+marca.replace("'"," ")+"',  '"+modelo.replace("'"," ")+"', "+ ano+", '"+combustivel.replace("'"," ")+"', '"+codigoFipe.replace("'"," ")+"', "+
                    "'"+mesReferencia.replace("'"," ")+"', "+tipoVeiculo+", '"+siglaCombustivel+"');";

            client
                .query(query)
                .then(() => {
                    console.log('Dados inseridos com sucesso');
                    client.end();
                })
                .catch(err => console.log(err))
                .then(() => {
                    console.log('Finalizando');
                    process.exit();
                });
            }
        });     
}


module.exports.deletarFavorito = async function(codigoFipe){
    await client.connect(err => {
        if (err){
            throw err;
        } 
        else {
        let query = "DELETE FROM veiculos WHERE CodigoFipe like '%"+codigoFipe+"%';";
        
        client
            .query(query)
            .then(() => {
                console.log('Dados removidos com sucesso');
                client.end();
            })
            .catch(err => console.log(err))
            .then(() => {
                console.log('Finalizando');
                process.exit();
            });
        }
    });
}

module.exports.listQuery = (codigoFipe) => {
    return new Promise((resolve, reject)=>{ client.connect(async (err, result) => {
        if (err){
            reject(err);
        } else {
            const query = "SELECT * FROM veiculos WHERE CodigoFipe like '%"+codigoFipe+"%';";
            const a = await new Promise((resolve, reject)=>{ client.query(query, (err, result) => {
                return result ? resolve(result) : reject(err);
             })});
            return resolve(a);
        }
    });
    });
}
