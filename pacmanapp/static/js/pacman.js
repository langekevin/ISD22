/**
 * Event listener for the canvas for pacman that creates the game
 */
window.addEventListener('load', () => {
    const canvas = document.querySelector("#pacman-canvas");
    const ctx = canvas.getContext("2d");

    // Resizing
    const container = document.querySelector("#pacman-container");
    let size = (container.offsetWidth - CANVAS_OFFSET_X * 2) / 30;
    canvas.setAttribute("width", (size * 30) + "px");
    canvas.setAttribute("height", (size * 33) + 75 + "px");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Initialize Pacman game
    const pacman = new Pacman(ctx, canvas, size);
    pacman.init();
});

/**
 * Class for the map of the pacman game
 */
class Map {
    constructor(blockSize) {
        this.blockSize = blockSize;
        this.mapArray = MAP_ARRAY;
        this.pizzaImage = new Image();
        this.cakeImage = new Image();

        this.pizzaImage.src = "static/images/pizza.svg";
        this.cakeImage.src = "static/images/cake.svg";
    }

    drawPills(ctx) {
        ctx.strokeStyle = '#0033da';
        ctx.lineWidth = 3;

        for (let i = 0; i < LINES.length; i++) {
            let line = LINES[i];
            ctx.beginPath();

            for (let j = 0; j < line.length; j++) {
                let move = line[j];
                if (move.move) {
                    ctx.moveTo(move.move[0] * this.blockSize + CANVAS_OFFSET_X, move.move[1] * this.blockSize + CANVAS_OFFSET_Y);
                } else if (move.line) {
                    ctx.lineTo(move.line[0] * this.blockSize + CANVAS_OFFSET_X, move.line[1] * this.blockSize + CANVAS_OFFSET_Y);
                } else if (move.curve) {
                    ctx.quadraticCurveTo(
                        move.curve[0] * this.blockSize + CANVAS_OFFSET_X,
                        move.curve[1] * this.blockSize + CANVAS_OFFSET_Y,
                        move.curve[2] * this.blockSize + CANVAS_OFFSET_X,
                        move.curve[3] * this.blockSize + CANVAS_OFFSET_Y
                    );
                }
            }
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(80,80,80,0.79)';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(13.55 * this.blockSize, 13.75 * this.blockSize + CANVAS_OFFSET_Y);
        ctx.lineTo(16.45 * this.blockSize, 13.75 * this.blockSize + CANVAS_OFFSET_Y);
        ctx.stroke();

        this.drawPoints(ctx);
    }

    /**
     * Function draws the pizza slices and cakes on the map according to the
     * placements in mapArray.
     * @param ctx Context of the canvas object
     */
    drawPoints(ctx) {
        for (let y = 0; y < this.mapArray.length; y++) {
            for (let x = 0; x < this.mapArray[y].length; x++) {
                if (this.mapArray[y][x] === MAP_ELEMENTS.ITEM) {
                    ctx.drawImage(this.pizzaImage, (x + 0.3) * this.blockSize, (y + 0.3) * this.blockSize + CANVAS_OFFSET_Y, 10, 10);
                } else if (this.mapArray[y][x] === MAP_ELEMENTS.BIG_ITEM) {
                    ctx.drawImage(this.cakeImage, (x + 0.1) * this.blockSize, y * this.blockSize + CANVAS_OFFSET_Y, 16, 16);
                }
            }
        }
    }

    /**
     * Resets the map and inserts the new background of the game
     * @param ctx Context of the canvas object
     * @param canvas Canvas object
     */
    resetCanvas(ctx, canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        // Create the new background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
    }

    /**
     * Resets the placed items in the map
     */
    resetPlacedItems() {
        this.mapArray = MAP_ARRAY;
    }

    /**
     * Checks if there is a placed item on the current location and removes it
     * if possible.
     * @param {Position} position Current position of the player
     * @return {number} Value of the item that was removed. 0 if no item was removed
     */
    isPlacedItem(position) {
        if (!Helpers.almostInteger(position.x) && Helpers.almostInteger(position.y)) {
            return 0;
        }

        let x = Math.round(position.x);
        let y = Math.round(position.y);
        if (this.mapArray[y][x] === MAP_ELEMENTS.ITEM) {
            this.mapArray[y][x] = MAP_ELEMENTS.EMPTY;
            return MAP_ELEMENTS.ITEM;
        } else if (this.mapArray[y][x] === MAP_ELEMENTS.BIG_ITEM) {
            this.mapArray[y][x] = MAP_ELEMENTS.EMPTY;
            return MAP_ELEMENTS.BIG_ITEM;
        }
        return 0;
    }
}

/**
 * Class position describes the current position of a player or a ghost on the map
 */
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(newX) {
        this._x = newX;
    }

