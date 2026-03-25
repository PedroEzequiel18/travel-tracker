// 1. Captura de elementos do DOM
const inputDesc = document.querySelector('#desc-despesa');
const inputValor = document.querySelector('#valor-gringo');
const inputCotacao = document.querySelector('#cotacao');
const btnAdicionar = document.querySelector('#btn-adicionar');
const listaDespesasDOM= document.querySelector('#lista-despesas');
const totalBrlDOM = document.querySelector('#total-brl');

// 2. Estado de Aplicação (Array de Objetos)
// Tentamos buscar dados salvos previamente. Se não houver, iniciamos um Array vazio [].
let despesas = JSON.parse(localStorage.getItem('viagem_despesas')) || [];

// 3. Função para persistir dados 
const salvatNoLocaStorage = () => {
    //O LocalStorage só aceita textos (Strings).
    // O JSON.stringify converte nosso Array em formato de texto.
    localStorage.setItem('viagem_despesas', JSON.stringify(despesas));
};

const adicionarDespesa = () => {
    // O método .trim() remove espaços em branco acidentais no início e no fim do texto.
    const desc = inputDesc.value.trim();

    // parseFloat converte o texto digitado no input para um número decimal nativo do JS.
    const valorOriginal = parseFloat(inputValor.value);
    const cotacao = parseFloat(inputCotacao.value)

    //Validação de Dados (Condicional)
        // isNaN significa "Is Not a Number" (Não é um número)c Verfifica se a conversão falhou.
        if (desc === "" || isNaN(valorOriginal)  || isNaN(cotacao)) {
            alert("Por favor, preencha todos os campos corretacente com valores válidos.");
            return; // Interrompe a execuão da função imediatamente.
        }

        // Processamento Lógico (Operador Aritmético)
        const valorConvertidoBRL = valorOriginal * cotacao;

        //Estrutura de Dados: Criando um Objeto para representar uma única despesa
        const novaDespesa = {
            id: Date.now(), // Gera um número único baseado nos milissegundos atuais para identificar o item
            descricao: desc,
            valorEstrangeiro: valorOriginal,
            valorReal: valorConvertidoBRL
        };

        // Modificando o Array e salvando
        despesas.push(novaDespesa);
        salvatNoLocaStorage();

        //Limpeza da Interface
        inputDesc.value = "";
        inputValor.value = "";
        inputCotacao.value = "";

        // Chama a função que vai desenhar a lista na tela (que criaremos no próximo passo)
        atualizarTela();
};

// Vinculando a ação ao clique do botão
btnAdicionar.addEventListener('click', adicionarDespesa)

const atualizarTela = () => {
    // 1. Gerando os itens da lista usando o metódo .map()
     // O map percorre o Arrray e retorna um novo Array contendo os blocos de HTML.
     const htmlDalista = despesas.map(item => {
        // O metódo .toFixed(2) garante a exibição com duas casas decimais.
        return`
        <li>
            <div>
                <strong>${item.descricao}</strong> <br>
                <small>U$ ${itemvalorReal.toFixed(2)}</small>
                 </div>
                 <span class="valor">R$ ${item.valorReal.toFixed(2)}</span>
        </li>
        `;
     });

     // .join('') une todos os blocos geraados pelo map em um único texto contínuo,
     // que é então injetado na tag <ul> do nosso HTML.
     listaDespesasDOM.innerHTML = htmlDaLista.join('');


    // 2. Calculando o total usando o metódo .forEach()
    let somaTotal = 0;

    //O forEach eexecuta uma função para item, somando o valorReal á nossa variável.
    despesas.forEach(item => {
        somaTotal += item.valorReal; // Equivalente a: somaTotal = somaTotal + item.valorReal
    });

    // Atualizando o elemento de texto no cabeçalho
    totalBrlDOM.textContent = 'R$ ${somaTotal.toFixed(2)}';
};

// Execução Inicial: Chamamos a função assim que o script carrega para
renderizar
// dados antigos que já possam estar salvos no LocalStorage.
atualizarTela();
