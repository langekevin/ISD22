/**
 * Event listener for the canvas for pacman that creates the game
 */
window.addEventListener('load', () => {
    const canvas = document.querySelector("#pacman-canvas");
    const ctx = canvas.getContext("2d");

    // Resizing
    const container = document.querySelector("#pacman-container");

    let size = container.offsetWidth / 19;
    canvas.setAttribute("width", (size * 19) + "px");
    canvas.setAttribute('height', (size * 22) + 30 + "px");

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Initialize Pacman game
    const pacman = new Pacman(ctx,size);
    pacman.init();
});

/**
 * Class for the map of the pacman game
 */
class Map {
    constructor(blockSize) {
        this.blockSize = blockSize
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
     * @param{number} blockSize Size of one block of the game.
     */
    constructor(ctx, blockSize) {
        /**
         * Canvas element
         * @type {Object}
         */
        this.ctx = ctx;
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

        this.timer = window.setInterval(this.mainLoop, 1000 / Pacman.FPS);
    }

    /**
     * Main loop that draws the current game on the
     * canvas of the application.
     * This method executes every X seconds
     */
    mainLoop(){
        // Draw the pills

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
    S: 2
}