    set y(newY) {
        this._y = newY;
    }
}

/**
 * Class for static helper functions
 */
class Helpers {

    /**
     * Checks if two values are almost equal to the nearest integer
     * @param{int} value Value that needs to be checked
     * @return{boolean} True if the value is almost equal to an integer
     */
    static almostInteger(value){

        return Math.abs(Math.round(value) - value) < 0.0001;
    }
}

/**
 * Class for the player
 */
class Player {
    /**
     * Initializes the player
     * @param{number} blockSize Size of one Grid
     */
    constructor(blockSize) {
        this.position = new Position(14, 24);
        this.direction = KEYS.A;
        this.eaten = false;
        this.due = null;
        this.lives = 3;
        this.score = 0;
        this.blockSize = blockSize;
    }

    /**
     * Adds a number to the score of the player
     * @param{number} number
     */
    addToScore(number) {

    }

    /**
     * Subtracts a life from the lives of the player
     */
    died(){
        this.lives -= 1;
    }

    /**
     * Calculates the new position of the player.
     * @param{Map} map Instance of the class Map
     * @returns{{new: Position, old: Position}}
     */
    move(map){
        let newPosition = null;
        let oldPosition = this.position;
        let x = 0, y = 0;

        if (this.due && this.due !== this.direction) {
            newPosition = this.getNextPosition(this.due);
            if ((this.due === KEYS.A || this.due === KEYS.D) && Helpers.almostInteger(newPosition.y)) {
                x = Math.round(newPosition.x);
                y = Math.round(newPosition.y);
                if (this.due === KEYS.A && MAP_ARRAY[y][x - 1] !== 0 || this.due === KEYS.D && MAP_ARRAY[y][x + 1] !== 0){
                    this.direction = this.due;
                } else {
                    newPosition = null;
                }
            } else if ((this.due === KEYS.W || this.due === KEYS.S) && Helpers.almostInteger(newPosition.x)) {
                x = Math.round(newPosition.x);
                y = Math.round(newPosition.y);
                if (this.due === KEYS.W && MAP_ARRAY[y - 1][x] !== 0 || this.due === KEYS.S && MAP_ARRAY[y + 1][x] !== 0) {
                    this.direction = this.due;
                } else {
                    newPosition = null;
                }
            } else {
                newPosition = null;
            }
        }

        if (newPosition === null) {
            newPosition = this.getNextPosition(this.direction);
            if (this.onSquare(oldPosition)){
                let x = Math.round(oldPosition.x);
                let y = Math.round(oldPosition.y);
                if (this.direction === KEYS.A && MAP_ARRAY[y][x - 1] === 0) {
                    newPosition = oldPosition;
                } else if (this.direction === KEYS.D && MAP_ARRAY[y][x + 1] === 0) {
                    newPosition = oldPosition;
                } else if (this.direction === KEYS.W && MAP_ARRAY[y - 1][x] === 0) {
                    newPosition = oldPosition;
                } else if (this.direction === KEYS.S && MAP_ARRAY[y + 1][x] === 0) {
                    newPosition = oldPosition;
                }
            }
        }

        this.position = newPosition;
        return {new: this.position, old: oldPosition}
    }

    /**
     * Checks if the player is currently on a square
     * @param position Current Position of the player
     * @return {boolean} True if the player is on a square
     */
    onSquare(position){
        return Helpers.almostInteger(position.x) && Helpers.almostInteger(position.y);
    }

    /**
     * Calculates the next position of the player
     * @param direction Direction in which the player is going
     * @return {Position} Next Position of the player
     */
    getNextPosition(direction) {
        return new Position(
                this.position.x + ((direction === KEYS.A && -0.1) || (direction === KEYS.D && 0.1) || 0),
                this.position.y + ((direction === KEYS.W && -0.1) || (direction === KEYS.S && 0.1) || 0)
            )
    }

