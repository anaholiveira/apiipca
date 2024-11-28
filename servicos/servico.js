import historicoInflacao from '../dados/dados.js';

export const buscarHistorico = () => {
    return historicoInflacao;
}

export const buscarIpcaPorAno = (ano) => {
    return historicoInflacao.filter(anoIpca => anoIpca.ano === ano);
}

export const buscarIpcaPorId = (id) => {
    const idIpca = parseInt(id);
    return historicoInflacao.find(anoIpca => anoIpca.id === idIpca);
}

export const calcularIpca = (anoInicial, mesInicial, anoFinal, mesFinal) => {
    return historicoInflacao.filter(item => {
        const dataItem = new Date(item.ano, item.mes - 1);
        const dataInicio = new Date(anoInicial, mesInicial - 1);
        const dataFim = new Date(anoFinal, mesFinal - 1);
        return dataItem >= dataInicio && dataItem <= dataFim;
    });
};

export const validarParametros = (valor, mesInicial, anoInicial, mesFinal, anoFinal) => {
    if (!valor || isNaN(valor) || typeof valor !== 'number' || valor <= 0) {
        return { valido: false, mensagem: "O parâmetro 'valor' deve ser um número válido." };
    }

    if (anoInicial < 2015 || anoInicial > 2023 || anoFinal < 2015 || anoFinal > 2023) 
        return { valido: false, mensagem: "Os anos devem estar entre 2015 e 2023." };

    if (mesInicial < 1 || mesInicial > 12 || mesFinal < 1 || mesFinal > 12) 
        return { valido: false, mensagem: "Os meses devem estar entre 1 e 12." };

    if ((anoInicial === 2023 && (mesInicial < 1 || mesInicial > 5)) ||
        (anoFinal === 2023 && (mesFinal < 1 || mesFinal > 5))) {
        return { valido: false, mensagem: "Em 2023, os meses devem estar entre 1 e 5." };
    }

    if (new Date(anoInicial, mesInicial - 1) > new Date(anoFinal, mesFinal - 1)) 
        return { valido: false, mensagem: "A data inicial não pode ser posterior à data final." };

    return { valido: true };
};