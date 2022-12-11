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
    }

    /**
     * Initializes the game by drawing everything on the canvas element.
     */
    init() {
        // Initialize the map

        // Initialize the player

        // Initialize the ghosts

        // Start a timer before the game begins

        // Start the main loop
    }

    /**
     * Main loop that draws the current game on the
     * canvas of the application.
     * This method executes every X seconds
     */
    mainLoop(){
        // Draw the map

        // Draw the ghosts

        // Draw the player

        // Check if the player got new points

        // Check if the player somehow collided with a ghost
    }

    /**
     * Main function for drawing the map as well as the player on the canvas
     */
    draw() {

    }
}

