var serviceCarros = require('../services_carros');
const express = require('express');
const app = express();
var router = express.Router();

var db = require('../db');
const ENDPOINT= 'https://parallelum.com.br/fipe/api/v1/';


router.get("/listarVeiculos", async function(req, res, next) {

    try{
        let payload = [
            "carros",
            "motos",
            "caminhoes"
        ];
       
        res.status(200).json({
            status: "Sucesso",
            data: payload,
            numero_veiculos: payload.length
        });
        
    } catch (e){
        res.status(500).json({
            status: "Api fail",
            status_code: e.response.status,
            message: e.message
        });
    }
});

router.get("/listarMarcas/:veiculo", async function(req, res, next) {
    let veiculo = req.params.veiculo;
    try{
        let url = ENDPOINT + veiculo + '/marcas';
        let response = await serviceCarros.requestGet(url);

        res.status(200).json({
            status: "Sucesso",
            data: response.data
        });
        
    } catch (e){
        res.status(500).json({
            status: "Api fail",
            status_code: e.response.status,
            message: e.message
        });
    }
});

router.get("/listarModelos/:veiculo/:numero", async function(req, res, next) {
    let { veiculo, numero } = req.params;

    try{
        let url = ENDPOINT + veiculo + '/marcas/' + numero + '/modelos';
        let response = await serviceCarros.requestGet(url);

        res.status(200).json({
            status: "Sucesso",
            data: response.data.modelos
        });

    } catch (e){
        res.status(500).json({
            status: "Api fail",
            status_code: e.response.status,
            message: e.message
        });
    }
});

router.get("/listarAnos/:veiculo/:numero/:codigo", async function(req, res, next) {
    let { veiculo, numero, codigo} = req.params;

    try{
        let url = ENDPOINT + veiculo + '/marcas/' + numero + '/modelos/' + codigo + '/anos';
        let response = await serviceCarros.requestGet(url);

        res.status(200).json({
            status: "Sucesso",
            data: response.data
        });

    } catch (e){
        res.status(500).json({
            status: "Api fail",
            status_code: e.response.status,
            message: e.message
        });
    }
});

router.get("/listarValor/:veiculo/:numero/:codigo/:codigoValor", async function(req, res, next) {
    let { veiculo, numero, codigo, codigoValor} = req.params;

    try{
        let url = ENDPOINT + veiculo + '/marcas/' + numero + '/modelos/' + codigo + '/anos/' + codigoValor;
        let response = await serviceCarros.requestGet(url);

        res.status(200).json({
            status: "Sucesso",
            data: response.data
        });

    } catch (e){
        res.status(500).json({
            status: "Api fail",
            status_code: e.response.status,
            message: e.message
        });
    }
});

router.post("/salvarVeiculoFavorito", async function(req, res, next) {

    try{
        let response = await db.salvarFavorito(req.body);

        res.status(200).json({
            status: "Sucesso"
        });

    } catch (e){
        res.status(500).json({
            status: "Api fail",
            message: e.message
        });
    }
});

router.get("/deletarVeiculoFavorito/:codigoFipe", async function(req, res, next) {
    let codigoFipe = req.params.codigoFipe;
    try{
        let response = await db.deletarFavorito(codigoFipe);

        res.status(200).json({
            status: "Sucesso"
        });

    } catch (e){
        res.status(500).json({
            status: "Api fail",
            message: e.message
        });
    }
});

router.get("/listarVeiculoFavorito/:codigoFipe", async (req, res, next) => {
    let codigoFipe = req.params.codigoFipe;
    try{
        let response = await db.listQuery(codigoFipe);
        res.status(200).json({
            status: "Sucesso",
            data: response.rows
        });

    } catch (e){
        res.status(500).json({
            status: "Api fail",
            message: e.message
        });
    }
});

router.post("/compararVeiculos", async function(req, res, next) {
    let vetor = req.body.vetor;
    let lista = [];
    let listaMax = [];
    let listaMin = [];
    //considerar inserção tipo, marca, modelo, ano, valor
    try{
        vetor.forEach(element => {
            let valor = parseFloat((element.valor).substr(3, (element.valor).length));
            lista.push(valor);
        });

        var max = lista.reduce(function(a, b) {
            return Math.max(a, b);
        });

        var min = lista.reduce(function(a, b) {
            return Math.min(a, b);
        });

        vetor.forEach(element => {
            let elemento = parseFloat((element.valor).substr(3, (element.valor).length)); 

            if (elemento == max){
                listaMax.push(element); //caso tenha mais de um com valor máximo igual
            }
            if (elemento == min){
                listaMin.push(element); //caso tenha mais de um com valor mínimo igual
            }
        });

        res.status(200).json({
            status: "Sucesso",
            maisCaro: listaMax,
            maisBarato: listaMin
        });

    } catch (e){
        res.status(500).json({
            status: "Api fail",
            status_code: 500,
            message: e.message
        });
    }
});

module.exports = router;
