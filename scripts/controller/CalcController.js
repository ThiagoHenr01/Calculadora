class CalcController {

    constructor() { // Início do Método de construção da calculadora.

        // Início dos Atributos

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        // Fim dos Atributos

        // Início dos Métodos

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

        // Fim dos Métodos

    } // Fim do Método de construção da calculadora.

    pasteFromClipboard() { // Início do Método que é o funcionamento do Ctrl V.

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });

    } // Fim do Método que é o funcionamento do Ctrl V.

    copyToClipBoard() { // Início do Método que é o funcionamento do Ctrl C.

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    } // Fim do Método que é o funcionamento do Ctrl C.

    initialize() { // Início do Método de inicialização da calculadora.

        this.setDisplayDateTime();

        this.setLastNumberToDisplay();

        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });

        });

    } // Fim do Método de inicialização da calculadora.

    toggleAudio() {  // Início do Método para saber se o áudio está ligado/desligado.

        this._audioOnOff = !this._audioOnOff;

    } // Fim do Método para saber se o áudio está ligado/desligado.

    playAudio() { // Início do Método para executar / tocar o aúdio do click na calculadora.

        if(this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }

    } // Fim do Método para executar / tocar o aúdio do click na calculadora.

    initKeyboard() { // Início do Método para pegar os eventos do teclado.

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch(e.key) {

                case 'Escape':
    
                    this.clearAll();
    
                    break;
    
                case 'Backspace':
    
                    this.clearEntry();
    
                    break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
    
                    this.addOperation(e.key);
    
                    break;
    
                case 'Enter':
                case '=':
    
                    this.calc();
    
                    break;
    
                case '.':
                case ',':
    
                    this.addDot();
    
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
    
                    this.addOperation(parseInt(e.key));
    
                    break;

                case 'c':

                    if(e.ctrlKey) this.copyToClipBoard();

                    break;
    
            }

        });

    } // Fim do Método para pegar os eventos do teclado.

    addEventListenerAll(element, events, fn){ // Início do Método para suportar mais de um eventos para os botões.

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });

    } // Fim do Método para suportar mais de um eventos para os botões.

    clearAll(){ // Início do Método para limpar todas as informações armazenadas na calculadora.

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    } // Fim do Método para limpar todas as informações armazenadas na calculadora.

    clearEntry(){ // Início do Método para limpar a última informação armazenada na calculadora.

        this._operation.pop();

        this.setLastNumberToDisplay();

    } // Fim do Método para limpar a última informação armazenada na calculadora.

    getLastOperation() { // Início do Método para pegar a última posição do Array. 

        return this._operation[this._operation.length - 1];

    }  // Fim do Método para pegar a última posição do Array.

    setLastOperation(value) { // Início do Método para substituir o último valor que foi informado.  

        this._operation[this._operation.length - 1] = value;

    } // Fim do Método para substituir o último valor que foi informado. 

    isOperator(value) { // Início do Método para verificar se o que foi digitado é um operador ou não.

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1); // O indexOf irá procurar se o valor digitado está dentro desse Array. Caso não esteja, retornará -1.

    } // Fim do Método para verificar se o que foi digitado é um operador ou não.

    pushOperation(value) { // Início do Método para verificar se tem mais de 3 elementos armazenados.

        this._operation.push(value);

        if(this._operation.length > 3) {

            this.calc();

        }

    } // Fim do Método para verificar se tem mais de 3 elementos armazenados.

    getResult() { // Início do Método para retornar o eval das operações.

        try {

            return eval(this._operation.join(""));

        } catch(e) {

            setTimeout(() => {

                this.setError();

            }, 1);
            
        }

    } // Fim do Método para retornar o eval das operações.
 
    calc() { // Início do Método responsável por calcular a operação atual.

        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if(this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == '%') { // IF para o uso do botão porcento (%)

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        } // Fim do IF para o uso do botão porcento (%)

        this.setLastNumberToDisplay();

    } // Fim do Método responsável por calcular a operação atual.

    getLastItem(isOperator = true) { // Início do Método para pegar o último item da calculadora.

        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--) {

            if(this.isOperator(this._operation[i]) == isOperator) {

                lastItem = this._operation[i];
                break;

            }

        }

        if(!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    } // Fim do Método para pegar o último item da calculadora.

    setLastNumberToDisplay() { // Início do Método responsável por mostrar o último valor no display da calculadora.

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    } // Fim do Método responsável por mostrar o último valor no display da calculadora. 

    addOperation(value){ // Início do Método para adicionar uma operação na calculadora.

        if(isNaN(this.getLastOperation())) { // IF para saber se o último item digitado é um número ou não.

            // Aqui serão as Strings. Os sinais.

            if(this.isOperator(value)) { // IF para saber se tem que haver uma troca nos operadores.

                // Aqui troca o operador já digitado.

                this.setLastOperation(value);

            } else { // Caindo aqui, é a possível certeza de ser o primeiro número que foi digitado.

                this.pushOperation(value);

                this.setLastNumberToDisplay();

            } // Fim do IF para saber se tem que haver uma troca nos operadores.

        } else {

            if(this.isOperator(value)) { // IF para saber se o valor de agora é um operador.

                this.pushOperation(value);

            } else {

                // Aqui serão os números.

                let newValue = this.getLastOperation().toString() + value.toString(); 
                this.setLastOperation((newValue));

                this.setLastNumberToDisplay();

            } // Fim do IF para saber se o valor de agora é um operador.

        } // Fim do IF para saber se o último item digitado é um número ou não.

    } // Fim do Método para adicionar uma operação na calculadora.

    setError(){ // Início do Método para mostrar a mensagem de erro na calculadora.

        this.displayCalc = "ERROR";

    } // Fim do Método para mostrar a mensagem de erro na calculadora.

    addDot() { // Início do Método para usar o ponto (".") na calculadora.

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');

        } else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();

    } // Fim do Método para usar o ponto (".") na calculadora.

    execBtn(value) { // Início do Método para executar as ações dos botões.

        this.playAudio();

        switch(value) {

            case 'ac':

                this.clearAll();

                break;

            case 'ce':

                this.clearEntry();

                break;

            case 'soma':

                this.addOperation('+');

                break;

            case 'subtracao':

                this.addOperation('-');

                break;

            case 'divisao':

                this.addOperation('/');

                break;

            case 'multiplicacao':

                this.addOperation('*');

                break;

            case 'porcento':

                this.addOperation('%');

                break;

            case 'igual':

                this.calc();

                break;

            case 'ponto':

                this.addDot();

                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':

                this.addOperation(parseInt(value));

                break;

            default:

                this.setError();

            break;

        }

    } // Fim do Método para executar as ações dos botões.

    initButtonsEvents(){ // Início do Método para os eventos dos botões.

       let buttons = document.querySelectorAll("#buttons > g, #parts > g");

       buttons.forEach((btn, index) => {

        this.addEventListenerAll(btn, "click drag", e => {

            let textBtn = btn.className.baseVal.replace("btn-", "");

            this.execBtn(textBtn);

        });

        this.addEventListenerAll(btn, "mouseover mousedown mouseup", e => {

            btn.style.cursor = "pointer";

        });

       });

    } // Fim do Método para os eventos dos botões.

    setDisplayDateTime(){ // Início do Método de inicialização de mostrar Data e Hora.

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {

            day: "2-digit",
            month: "short",
            year: "numeric"

        });

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    } // Fim do Método de inicialização de mostrar Data e Hora.

    // Início dos getters e setters

    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value){

        this._timeEl.innerHTML = value;

    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        this._dateEl.innerHTML = value;

    }

    get displayCalc() {

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value) {

        if(value.toString().length > 10) {

            this.setError();
            return false;

        }

        this._displayCalcEl.innerHTML = value;

    }

    get currentDate() {

        return new Date();

    }

    set currentDate(value) {

        this.currentDate = value;

    }

    // Fim dos getters e setters

}