class Calculator {
    constructor () {
        this.value1 = 0;
        this.value2 = 0;
        this.result = 0;
        this.action = '';
        this.actions = ['+', '-', '*', '/', '%'];
        this.init = true;
        this.maxDisplay = 10;
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

        /* This keeps the result to a fixed size so it doesnt stretch calculator
           a full stop character takes up two px with current font, hence the +2.
           
           We will only set fixed position once the precision length is greater 
           than our limit. */
        let temp = parseInt(this.result).toString();
        let precision = this.result.toString().split(".");

        if (precision.length <= 1) return;

        precision = precision[1].length;
        
        let limit = (this.maxDisplay - (temp.length + 2));

        if (precision > limit) this.result = this.result.toFixed(Math.max(limit, 0));
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

const ogFontSize = window.getComputedStyle(display).fontSize;
const ogLimit = myCalculator.maxDisplay;
let resizeVal = .25;
let resizeStep = .25;

let actionUpdate = (ev, action) => {
    if (!myCalculator.action && myCalculator.actions.includes(action)) {
        myCalculator.value1 = parseFloat(display.innerText);
        myCalculator.action = action;
        myCalculator.init = true;

        ev.target.classList.add('active');

        return;
    }

    if (myCalculator.action && myCalculator.actions.includes(action)) {
        myCalculator.value2 = parseFloat(display.innerText);
        myCalculator.evaluate();
        myCalculator.value1 = myCalculator.result;
        myCalculator.init = true;

        myCalculator.action = action;
        display.innerText = myCalculator.result;

        clearActive();
        ev.target.classList.add('active');

        return;
    }

    if (myCalculator.init) {
        display.innerText = '';
        myCalculator.init = false;
    }

    /* Will resize text on screen to allow more input */ 
    if (display.innerText.length + 1 > myCalculator.maxDisplay) {
        let currentSize = parseInt(ogFontSize.replaceAll('px'));
        let newSize = parseInt(currentSize - (currentSize * resizeVal));

        if (newSize <= 0) return;
         
        let newLimit = parseInt(ogLimit * (1 / (1 - resizeVal)));
        resizeVal = Math.min(resizeVal + resizeStep, 1);

        display.style.fontSize = `${newSize}px`;
        myCalculator.maxDisplay = newLimit;
    }

    display.innerText += action;
};

actions.add.addEventListener('click', (ev) => actionUpdate(ev, '+'));
actions.subtract.addEventListener('click', (ev) => actionUpdate(ev, '-'));
actions.divide.addEventListener('click', (ev) => actionUpdate(ev, '/'));
actions.multiply.addEventListener('click', (ev) => actionUpdate(ev, '*'));
actions.modulo.addEventListener('click', (ev) => actionUpdate(ev, '%'));

for (let option of options) {
    option.addEventListener('click', (ev) => actionUpdate(ev, option.innerText));
}

actions.clear.addEventListener('click', (ev) => {
    myCalculator.clear();
    clearActive();
    display.innerText = myCalculator.result;

    /* Reseting original size values */ 
    display.style.fontSize = ogFontSize;
    myCalculator.maxDisplay = ogLimit;
    resizeVal = resizeStep;
});

actions.equals.addEventListener('click', () => {
    myCalculator.value2 = parseFloat(display.innerText);
    myCalculator.evaluate();
    myCalculator.value1 = myCalculator.result;
    myCalculator.init = true;
    
    myCalculator.action = '';

    clearActive();

    display.innerText = myCalculator.result;
});

actions.plusminus.addEventListener('click', () => {
    let temp = display.innerText;
    
    if (myCalculator.actions.includes(temp)) return;

    temp = parseFloat(temp) * -1;
    display.innerText = temp;
});

function clearActive () {
    let activeActions = Array.from(document.querySelectorAll('.action.active'));
    if (activeActions) activeActions.forEach(action => action.classList.remove('active'));
}