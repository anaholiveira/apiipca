import express from 'express';
import { buscarHistorico, buscarIpcaPorAno, buscarIpcaPorId, calcularIpca, validarParametros } from './servicos/servico.js';

const app = express();

app.get('/historicoIPCA', (req, res) => {
    const ano = parseInt(req.query.ano);
    const anoIpca = ano ? buscarIpcaPorAno(ano) : buscarHistorico();
    if (anoIpca.length > 0) {
        res.json(anoIpca);
    } else {
        res.status(404).send({ "erro": "Nenhum histórico encontrado para o ano especificado." });
    }
});

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = req.query.valor ? parseFloat(req.query.valor) : NaN; 
    const mesInicial = parseInt(req.query.mesInicial);
    const anoInicial = parseInt(req.query.anoInicial);
    const mesFinal = parseInt(req.query.mesFinal);
    const anoFinal = parseInt(req.query.anoFinal);

    const validacao = validarParametros(valor, mesInicial, anoInicial, mesFinal, anoFinal);
    if (!validacao.valido) {
        return res.status(400).send({ "erro": validacao.mensagem });
    }

    const ipcaTempo = calcularIpca(anoInicial, mesInicial, anoFinal, mesFinal);

    if (ipcaTempo.length === 0) {
        return res.status(404).send({ "erro": "Nenhum dado IPCA encontrado para o período especificado." });
    }

    let valorFinal = valor;
    ipcaTempo.forEach((mesIpca) => {
        valorFinal *= (1 + mesIpca.ipca / 100);
    });

    res.json({
        Resultado: valorFinal.toFixed(2)
    });
});

app.get('/historicoIPCA/:id', (req, res) => {
    const anoIpca = buscarIpcaPorId(req.params.id);
    if (anoIpca) {
        res.json(anoIpca);
    } else {
        res.status(404).send({ "erro": "Elemento não encontrado." });
    }
});

app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080');
});