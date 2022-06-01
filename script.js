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

        if (!this.result) return;

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

document.addEventListener('keydown', keyboardInput);

/* Add ids to number keys */
let numbers = Array.from(options);
numbers.forEach(option => {
    let temp = parseInt(option.innerText);
    if (!temp && temp !== 0) return;
    option.id = temp.toString();
});

let actionUpdate = (ev, action) => {
    // Resize font will return  1 if resize needed and possible
    //             will return  0 if resize not needed
    //             will return -1 if resize needed and not possible
    //
    // in which case we ignore further input if its not an action
    // or second input
    if (resizeFont() < 0 && 
        !myCalculator.actions.includes(action) &&
        !myCalculator.action) return;

    if (!myCalculator.action && myCalculator.actions.includes(action)) {
        myCalculator.value1 = parseFloat(display.innerText);
        myCalculator.action = action;
        myCalculator.init = true;

        if (!ev.target.classList.contains('special'))
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

        if (!ev.target.classList.contains('special'))
            ev.target.classList.add('active');

        return;
    }

    if (myCalculator.init) {
        display.innerText = '';
        myCalculator.init = false;
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

actions.clear.addEventListener('click', clear);

actions.equals.addEventListener('click', () => {
    if (!myCalculator.value1) return;
    
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

function backspace () {
    let disp = display.innerText;
    let temp = Array.from(disp);

    if (temp.length > 1) {
        temp.pop();
        disp = temp.join('');
    } else {
        disp = '0';
        myCalculator.init = true;
    }

    display.innerText = disp;
}

function clear() {
    myCalculator.clear();
    clearActive();
    display.innerText = myCalculator.result;

    /* Reseting original size values */ 
    display.style.fontSize = ogFontSize;
    myCalculator.maxDisplay = ogLimit;
    resizeVal = resizeStep;
}

function keyboardInput (ev) {
    let temp = parseInt(ev.key);

    if (isNaN(temp)) {
        switch(ev.key) {
            case 'Backspace':
                backspace();
                break;
            case 'Escape':
                clear();
                break;
            case '+':
                actions.add.dispatchEvent(new Event('click'));
                break;
            case '-':
                actions.subtract.dispatchEvent(new Event('click'));
                break;
            case '/':
                actions.divide.dispatchEvent(new Event('click'));
                break;
            case '*':
                actions.multiply.dispatchEvent(new Event('click'));
                break;
            case '%':
                actions.modulo.dispatchEvent(new Event('click'));
                break;
            case '=':
            case 'Enter':
                actions.equals.dispatchEvent(new Event('click'));
                break;
            default:
                // If not handled then ignore key input
                //console.log(`unhandled key: ${ev.key}`);
                break;
        }
        return;
    } else {
        let option = document.getElementById(temp.toString());
        option.dispatchEvent(new Event('click'));
    }
}

function resizeFont() {
    /* Will resize text on screen to allow more input */ 
    if (display.innerText.length + 1 > myCalculator.maxDisplay) {
        let currentSize = parseInt(ogFontSize.replaceAll('px'));
        let newSize = parseInt(currentSize - (currentSize * resizeVal));

        if (newSize <= 0) return -1;
         
        let newLimit = parseInt(ogLimit * (1 / (1 - resizeVal)));
        resizeVal = Math.min(resizeVal + resizeStep, 1);

        display.style.fontSize = `${newSize}px`;
        myCalculator.maxDisplay = newLimit;
        return 1;
    }
    return 0;
}