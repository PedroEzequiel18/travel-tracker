//1.Captura de elemento do DOM
const inputDesc = document.querySelector("#desc-despesa");
const inputValor = document.querySelector("#valor-gringo");
const inputCotacao = document.querySelector("#cotacao");
const btnAdicionar = document.querySelector("#btn-adicionar");
const listaDespesasDOM = document.querySelector("#lista-despesas");
const totalBrlDOM = document.querySelector("#total-brl");

// 2. Estado da Aplicação (Array de Objetos)
let despesas = JSON.parse(localStorage.getItem("viagem_despesas")) || [];

// 3. Função para persistir dados
const salvarNoLocalStorage = () => {
  // O LocalStorage só aceita textos (Strings).
  // O JSON.stringify converte nosso Array em formato de texto.
  localStorage.setItem("viagem_despesas", JSON.stringify(despesas));
};

const adicionarDespesa = () => {
  //O método .trim() remove espaços em branco acidentais no início e no fim do texto.
  const desc = inputDesc.value.trim();
  // parseFloat converte o texto digitado no input para um número decimal nativo do JS.
  const valorOriginal = parseFloat(inputValor.value);
  const cotacao = parseFloat(inputCotacao.value);

  //validação de dados (Condicional)
  if (desc === "" || isNaN(valorOriginal) || isNaN(cotacao)) {
    alert(
      "Por favor, preencha todos os campos corretamente com valores válidos.",
    );
    return; //Interrompe a execução da função imediatamente.
  }
  // Processamento Lógico (Operador Aritmético)
  const valorConvertidoBRL = valorOriginal * cotacao;
  // Estrutura de Dados: Criando um Objeto para representar uma única despesa
  const novaDespesa = {
    id: Date.now(), // Gera um número único baseado nos milissegundos atuais para identificar o item
    descricao: desc,
    valorEstrangeiro: valorOriginal,
    valorReal: valorConvertidoBRL,
  };
  // Modificando o Array e salvando
  despesas.push(novaDespesa);
  salvarNoLocalStorage();

  // Limpeza da Interface
  inputDesc.value = "";
  inputValor.value = "";
  inputCotacao.value = "";

  atualizarTela();
};

btnAdicionar.addEventListener("click", adicionarDespesa);

const removerDespesa = (id) => {
  despesas = despesas.filter((item) => item.id !== id);
  salvarNoLocalStorage();
  atualizarTela();
};

const atualizarTela = () => {
  // 1. Gerando os itens da lista usando o método .map()
  // O map percorre o Array e retorna um novo Array contendo os blocos de HTML.

  const htmlDaLista = despesas.map((item) => {
    return `
            <li>
                <div>
                    <strong>${item.descricao}</strong> <br/>
                    <small> U$ ${item.valorEstrangeiro.toFixed(2)}</small>  
                </div>
                <span class="valor">R$ ${item.valorReal.toFixed(2)}</span>
                <button class="btn-excluir" data-id="${item.id}">X</button>
            </li>  
            `;
  });
  // O .join('') une todos os blocos gerados pelo map em um único texto contínuo,
  // que é então injetado na tag <ul> do nosso HTML.
  listaDespesasDOM.innerHTML = htmlDaLista.join("");

  document.querySelectorAll(".btn-excluir").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      removerDespesa(id);
    });
  });
  // 2. Calculando o Total usando o método .forEach()
  let somaTotal = 0;
  // O forEach executa uma função para cada item, somando o valorReal à nossa variável
  despesas.forEach((item) => {
    somaTotal += item.valorReal;
  });
  // Atualizando o elemento de texto no cabeçalho
  totalBrlDOM.textContent = `R$ ${somaTotal.toFixed(2)}`;
};

atualizarTela();