    /**
     * Draws the current position of the player on the canvas
     * @param{object} ctx
     */
    draw(ctx) {
        ctx.fillStyle = '#ff9100';
        ctx.fillRect((this.position.x + 0.25) * this.blockSize, (this.position.y + 0.25) * this.blockSize + CANVAS_OFFSET_Y, 10, 10);
    }

    /**
     * Saves the next action in due when the user pressed a key.
     * @param e
     * @returns {boolean}
     */
    keyDown(e) {
        if (e.keyCode === KEYS.A) {
            this.due = KEYS.A;
        } else if (e.keyCode === KEYS.S) {
            this.due = KEYS.S;
        } else if (e.keyCode === KEYS.D) {
            this.due = KEYS.D;
        } else if (e.keyCode === KEYS.W) {
            this.due = KEYS.W;
        } else if (k.keyCode === KEYS.N) {
            this.due = KEYS.N;
        }
        return true;
    }
}

/**
 * Class for the ghost
 */
class Ghost {
    /**
     * Initializes the Ghost object
     * @param color
     */
    constructor(color) {
        /* Variables for the ghost class */
        this.color = color
        this.isEatable = false;
    }

    /**
     * Available colors of the ghosts
     * @type {string[]}
     */
    static GHOST_SPECS = ['#00FFDE', '#FF0000', '#FFB8DE', '#FFB847'];

    /**
     * Toggles the is eatable state of the ghost.
     */
    toggleEatable(){
        this.isEatable = !this.isEatable;
    }
}

/**
 * Class bringing all elements of pacman together and
 * contains the main loop.
 */
class Pacman {
    /**
     * Initializes the pacman class
     * @param{object} ctx Canvas element where the pacman game should be drawn
     * @param{object} canvas Canvas object
     * @param{number} blockSize Size of one block of the game.
     */
    constructor(ctx, canvas, blockSize) {
        /**
         * Canvas element
         * @type {Object}
         */
        this.ctx = ctx;
        this.canvas = canvas;
        /**
         * Size of one block in pixel
         * @type {number}
         */
        this.blockSize = blockSize;
        this.map = null;
        this.ghosts = [];
        this.player = null;
        this.timer = null;
        this.currentState = PLAYING_STATES.PLAYING;
    }

    /**
     * Photos per second that will be rendered to the screen.
     * @type {number}
     */
    static FPS = 30;

