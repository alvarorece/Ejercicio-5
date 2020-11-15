class Stack {
    constructor() {
        this._store = [];
    }
    get length() {
        return this._store.length;
    }
    push(element) {
        this._store.push(element);
    }
    pop() {
        return this._store.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this._store.length == 0;
    }
    toString() {
        if (this.isEmpty())
            return '';
        return this._store.reduce((acc, currentValue) => acc + '\n' + currentValue);
    }
}

class CalculadoraRPN {
    constructor() {
        this._stack = new Stack();
    }
    enterNumber(n) {
        const number = Number.parseFloat(n);
        if (isNaN(number))
            throw new Error('Number error');
        this._stack.push(number);
    }
    runFunction(f) {
        const arity = f.length;
        if (this._stack.length < arity)
            throw new Error('Not enough arguments provided');
        const argumentList = [];
        for (let i = 0; i < arity; i++) {
            argumentList.push(this._stack.pop());
        }
        const result = f(...argumentList);
        if (Symbol.iterator in Object(result))
            this._stack.push(...result);
        return result;
    }
    static add(y, x) {
        return x + y;
    }
    static substract(y, x) {
        return x - y;
    }
    static multiply(y, x) {
        return x * y;
    }
    static divide(y, x) {
        return x / y;
    }
    static pow(y, x) {
        return x ** y;
    }
    static sqrt(x) {
        return Math.sqrt(x);
    }
    static mod(y, x) {
        return x % y;
    }
    static abs(x) {
        return Math.abs(x);
    }
    static neg(x) {
        return -x;
    }
    static sin(x) {
        return Math.sin(x);
    }
    static cos(x) {
        return Math.cos(x);
    }
    static tan(x) {
        return Math.tan(x);
    }
    static asin(x) {
        return Math.asin(x);
    }
    static acos(x) {
        return Math.acos(x);
    }
    static atan(x) {
        return Math.atan(x);
    }
    static log(y, x) {
        return Math.log10(y) / Math.log10(x);
    }
}

class Controller {
    constructor(pantalla, input, calculadora = new CalculadoraRPN()) {
        this.calculadora = calculadora;
        this.element = pantalla;
        this.input = input;
        this.pantalla = pantalla;
        this.nextRemove = true;
        this.input.value = 0;
    }
    writeToScreen(s) {
        if (this.nextRemove) {
            this.input.value = s;
            this.nextRemove = false;
        }
        else
            this.input.value += s;
    }
    deleteLastScreen() {
        this.input.value = this.input.value.splice(-1, 1);
    }
    clearScreen() {
        this.input.value = 0;
        this.nextRemove = true;
    }
    enter() {
        try {
            this.calculadora.enterNumber(this.input.value);
        }
        catch (error) {
            this.input.value = error.toString();
            this.nextRemove = true;
        }
        this.updateViewPantalla();
    }
    run(f) {
        try {
            const result = this.calculadora.runFunction(f);
            this.input.value = result;
        }
        catch (error) {
            this.input.value = error.toString();
            this.nextRemove = true;
        }
        this.updateViewPantalla();
    }
    updateViewPantalla() {
        this.pantalla.value = this.calculadora._stack.toString();
    }
}

// eslint-disable-next-line no-unused-vars
const controller = new Controller(document.getElementById('pantalla'), document.getElementById('input'));