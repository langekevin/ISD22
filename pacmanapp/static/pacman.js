/**
 * Event listener for the canvas for pacman that creates the game
 */
window.addEventListener('load', () => {
    const canvas = document.querySelector("#pacman-canvas");
    const ctx = canvas.getContext("2d");

    // Resizing
    const container = document.querySelector("#pacman-container");
    let size = (container.offsetWidth - CANVAS_OFFSET * 2) / 30;
    canvas.setAttribute("width", (size * 30) + "px");
    canvas.setAttribute("height", (size * 33) + 30 + "px");

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
    }

    drawPills(ctx) {
        ctx.strokeStyle = '#041556';
        ctx.lineWidth = 3;

        for (let i = 0; i < LINES.length; i++) {
            let line = LINES[i];
            ctx.beginPath();

            for (let j = 0; j < line.length; j++) {
                let move = line[j];
                if (move.move) {
                    ctx.moveTo(move.move[0] * this.blockSize, move.move[1] * this.blockSize);
                } else if (move.line) {
                    ctx.lineTo(move.line[0] * this.blockSize, move.line[1] * this.blockSize);
                } else if (move.curve) {
                    ctx.quadraticCurveTo(
                        move.curve[0] * this.blockSize,
                        move.curve[1] * this.blockSize,
                        move.curve[2] * this.blockSize,
                        move.curve[3] * this.blockSize
                    );
                }
            }
            ctx.stroke();
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
}

/**
 * Class for the player
 */
class Player {
    /**
     * Initializes the player
     * @param{number[]} position Current position of the player
     * @param{number} direction Current direction of the player
     * @param{boolean} eaten Information if the player is eaten
     * @param{object} due
     * @param{number} lives Number of lives of the player
     * @param{number} score Current score of the player
     */
    constructor(position, direction, eaten, due, lives, score) {
        this.position = position;
        this.direction = direction;
        this.eaten = eaten;
        this.due = due;
        this.lives = lives;
        this.score = score;
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
     * @returns {{new: number[], old: number[]}}
     */
    move(map){

        return {new: [0, 0], old: [1, 0]}
    }

    /**
     * Draws the current position of the player on the canvas
     * @param{object} ctx
     */
    draw(ctx) {

    }

    /**
     * Saves the next action in due when the user pressed a key.
     * @param e
     * @returns {boolean}
     */
    keyDown(e) {
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
        this.currentState = PLAYING_STATES.INITIALIZING;
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
        } else if (e.keyCode === KEYS.S) {
            // Disable audio
        } else if (e.keyCode === KEYS.P && this.currentState === PLAYING_STATES.PAUSE) {
            // Resume to game
        } else if (e.keyCode === KEYS.P) {
            // Set game to pause
            this.currentState = PLAYING_STATES.PAUSE;
        } else if (state !== PLAYING_STATES.PAUSE) {
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
        this.player = new Player();

        // Initialize the ghosts
        for (let i = 0; i < Ghost.GHOST_SPECS.length; i++) {
            this.ghosts.push(new Ghost(Ghost.GHOST_SPECS[i]));
        }

        // Set the current state to countdown
        this.currentState = PLAYING_STATES.COUNT_DOWN;

        // Start the main loop
        document.addEventListener('keydown', this.keyDown, true);
        document.addEventListener('keypress', this.keyPress, true);

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

        if (this.currentState === PLAYING_STATES.INITIALIZING) {
            // Game is currently being initialized
        } else if (this.currentState === PLAYING_STATES.WAITING) {
            // Game is in waiting state
        } else if (this.currentState === PLAYING_STATES.PLAYING) {
            // Game play is running
            this.player.move(this.ctx);
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

const CANVAS_OFFSET = 5;

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
    S: 2,
    A: 3,
    W: 4,
    D: 5
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
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Middle
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 0, 0],
    [0, 0, 2, 2, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 4, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 4, 0, 0],
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
        { move: [0, 16] },
        { line: [5, 16] },
        { curve: [6, 16, 6, 17] },
        { line: [6, 19] },
        { curve: [6, 20, 5, 20] },
        { line: [2, 20] },
        { curve: [1, 20, 1, 21] },
        { line: [1, 23] },
        { curve: [1, 24, 2, 24] },
        { curve: [3, 24, 3, 25] },
        { curve: [3, 26, 2, 26] },
        { curve: [1, 26, 1, 27] },
        { line: [1, 30] },
        { curve: [1, 31, 2, 31]},
        { line: [27, 31] },
        { curve: [28, 31, 28, 30] },
        { line: [28, 27] },
        { curve: [28, 26, 27, 26] },
        { curve: [26, 26, 26, 25] },
        { curve: [26, 24, 27, 24] },
        { curve: [28, 24, 28, 23] },
        { line: [28, 21] },
        { curve: [28, 20, 27, 20] },
        { line: [24, 20] },
        { curve: [23, 20, 23, 19] },
        { line: [23, 17]},
        { curve: [23, 16, 24, 16] },
        { line: [29, 16] }
    ],
    [
        {move: [0, 16.5]},
        {line: [5, 16.5]},
        {curve: [5.5, 16.5, 5.5, 17]},
        {line: [5.5, 19]},
        {curve: [5.5, 19.5, 5, 19.5]},
        {line: [1, 19.5]},
        {curve: [0.5, 19.5, 0.5, 20]}
    ],
    [
        {move: [4, 22]},
        {line: [5.5, 22]},
        {curve: [6, 22, 6, 22.5]},
        {line: [6, 25.5]},
        {curve: [6, 26, 5.5, 26]},
        {curve: [5, 26, 5, 25.5]},
        {line: [5, 24]},
        {curve: [5, 23.5, 4.5, 23.5]},
    ],
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
        { line: [11.0, 3.5] },
        { curve: [11.5, 3.5, 11.5, 4.0] },
        { line: [11.5, 5.0] },
        { curve: [11.5, 5.5, 11.0, 5.5] },
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
        { line: [9.5, 11.0] },
        { curve: [9.5, 10.5, 10.0, 10.5] },
        { line: [12.0, 10.5] },
        { curve: [12.5, 10.5, 12.5, 11.0] },
        { line: [12.5, 12.0] },
        { curve: [12.5, 11.5, 13.0, 11.5] },
        { line: [9.0, 11.5] },
        { curve: [9.5, 11.5, 9.5, 12.0] },
        { line: [9.5, 14.0] },
        { curve: [9.5, 14.5, 9.0, 14.5] },
        { line: [9.0, 14.5] },
        { curve: [8.5, 14.5, 8.5, 14.0] },
        { line: [8.5, 8.0] },
        { curve: [8.5, 7.5, 9.0, 7.5] }
    ]
]