    /**
     * Function prevents default events for key presses if the current state
     * is not waiting.
     * @param {object} e
     */
    keyPress(e) {
        if (this.currentState !== PLAYING_STATES.WAITING) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /**
     * Function captures the pressed key by the player
     * @param {object} e
     * @return {boolean} ???
     */
    keyDown(e) {
        if (e.keyCode === KEYS.N) {
            // Start new game
        } else if (e.keyCode === KEYS.P && this.currentState === PLAYING_STATES.PAUSE) {
            // Resume to game
        } else if (e.keyCode === KEYS.P) {
            // Set game to pause
            this.currentState = PLAYING_STATES.PAUSE;
        } else if (this.currentState !== PLAYING_STATES.PAUSE) {
            return this.player.keyDown(e);
        }
        return true;
    }

    /**
     * Initializes the game by drawing everything on the canvas element.
     */
    init() {
        // Initialize the map
        this.map = new Map(this.blockSize);

        // Initialize the player
        this.player = new Player(this.blockSize);

        // Initialize the ghosts
        for (let i = 0; i < Ghost.GHOST_SPECS.length; i++) {
            this.ghosts.push(new Ghost(Ghost.GHOST_SPECS[i]));
        }

        // Set the current state to countdown
        this.currentState = PLAYING_STATES.COUNT_DOWN;

        // Start the main loop
        // document.addEventListener('keydown', this.keyDown, true);
        document.addEventListener('keydown', (e) => {
            this.keyDown(e);
        }, true);

        // document.addEventListener('keypress', this.keyPress, true);
        document.addEventListener('keypress', (e) => {
            this.keyPress(e);
        }, true);

        this.timer = window.setInterval(() => {
            this.mainLoop();
        }, 1000 / Pacman.FPS);
    }

    /**
     * Main loop that draws the current game on the
     * canvas of the application.
     * This method executes every X seconds
     */
    mainLoop(){
        this.map.resetCanvas(this.ctx, this.canvas);

        // Draw the pills
        this.map.drawPills(this.ctx);

        this.player.draw(this.ctx);

        this.player.move(this.ctx);

        let isItem = this.map.isPlacedItem(this.player.position);
        if (isItem > 0) {
            this.player.addToScore(isItem);
        }

        if (this.currentState === PLAYING_STATES.INITIALIZING) {
            // Game is currently being initialized
        } else if (this.currentState === PLAYING_STATES.WAITING) {
            // Game is in waiting state
        } else if (this.currentState === PLAYING_STATES.PLAYING) {
            // Game play is running
            // this.player.move(this.ctx);
            this.draw();
        } else if (this.currentState === PLAYING_STATES.COUNT_DOWN) {
            // Show the countdown for starting the game
        }
    }

    /**
     * Main function for drawing the map as well as the player on the canvas
     */
    draw() {
        // Draw the ghosts

        // Draw the player

        // Check if the player got new points

        // Check if the player somehow collided with a ghost
    }
}

const CANVAS_OFFSET_X = 0;
const CANVAS_OFFSET_Y = 40;

/**
 * States of the pacman game
 * @type {{COUNT_DOWN: number, GAME_OVER: number, NOT_STARTED: number, WAITING: number, DYING: number, PLAYING: number, INITIALIZING: number}}
 */
const PLAYING_STATES = {
    NOT_STARTED: 0,
    WAITING: 1,
    PLAYING: 2,
    DYING: 3,
    GAME_OVER: 4,
    COUNT_DOWN: 5,
    INITIALIZING: 6,
    PAUSE: 7
}

const KEYS = {
    N: 0,
    P: 1,
    S: 83,
    A: 65,
    W: 87,
    D: 68
}

const MAP_ELEMENTS = {
    WALL: 0,
    ITEM: 1,
    EMPTY: 2,
    NOT_ALLOWED: 3,
    BIG_ITEM: 4
}

/**
 * Array represents the placement of points the user can collect.
 * @type {number[][]}
 */
const MAP_ARRAY = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 0, 2, 2, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 0, 3, 3, 3, 3, 3, 3, 0, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2], // Middle
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 0, 2, 2, 2, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 4, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 4, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const LINES = [
    [
        { move: [4.0, 3.5] },
        { line: [6.0, 3.5] },
        { curve: [6.5, 3.5, 6.5, 4.0] },
        { line: [6.5, 5.0] },
        { curve: [6.5, 5.5, 6.0, 5.5] },
        { line: [4.0, 5.5] },
        { curve: [3.5, 5.5, 3.5, 5.0] },
        { line: [3.5, 4.0] },
        { curve: [3.5, 3.5, 4.0, 3.5] }
    ],
    [
        { move: [9.0, 3.5] },
        { line: [12.0, 3.5] },
        { curve: [12.5, 3.5, 12.5, 4.0] },
        { line: [12.5, 5.0] },
        { curve: [12.5, 5.5, 12.0, 5.5] },
        { line: [9.0, 5.5] },
        { curve: [8.5, 5.5, 8.5, 5.0] },
        { line: [8.5, 4.0] },
        { curve: [8.5, 3.5, 9.0, 3.5] }
    ],
    [
        { move: [4.0, 7.5] },
        { line: [6.0, 7.5] },
        { curve: [6.5, 7.5, 6.5, 8.0] },
        { line: [6.5, 8.0] },
        { curve: [6.5, 8.5, 6.0, 8.5] },
        { line: [4.0, 8.5] },
        { curve: [3.5, 8.5, 3.5, 8.0] },
        { line: [3.5, 8.0] },
        { curve: [3.5, 7.5, 4.0, 7.5] }
    ],
    [
        { move: [18.0, 3.5] },
        { line: [21.0, 3.5] },
        { curve: [21.5, 3.5, 21.5, 4.0] },
        { line: [21.5, 5.0] },
        { curve: [21.5, 5.5, 21.0, 5.5] },
        { line: [18.0, 5.5] },
        { curve: [17.5, 5.5, 17.5, 5.0] },
        { line: [17.5, 4.0] },
        { curve: [17.5, 3.5, 18.0, 3.5] }
    ],
    [
        { move: [24.0, 3.5] },
        { line: [26.0, 3.5] },
        { curve: [26.5, 3.5, 26.5, 4.0] },
        { line: [26.5, 5.0] },
        { curve: [26.5, 5.5, 26.0, 5.5] },
        { line: [24.0, 5.5] },
        { curve: [23.5, 5.5, 23.5, 5.0] },
        { line: [23.5, 4.0] },
        { curve: [23.5, 3.5, 24.0, 3.5] }
    ],
    [
        { move: [24.0, 7.5] },
        { line: [26.0, 7.5] },
        { curve: [26.5, 7.5, 26.5, 8.0] },
        { line: [26.5, 8.0] },
        { curve: [26.5, 8.5, 26.0, 8.5] },
        { line: [24.0, 8.5] },
        { curve: [23.5, 8.5, 23.5, 8.0] },
        { line: [23.5, 8.0] },
        { curve: [23.5, 7.5, 24.0, 7.5] }
    ],
    [
        { move: [9.0, 7.5] },
        { line: [9.0, 7.5] },
        { curve: [9.5, 7.5, 9.5, 8.0] },
        { line: [9.5, 10.0] },
        { curve: [9.5, 10.5, 10.0, 10.5] },
        { line: [12.0, 10.5] },
        { curve: [12.5, 10.5, 12.5, 11.0] },
        { line: [12.5, 11.0] },
        { curve: [12.5, 11.5, 12.0, 11.5] },
        { line: [10.0, 11.5] },
        { curve: [9.5, 11.5, 9.5, 12.0] },
        { line: [9.5, 14.0] },
        { curve: [9.5, 14.5, 9.0, 14.5] },
        { line: [9.0, 14.5] },
        { curve: [8.5, 14.5, 8.5, 14.0] },
        { line: [8.5, 8.0] },
        { curve: [8.5, 7.5, 9.0, 7.5] }
    ],
    [
        { move: [12.0, 7.5] },
        { line: [18.0, 7.5] },
        { curve: [18.5, 7.5, 18.5, 8.0] },
        { line: [18.5, 8.0] },
        { curve: [18.5, 8.5, 18.0, 8.5] },
        { line: [16.0, 8.5] },
        { curve: [15.5, 8.5, 15.5, 9.0] },
        { line: [15.5, 11.0] },
        { curve: [15.5, 11.5, 15.0, 11.5] },
        { line: [15.0, 11.5] },
        { curve: [14.5, 11.5, 14.5, 11.0] },
        { line: [14.5, 9.0] },
        { curve: [14.5, 8.5, 14.0, 8.5] },
        { line: [12.0, 8.5] },
        { curve: [11.5, 8.5, 11.5, 8.0] },
        { line: [11.5, 8.0] },
        { curve: [11.5, 7.5, 12.0, 7.5] }
    ],
    [
        { move: [18.0, 10.5] },
        { line: [20.0, 10.5] },
        { curve: [20.5, 10.5, 20.5, 10.0] },
        { line: [20.5, 8.0] },
        { curve: [20.5, 7.5, 21.0, 7.5] },
        { line: [21.0, 7.5] },
        { curve: [21.5, 7.5, 21.5, 8.0] },
        { line: [21.5, 14.0] },
        { curve: [21.5, 14.5, 21.0, 14.5] },
        { line: [21.0, 14.5] },
        { curve: [20.5, 14.5, 20.5, 14.0] },
        { line: [20.5, 12.0] },
        { curve: [20.5, 11.5, 20.0, 11.5] },
        { line: [18.0, 11.5] },
        { curve: [17.5, 11.5, 17.5, 11.0] },
        { line: [17.5, 11.0] },
        { curve: [17.5, 10.5, 18.0, 10.5] }
    ],
    [
        { move: [4.0, 22.5] },
        { line: [6.0, 22.5] },
        { curve: [6.5, 22.5, 6.5, 23.0] },
        { line: [6.5, 26.0] },
        { curve: [6.5, 26.5, 6.0, 26.5] },
        { line: [6.0, 26.5] },
        { curve: [5.5, 26.5, 5.5, 26.0] },
        { line: [5.5, 24.0] },
        { curve: [5.5, 23.5, 5.0, 23.5] },
        { line: [4.0, 23.5] },
        { curve: [3.5, 23.5, 3.5, 23.0] },
        { line: [3.5, 23.0] },
        { curve: [3.5, 22.5, 4.0, 22.5] }
    ],
    [
        { move: [9.0, 16.5] },
        { line: [9.0, 16.5] },
        { curve: [9.5, 16.5, 9.5, 17.0] },
        { line: [9.5, 20.0] },
        { curve: [9.5, 20.5, 9.0, 20.5] },
        { line: [9.0, 20.5] },
        { curve: [8.5, 20.5, 8.5, 20.0] },
        { line: [8.5, 17.0] },
        { curve: [8.5, 16.5, 9.0, 16.5] }
    ],
    [
        { move: [9.0, 22.5] },
        { line: [12.0, 22.5] },
        { curve: [12.5, 22.5, 12.5, 23.0] },
        { line: [12.5, 23.0] },
        { curve: [12.5, 23.5, 12.0, 23.5] },
        { line: [9.0, 23.5] },
        { curve: [8.5, 23.5, 8.5, 23.0] },
        { line: [8.5, 23.0] },
        { curve: [8.5, 22.5, 9.0, 22.5] }
    ],
    [
        { move: [4.0, 28.5] },
        { line: [8.0, 28.5] },
        { curve: [8.5, 28.5, 8.5, 28.0] },
        { line: [8.5, 26.0] },
        { curve: [8.5, 25.5, 9.0, 25.5] },
        { line: [9.0, 25.5] },
        { curve: [9.5, 25.5, 9.5, 26.0] },
        { line: [9.5, 28.0] },
        { curve: [9.5, 28.5, 10.0, 28.5] },
        { line: [12.0, 28.5] },
        { curve: [12.5, 28.5, 12.5, 29.0] },
        { line: [12.5, 29.0] },
        { curve: [12.5, 29.5, 12.0, 29.5] },
        { line: [4.0, 29.5] },
        { curve: [3.5, 29.5, 3.5, 29.0] },
        { line: [3.5, 29.0] },
        { curve: [3.5, 28.5, 4.0, 28.5] }
    ],
    [
        { move: [12.0, 19.5] },
        { line: [18.0, 19.5] },
        { curve: [18.5, 19.5, 18.5, 20.0] },
        { line: [18.5, 20.0] },
        { curve: [18.5, 20.5, 18.0, 20.5] },
        { line: [16.0, 20.5] },
        { curve: [15.5, 20.5, 15.5, 21.0] },
        { line: [15.5, 23.0] },
        { curve: [15.5, 23.5, 15.0, 23.5] },
        { line: [15.0, 23.5] },
        { curve: [14.5, 23.5, 14.5, 23.0] },
        { line: [14.5, 21.0] },
        { curve: [14.5, 20.5, 14.0, 20.5] },
        { line: [12.0, 20.5] },
        { curve: [11.5, 20.5, 11.5, 20.0] },
        { line: [11.5, 20.0] },
        { curve: [11.5, 19.5, 12.0, 19.5] }
    ],
    [
        { move: [12.0, 25.5] },
        { line: [18.0, 25.5] },
        { curve: [18.5, 25.5, 18.5, 26.0] },
        { line: [18.5, 26.0] },
        { curve: [18.5, 26.5, 18.0, 26.5] },
        { line: [16.0, 26.5] },
        { curve: [15.5, 26.5, 15.5, 27.0] },
        { line: [15.5, 29.0] },
        { curve: [15.5, 29.5, 15.0, 29.5] },
        { line: [15.0, 29.5] },
        { curve: [14.5, 29.5, 14.5, 29.0] },
        { line: [14.5, 27.0] },
        { curve: [14.5, 26.5, 14.0, 26.5] },
        { line: [12.0, 26.5] },
        { curve: [11.5, 26.5, 11.5, 26.0] },
        { line: [11.5, 26.0] },
        { curve: [11.5, 25.5, 12.0, 25.5] }
    ],
    [
        { move: [18.0, 22.5] },
        { line: [21.0, 22.5] },
        { curve: [21.5, 22.5, 21.5, 23.0] },
        { line: [21.5, 23.0] },
        { curve: [21.5, 23.5, 21.0, 23.5] },
        { line: [18.0, 23.5] },
        { curve: [17.5, 23.5, 17.5, 23.0] },
        { line: [17.5, 23.0] },
        { curve: [17.5, 22.5, 18.0, 22.5] }
    ],
    [
        { move: [24.0, 22.5] },
        { line: [26.0, 22.5] },
        { curve: [26.5, 22.5, 26.5, 23.0] },
        { line: [26.5, 23.0] },
        { curve: [26.5, 23.5, 26.0, 23.5] },
        { line: [25.0, 23.5] },
        { curve: [24.5, 23.5, 24.5, 24.0] },
        { line: [24.5, 26.0] },
        { curve: [24.5, 26.5, 24.0, 26.5] },
        { line: [24.0, 26.5] },
        { curve: [23.5, 26.5, 23.5, 26.0] },
        { line: [23.5, 23.0] },
        { curve: [23.5, 22.5, 24.0, 22.5] }
    ],
    [
        { move: [21.0, 16.5] },
        { line: [21.0, 16.5] },
        { curve: [21.5, 16.5, 21.5, 17.0] },
        { line: [21.5, 20.0] },
        { curve: [21.5, 20.5, 21.0, 20.5] },
        { line: [21.0, 20.5] },
        { curve: [20.5, 20.5, 20.5, 20.0] },
        { line: [20.5, 17.0] },
        { curve: [20.5, 16.5, 21.0, 16.5] }
    ],
    [
        { move: [18.0, 28.5] },
        { line: [20.0, 28.5] },
        { curve: [20.5, 28.5, 20.5, 28.0] },
        { line: [20.5, 26.0] },
        { curve: [20.5, 25.5, 21.0, 25.5] },
        { line: [21.0, 25.5] },
        { curve: [21.5, 25.5, 21.5, 26.0] },
        { line: [21.5, 28.0] },
        { curve: [21.5, 28.5, 22.0, 28.5] },
        { line: [26.0, 28.5] },
        { curve: [26.5, 28.5, 26.5, 29.0] },
        { line: [26.5, 29.0] },
        { curve: [26.5, 29.5, 26.0, 29.5] },
        { line: [18.0, 29.5] },
        { curve: [17.5, 29.5, 17.5, 29.0] },
        { line: [17.5, 29.0] },
        { curve: [17.5, 28.5, 18.0, 28.5] }
    ],
    [
        { move: [12.0, 13.5] },
        { line: [13.5, 13.5] },
        { line: [13.5, 14.0] },
        { line: [12.5, 14.0] },
        { curve: [12.0, 14.0, 12.0, 14.5] },
        { line: [12.0, 16.5] },
        { curve: [12.0, 17.0, 12.5, 17.0] },
        { line: [17.5, 17.0] },
        { curve: [18.0, 17.0, 18.0, 16.5] },
        { line: [18.0, 14.5] },
        { curve: [18.0, 14.0, 17.5, 14.0] },
        { line: [16.5, 14.0] },
        { line: [16.5, 13.5] },
        { line: [18.0, 13.5] },
        { curve: [18.5, 13.5, 18.5, 14.0] },
        { line: [18.5, 17.0] },
        { curve: [18.5, 17.5, 18.0, 17.5] },
        { line: [12.0, 17.5] },
        { curve: [11.5, 17.5, 11.5, 17.0] },
        { line: [11.5, 14.0] },
        { curve: [11.5, 13.5, 12.0, 13.5] }
    ],
    [
        { move: [1.0, 16.5] },
        { line: [6.0, 16.5] },
        { curve: [6.5, 16.5, 6.5, 17.0] },
        { line: [6.5, 20.0] },
        { curve: [6.5, 20.5, 6.0, 20.5] },
        { line: [2.0, 20.5] },
        { curve: [1.5, 20.5, 1.5, 21.0] },
        { line: [1.5, 25.0] },
        { curve: [1.5, 25.5, 2.0, 25.5] },
        { line: [3.0, 25.5] },
        { curve: [3.5, 25.5, 3.5, 26.0] },
        { line: [3.5, 26.0] },
        { curve: [3.5, 26.5, 3.0, 26.5] },
        { line: [2.0, 26.5] },
        { curve: [1.5, 26.5, 1.5, 27.0] },
        { line: [1.5, 31.0] },
        { curve: [1.5, 31.5, 2.0, 31.5] },
        { line: [28.0, 31.5] },
        { curve: [28.5, 31.5, 28.5, 31.0] },
        { line: [28.5, 27.0] },
        { curve: [28.5, 26.5, 28.0, 26.5] },
        { line: [27.0, 26.5] },
        { curve: [26.5, 26.5, 26.5, 26.0] },
        { line: [26.5, 26.0] },
        { curve: [26.5, 25.5, 27.0, 25.5] },
        { line: [28.0, 25.5] },
        { curve: [28.5, 25.5, 28.5, 25.0] },
        { line: [28.5, 21.0] },
        { curve: [28.5, 20.5, 28.0, 20.5] },
        { line: [24.0, 20.5] },
        { curve: [23.5, 20.5, 23.5, 20.0] },
        { line: [23.5, 17.0] },
        { curve: [23.5, 16.5, 24.0, 16.5] },
        { line: [29, 16.5] }
    ],
    [
        { move: [1.0, 17.0] },
        { line: [5.5, 17.0] },
        { curve: [6.0, 17.0, 6.0, 17.5] },
        { line: [6.0, 19.5] },
        { curve: [6.0, 20.0, 5.5, 20.0] },
        { line: [1.5, 20] },
        { curve: [1, 20, 1, 20.5] },
        { line: [1, 31.5] },
        { curve: [1, 32, 1.5, 32] },
        { line: [28.5, 32] },
        { curve: [29, 32, 29, 31.5] },
        { line: [29, 20.5] },
        { curve: [29, 20, 28.5, 20] },
        { line: [24.5, 20] },
        { curve: [24, 20, 24, 19.5] },
        { line: [24, 17.5] },
        { curve: [24, 17, 24.5, 17] },
        { line: [29, 17] },
    ],
    [
        { move: [1.0, 14.0] },
        { line: [5.5, 14.0] },
        { curve: [6.0, 14.0, 6.0, 13.5] },
        { line: [6.0, 11.5] },
        { curve: [6.0, 11.0, 5.5, 11.0] },
        { line: [1.5, 11] },
        { curve: [1, 11, 1, 10.5] },
        { line: [1, 1.5] },
        { curve: [1, 1, 1.5, 1] },
        { line: [28.5, 1] },
        { curve: [29, 1, 29, 1.5] },
        { line: [29, 10.5] },
        { curve: [29, 11, 28.5, 11] },
        { line: [24.5, 11] },
        { curve: [24, 11, 24, 11.5] },
        { line: [24, 13.5] },
        { curve: [24, 14, 24.5, 14] },
        { line: [29, 14] },
    ],
    [
        { move: [1.0, 14.5] },
        { line: [6.0, 14.5] },
        { curve: [6.5, 14.5, 6.5, 14.0] },
        { line: [6.5, 11.0] },
        { curve: [6.5, 10.5, 6.0, 10.5] },
        { line: [2.0, 10.5] },
        { curve: [1.5, 10.5, 1.5, 10.0] },
        { line: [1.5, 2.0] },
        { curve: [1.5, 1.5, 2.0, 1.5] },
        { line: [14.0, 1.5] },
        { curve: [14.5, 1.5, 14.5, 2.0] },
        { line: [14.5, 5.0] },
        { curve: [14.5, 5.5, 15.0, 5.5] },
        { curve: [15.5, 5.5, 15.5, 5.0] },
        { line: [15.5, 2.0] },
        { curve: [15.5, 1.5, 16.0, 1.5] },
        { line: [28.0, 1.5] },
        { curve: [28.5, 1.5, 28.5, 2.0] },
        { line: [28.5, 10.0] },
        { curve: [28.5, 10.5, 28.0, 10.5] },
        { line: [24.0, 10.5] },
        { curve: [23.5, 10.5, 23.5, 11.0] },
        { line: [23.5, 14.0] },
        { curve: [23.5, 14.5, 24.0, 14.5] },
        { line: [29.0, 14.5] }
    ]
]

