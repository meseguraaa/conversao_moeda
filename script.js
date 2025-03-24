const form = document.querySelector("form");
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const footer = document.querySelector("main footer");
const description = document.getElementById("description");
const result = document.getElementById("result");

// PEGA OS VALORES ATUAIS DAS MOEDAS NA COTAÇÃO DO DIA
const API_KEY = '6f77f263fc8de92dcbe0827e';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/BRL`;

let exchangeRates = {}; // Objeto para armazenar as taxas de câmbio

// BUSCA AS TAXAS DE CÂMBIO E ARMAZENA EM exchangeRates
async function fetchExchangeRates() {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        exchangeRates = data.conversion_rates; // Atualiza os valores dinâmicos
    } catch (error) {
        console.error('Erro ao buscar taxas de câmbio:', error);
        alert("Não foi possível obter as cotações atuais.");
    }
}

// CHAMA A FUNÇÃO PARA BUSCAR AS TAXAS DE CÂMBIO QUANDO A PÁGINA CARREGAR
fetchExchangeRates();

// PEGA O VALOR DO CAMPO E VALIDA QUE É NÚMERO
amount.addEventListener("input", () => {
    const hasCharactersRegex = /\D+/g;
    amount.value = amount.value.replace(hasCharactersRegex, "");
});

// QUANDO O USUÁRIO ENVIA O FORMULÁRIO
form.onsubmit = (event) => {
    event.preventDefault();

    const selectedCurrency = currency.value;
    if (exchangeRates[selectedCurrency]) {
        convertCurrency(amount.value, exchangeRates[selectedCurrency], selectedCurrency);
    } else {
        alert("Moeda não suportada ou erro na obtenção das taxas.");
    }
};

// CONVERTE A MOEDA
function convertCurrency(amount, rate, symbol) {
    try {
        const correctedRate = 1 / rate;

        // ATUALIZA A DESCRIÇÃO COM A TAXA CORRETA
        description.textContent = `${symbol} 1 = ${formatCurrencyBRL(correctedRate)}`;

        // CALCULA O TOTAL E FORMATA COM PONTO NOS MILHARES
        let total = (amount / rate).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        result.textContent = `${total} Reais`;

        // EXIBE O RESULTADO EM UMA CLASSE
        footer.classList.add("show-result");
    } catch (error) {
        // OCULTA O RESULTADO EM UMA CLASSE
        footer.classList.remove("show-result");
        alert("Não foi possível converter.");
    }
}

// FORMATA O VALOR NO PADRÃO BRASILEIRO
function formatCurrencyBRL(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
