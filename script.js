class Calculator {
    constructor () {
        this.value1 = 0;
        this.value2 = 0;
        this.result = 0;
        this.action = '';
        this.actions = ['+', '-', '*', '/', '%'];
        this.init = true;
        this.maxDisplay = 13;
    }

    static add (a, b) {
        return a + b;
    }

    static subtract (a, b) {
        return a - b;
    }

    static multiply (a, b) {
        return a * b;
    }

    static divide (a, b) { 
        return a / b;
    }

    static modulo (a, b) {
        return a % b;
    }

    static action (char, a, b) {
        switch (char) {
            case '+':
                return Calculator.add(a, b);
            case '-':
                return Calculator.subtract(a, b);
            case '*':
                return Calculator.multiply(a, b);
            case '/':
                return Calculator.divide(a, b);
            case '%':
                return Calculator.modulo(a, b);
        }
    }

    evaluate () {
        this.result = Calculator.action(this.action, this.value1, this.value2);
    }

    clear() {
        this.value1 = 0;
        this.value2 = 0;
        this.result = 0;
        this.action = '';
        this.init = true;
    }
}

const actions = document.getElementsByClassName('action');
const options = document.getElementsByClassName('option');
const display = document.getElementById('display');

let myCalculator = new Calculator();

let actionUpdate = (action) => {
    if (myCalculator.action === '' && myCalculator.actions.includes(action)) {
        myCalculator.value1 = parseFloat(display.innerText);
        myCalculator.action = action;
        myCalculator.init = true;
        display.innerText = action;
        return;
    }

    if (myCalculator.init) {
        display.innerText = '';
        myCalculator.init = false;
    }

    display.innerText += action;
};

actions.add.addEventListener('click', () => actionUpdate('+'));
actions.subtract.addEventListener('click', () => actionUpdate('-'));
actions.divide.addEventListener('click', () => actionUpdate('/'));
actions.multiply.addEventListener('click', () => actionUpdate('*'));
actions.modulo.addEventListener('click', () => actionUpdate('%'));

for (let option of options) {
    option.addEventListener('click', () => actionUpdate(option.innerText));
}

actions.clear.addEventListener('click', (ev) => {
    myCalculator.clear();
    display.innerText = myCalculator.result;
});

actions.equals.addEventListener('click', () => {
    myCalculator.value2 = parseFloat(display.innerText);
    myCalculator.evaluate();
    myCalculator.value1 = myCalculator.result;
    myCalculator.init = true;
    myCalculator.action = '';

    display.innerText = myCalculator.result;
});

actions.plusminus.addEventListener('click', () => {
    let temp = display.innerText;
    
    if (myCalculator.actions.includes(temp)) return;

    temp = parseFloat(temp) * -1;
    display.innerText = temp;
});