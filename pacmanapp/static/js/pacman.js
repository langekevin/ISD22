/**
 * Event listener for the canvas for pacman that creates the game
 */
window.addEventListener("load", () => {
    const canvas = document.querySelector("#pacman-canvas");
    const ctx = canvas.getContext("2d");

    // Resizing
    const container = document.querySelector("#pacman-container");
    let size = (container.offsetWidth - CANVAS_OFFSET_X * 2) / 30;
    canvas.setAttribute("width", size * 30 + "px");
    canvas.setAttribute("height", size * 33 + 75 + "px");

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
        this.mapArray = [];
        for (let i = 0; i < MAP_ARRAY.length; i++) {
            this.mapArray[i] = MAP_ARRAY[i].slice();
        }
        this.pizzaImage = new Image();
        this.cakeImage = new Image();

        this.pizzaImage.src = "static/images/pizza.svg";
        this.cakeImage.src = "static/images/cake.svg";
    }

    drawPills(ctx) {
        ctx.strokeStyle = "#0033da";
        ctx.lineWidth = 3;

        for (let i = 0; i < LINES.length; i++) {
            let line = LINES[i];
            ctx.beginPath();

            for (let j = 0; j < line.length; j++) {
                let move = line[j];
                if (move.move) {
                    ctx.moveTo(
                        move.move[0] * this.blockSize + CANVAS_OFFSET_X,
                        move.move[1] * this.blockSize + CANVAS_OFFSET_Y
                    );
                } else if (move.line) {
                    ctx.lineTo(
                        move.line[0] * this.blockSize + CANVAS_OFFSET_X,
                        move.line[1] * this.blockSize + CANVAS_OFFSET_Y
                    );
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

        ctx.strokeStyle = "rgba(80,80,80,0.79)";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(
            13.55 * this.blockSize,
            13.75 * this.blockSize + CANVAS_OFFSET_Y
        );
        ctx.lineTo(
            16.45 * this.blockSize,
            13.75 * this.blockSize + CANVAS_OFFSET_Y
        );
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
                    ctx.drawImage(
                        this.pizzaImage,
                        (x + 0.3) * this.blockSize,
                        (y + 0.3) * this.blockSize + CANVAS_OFFSET_Y,
                        10,
                        10
                    );
                } else if (this.mapArray[y][x] === MAP_ELEMENTS.BIG_ITEM) {
                    ctx.drawImage(
                        this.cakeImage,
                        (x + 0.1) * this.blockSize,
                        y * this.blockSize + CANVAS_OFFSET_Y,
                        16,
                        16
                    );
                }
            }
        }
    }

    /**
     * Draws the description and the score on the map
     * @param {object} ctx Canvas object of the map
     * @param {number} score Current score of the player
     * @param {number} highScore Highscore of the player
     */
    drawDescription(ctx, score, highScore = 10000) {
        ctx.font = "bold 24px Courier New";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("SCORE", this.blockSize * 5, this.blockSize + 5);
        ctx.fillText(score, this.blockSize * 5, this.blockSize * 2 + 5);
        ctx.fillText("HIGH SCORE", this.blockSize * 20, this.blockSize + 5);
        ctx.fillText(highScore, this.blockSize * 20, this.blockSize * 2 + 5);
    }

    /**
     * Draws the remaining lives on the map
     * @param {object} ctx Canvas object
     * @param {number} nbLifes Number of remaining lives
     */
    drawLifes(ctx, nbLifes = 3) {
        ctx.fillStyle = "#FFFF00";
        for (let i = 0; i < nbLifes; i++) {
            ctx.fillRect(
                2 * (this.blockSize + this.blockSize * i),
                35 * this.blockSize,
                10,
                10
            );
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
        ctx.fillStyle = "#000000";
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
        if (!position.almostInteger(0) && position.almostInteger(1)) {
            return 0;
        }

        let x = position.asInteger(0);
        let y = position.asInteger(1);
        if (this.mapArray[y][x] === MAP_ELEMENTS.ITEM) {
            this.mapArray[y][x] = MAP_ELEMENTS.EMPTY;
            return MAP_ELEMENTS.ITEM;
        } else if (this.mapArray[y][x] === MAP_ELEMENTS.BIG_ITEM) {
            this.mapArray[y][x] = MAP_ELEMENTS.EMPTY;
            return MAP_ELEMENTS.BIG_ITEM;
        }
        return 0;
    }

    /**
     * Method checks if there is still an item left on the map.
     * @returns{bool} True if an item is left on the map, else false
     */
    isItemLeft() {
        for (let i = 0; i < this.mapArray.length; i++) {
            for (let j = 0; j < this.mapArray[i].length; j++) {
                if (this.mapArray[i][j] === MAP_ELEMENTS.ITEM || this.mapArray[i][j] === MAP_ELEMENTS.BIG_ITEM) {
                    return true;
                }
            }
        }
        return false;
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

    /**
     * Checks if the position is on a square or not
     * @return {boolean} True if position is on square
     */
    isOnSquare() {
        let x = Math.round(this._x);
        let y = Math.round(this._y);

        if (Math.abs(x - this._x) < 0.0001 && Math.abs(y - this._y) < 0.0001) {
            return true;
        }
        return false;
    }

    /**
     * Gets the position as a rounded integer value
     * @param axis 0 for x-axis, 1 for y-axis
     * @return {number} Position as integer
     */
    asInteger(axis = 0) {
        switch (axis) {
            case 0:
                return Math.round(this._x);
            case 1:
                return Math.round(this._y);
            default:
                throw new Error(
                    `The axis ${axis} does not exist in ${Position.prototype.asInteger.name}`
                );
        }
    }

    /**
     * Checks if the position is almost an integer value
     * @param axis 0 for x-axis, 1 for y-axis
     * @return {boolean} True if position can be considered as an integer.
     */
    almostInteger(axis = 0) {
        switch (axis) {
            case 0:
                return Math.abs(Math.round(this._x) - this._x) < 0.0001;
            case 1:
                return Math.abs(Math.round(this._y) - this._y) < 0.0001;
            default:
                throw new Error(
                    `The axis ${axis} does not exist in ${Position.prototype.almostInteger.name}`
                );
        }
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
        this.position = new Position(14.5, 24);
        this.direction = KEYS.A;
        this.eaten = false;
        this.due = null;
        this.lives = 3;
        this.score = 0;
        this.blockSize = blockSize;
        this.highScore = 0;
        this.newLifeAt = 10000;
        this.hasJustEaten = 0;
        this.keyPressTimer = Date.now();
    }

    /**
     * Adds a number to the score of the player
     * @param{number} number
     */
    addToScore(number) {
        this.score += number * 10;
        if (this.score >= this.highScore) {
            this.highScore = this.score;
        }
        if (this.score > this.newLifeAt) {
            this.lives += 1;
            this.newLifeAt += 10000;
        }
        this.hasJustEaten = 0;
    }

    /**
     * Subtracts a life from the lives of the player
     */
    died() {
        this.lives -= 1;
    }

    /**
     * Calculates the new position of the player.
     * @returns{bool} Information if the player is moving or not
     */
    move() {
        let movingPossible = false;
        let newPosition = null;
        let oldPosition = this.position;

        // Reset the due if too much time has passed
        if (this.due && this.keyPressTimer + 0.3 * 1000 < Date.now()) {
            this.due = null;
        }

        if (this.due && this.due !== this.direction) {
            newPosition = this.tryChangeDirection();
        }

        if (newPosition === null) {
            newPosition = this.tryMoveIntoDirection(oldPosition);
        }

        // Check if moving is possible
        movingPossible = newPosition === oldPosition;

        // Correct position if player moves out of the map
        newPosition = this.getsOutOfMap(newPosition);

        this.position = newPosition;
        return movingPossible;
    }

    /**
     * Checks if the player can change the direction at the current location
     * and sets the new direction if possible
     * @return {Position} New position if the change in the new direction is possible
     */
    tryChangeDirection() {
        let x = 0,
            y = 0;
        let newPosition = this.getNextPosition(this.due);
        if ((this.due === KEYS.A || this.due === KEYS.D) && newPosition.almostInteger(1)) {
            x = newPosition.asInteger(0);
            y = newPosition.asInteger(1);
            if ((this.due === KEYS.A && MAP_ARRAY[y][x - 1] !== 0) || (this.due === KEYS.D && MAP_ARRAY[y][x + 1] !== 0)) {
                this.direction = this.due;
            } else {
                newPosition = null;
            }
        } else if ((this.due === KEYS.W || this.due === KEYS.S) && newPosition.almostInteger(0)) {
            x = newPosition.asInteger(0);
            y = newPosition.asInteger(1);
            if ((this.due === KEYS.W && MAP_ARRAY[y - 1][x] !== 0) || (this.due === KEYS.S && MAP_ARRAY[y + 1][x] !== 0)) {
                this.direction = this.due;
            } else {
                newPosition = null;
            }
        } else {
            newPosition = null;
        }
        return newPosition;
    }

    /**
     * Tries to move the player into the current direction
     * @param{Position} oldPosition
     * @returns{Position} New Position of the player
     */
    tryMoveIntoDirection(oldPosition) {
        let newPosition = this.getNextPosition(this.direction);
        if (oldPosition.isOnSquare()) {
            let x = oldPosition.asInteger(0);
            let y = oldPosition.asInteger(1);
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
        return newPosition;
    }

    getsOutOfMap(newPosition) {
        if (newPosition.asInteger(1) !== 15) {
            return newPosition;
        }

        if (newPosition.x >= 28.5 && this.direction === KEYS.D) {
            newPosition.x = 1;
        } else if (newPosition.x <= 1 && this.direction === KEYS.A) {
            newPosition.x = 28.5;
        }

        return newPosition;
    }

    /**
     * Calculates the next position of the player
     * @param direction Direction in which the player is going
     * @return {Position} Next Position of the player
     */
    getNextPosition(direction) {
        return new Position(
            this.position.x +
                ((direction === KEYS.A && -0.1) ||
                    (direction === KEYS.D && 0.1) ||
                    0),
            this.position.y +
                ((direction === KEYS.W && -0.1) ||
                    (direction === KEYS.S && 0.1) ||
                    0)
        );
    }

    /**
     * Draws the current position of the player on the canvas
     * @param{object} ctx
     */
    draw(ctx) {
        ctx.fillStyle = "#ffff00";

        let arcStart = 0.25 * Math.PI;
        let arcEnd = 1.75 * Math.PI;

        if (this.hasJustEaten < 3) {
            // Decrease the angle if pacman has just eaten an item for the
            // first 3 times the canvas gets rendered
            arcStart = 0.05 * Math.PI;
            arcEnd = 1.95 * Math.PI;
            this.hasJustEaten += 1;
        }

        let r = this.blockSize * 0.75;

        let startingPointX = (this.position.x + 0.5) * this.blockSize,
            startingPointY = (this.position.y + 0.5) * this.blockSize + CANVAS_OFFSET_Y;

        if (this.direction === KEYS.A) {
            startingPointX += 5;
            arcStart += Math.PI;
            arcEnd += Math.PI;
        } else if (this.direction === KEYS.D) {
            startingPointX -= 5;
        } else if (this.direction === KEYS.W) {
            startingPointY += 5;
            arcStart = (arcStart + Math.PI * 3 / 2) % (2 * Math.PI);
            arcEnd = (arcEnd + Math.PI * 3 / 2) % (2 * Math.PI);
        } else if (this.direction === KEYS.S) {
            startingPointY -= 5;
            arcStart = (arcStart + Math.PI / 2) % (2 * Math.PI);
            arcEnd = (arcEnd + Math.PI / 2) % (2 * Math.PI);
        }

        ctx.beginPath();
        ctx.moveTo(startingPointX, startingPointY);

        ctx.lineTo(
            (this.position.x + 0.5) * this.blockSize + Math.cos(arcStart) * r,
            (this.position.y + 0.5) * this.blockSize + CANVAS_OFFSET_Y + Math.sin(arcStart) * r
        );
        ctx.arc(
            (this.position.x + 0.5) * this.blockSize,
            (this.position.y + 0.5) * this.blockSize + CANVAS_OFFSET_Y,
            r,
            arcStart,
            arcEnd,
            false
        );
        ctx.lineTo(startingPointX, startingPointY);
        ctx.fill();
    }

    /**
     * Saves the next action in due when the user pressed a key.
     * @param e
     * @returns {boolean}
     */
    keyDown(e) {
        if (e.keyCode === KEYS.A || e.keyCode === KEYS.LEFT) {
            this.due = KEYS.A;
            this.keyPressTimer = Date.now();
        } else if (e.keyCode === KEYS.S || e.keyCode === KEYS.DOWN) {
            this.due = KEYS.S;
            this.keyPressTimer = Date.now();
        } else if (e.keyCode === KEYS.D || e.keyCode === KEYS.RIGHT) {
            this.due = KEYS.D;
            this.keyPressTimer = Date.now();
        } else if (e.keyCode === KEYS.W || e.keyCode === KEYS.UP) {
            this.due = KEYS.W;
            this.keyPressTimer = Date.now();
        } else if (e.keyCode === KEYS.N) {
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
    constructor(ghostObject, blockSize, playerLevel = 1) {
        /* Variables for the ghost class */
        this.color = ghostObject.color;
        this.position = ghostObject.startingPoint;
        this.offsetChaseMode = ghostObject.offsetChaseMode;
        this.homePosition = ghostObject.homePosition;
        this.blockSize = blockSize;
        this.isEatable = false;
        this.goHome = false;
        this.isChasingMode = false;
        this.timer = Date.now();
        this.duration = 0;
        this.mode = "CHASE";
        this.direction = KEYS.A;
        this.name = ghostObject.name;
        this.targetPosition = ghostObject.homePosition;
        this.playerLevel = playerLevel;
        this.movements = [...GHOST_MOVEMENTS[playerLevel]];
        this.hasStarted = false;
        this.eatenDotsCounter = 0;
        this.eatenDotsMin = ghostObject.eatenDotsMin;
        this.ghostSpeed = 0.1;
        this.waiting = false;
        this.ghostStateTimer = Date.now();
        this.showFirstWaves = false;
    }

    /**
     * Available colors of the ghosts
     * @type {string[]}
     */
    static GHOST_SPECS = ["#00FFDE", "#FF0000", "#FFB8DE", "#FFB847"];

    /**
     * Toggles the is eatable state of the ghost.
     */
    makeEatable() {
        if (this.hasStarted != this.goHome){
            // Make ghosts eatable
            this.isEatable = true;

            // Store the remaining duration of the previous mode
            this.duration = this.duration - (Date.now() - this.timer) / 1000;

            // Decrease the ghost speed by 50%
            this.ghostSpeed = 0.05;

            // Set the timer for eatable duration
            this.timer = Date.now();

            if (this.direction === KEYS.A) {
                this.direction = KEYS.D;
            } else if (this.direction === KEYS.D) {
                this.direction = KEYS.A;
            } else if (this.direction === KEYS.W) {
                this.direction = KEYS.S;
            } else if (this.direction === KEYS.S) {
                this.direction = KEYS.W;
            }
        }
    }

    getDistanceToTarget(x, y) {
        return Math.sqrt((x - this.targetPosition.x) ** 2 + (y - this.targetPosition.y) ** 2)
    }

    startGhost() {
        this.hasStarted = true;
        this.isEatable = false;
        this.mode = this.movements[0].type;
        this.duration = this.movements[0].duration;
        this.movements.shift();
        this.timer = Date.now();
    }

    increaseEatenDotsCounter() {
        this.eatenDotsCounter++;
    }

    isStartable(){
        if (this.eatenDotsCounter >= this.eatenDotsMin) {
            this.startGhost();
            return true;
        }
        return false;
    }

    wasEaten() {
        this.goHome = true;
        this.ghostSpeed = 0.25;
        this.targetPosition = new Position(14, 12);

        const x = this.position.asInteger(0);
        const y = this.position.asInteger(1);

        this.position.x = x;
        this.position.y = y;

        let minDistance = Number.MAX_VALUE;
            let bestDecision = null;

            [KEYS.A, KEYS.S, KEYS.D, KEYS.W].forEach(direction => {
                if (!this.isWallInDirection(x, y, direction)) { 
                    let newX = x, newY = y;
                    if (direction === KEYS.A) {
                        newX = Math.max(x - 1, 0);
                    } else if (direction === KEYS.S) {
                        newY++;
                    } else if (direction === KEYS.D) {
                        newX = Math.min(x + 1, GHOST_ARRAY[y].length);
                    } else if (direction === KEYS.W) {
                        newY--;
                    }

                    let distance = this.getDistanceToTarget(newX, newY);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestDecision = direction;
                    }
                }
            });
            this.direction = bestDecision;
    }

    /**
     * Checks which direction is best to get fast to the target.
     * @param {Position} position Current Position of the ghost
     */
    getBestDecision(x, y) {
        let bestDecision = this.direction;
        let minDistance = Number.MAX_VALUE;
        let newDistance;
        
        let possibleDecisions = [];

        if (this.direction === KEYS.S || this.direction === KEYS.W) {
            possibleDecisions = [KEYS.A, KEYS.D, this.direction];
        } else if (this.direction === KEYS.A || this.direction === KEYS.D) {
            possibleDecisions = [KEYS.W, KEYS.S, this.direction];
        } 
        possibleDecisions.forEach(decision => {
            if (decision === KEYS.A && GHOST_ARRAY[y][x - 1] !== GHOST_INTERSECTIONS.WALL) {
                
                newDistance = this.getDistanceToTarget(x - 1, y);
            } else if (decision === KEYS.S && GHOST_ARRAY[y + 1][x] !== GHOST_INTERSECTIONS.WALL) {
                newDistance = this.getDistanceToTarget(x, y + 1);
            } else if (decision === KEYS.D && GHOST_ARRAY[y][x + 1] !== GHOST_INTERSECTIONS.WALL) {
                newDistance = this.getDistanceToTarget(x + 1, y);
            } else if (decision === KEYS.W && GHOST_ARRAY[y - 1][x] !== GHOST_INTERSECTIONS.WALL) {
                newDistance = this.getDistanceToTarget(x, y - 1);
            } else {
                newDistance = Number.MAX_VALUE;
            }

            if (newDistance < minDistance) {
                minDistance = newDistance;
                bestDecision = decision;
            }
        });
        return bestDecision;
    }

    checkCurrentMode(playerPosition) {
        if (this.mode === "SCATTER") {
            this.targetPosition = this.homePosition;
        } else if (this.mode === "CHASE") {
            this.targetPosition = playerPosition;
        }

        if (this.isEatable) {
            if (this.timer + 10 * 1000 < Date.now()) {
                console.log(`Ghost ${this.name} is no longer eatable`);
                this.isEatable = false;
                this.timer = Date.now();
                this.ghostSpeed = 0.1;
                this.position.x = Math.round(this.position.x, 1);
                this.position.y = Math.round(this.position.y, 1);
            }
        } else if (this.timer + this.duration * 1000 < Date.now() && this.movements.length > 0) {
            this.duration = this.movements[0].duration;
            this.mode = this.movements[0].type;
            this.movements.shift();
            this.timer = Date.now();
        }
    }

    move(playerPosition) {
        if (!this.hasStarted) {
            return;
        } else if (this.waiting) {
            if (Date.now() > this.timer + 3 * 1000) {
                this.waiting = false;
            } else {
                return;
            }
        }

        let newPosition = null;

        if (this.goHome && this.position.isOnSquare()) {
            const x = this.position.asInteger(0);
            const y = this.position.asInteger(1);

            if (this.getDistanceToTarget(x, y) < 0.001 && GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.GHOST_HOUSE) {
                this.ghostSpeed = 0.1;
                this.goHome = false;
                this.isEatable = false;
                this.timer = Date.now();
                this.position.x = Math.round(this.position.x, 1);
                this.position.y = Math.round(this.position.y, 1);
                this.waiting = true;
            }
        }

        if (!this.goHome) {
            this.checkCurrentMode(playerPosition);
            this.correctDirection();
        } else {
            this.findFastestWayHome();
        }

        newPosition = this.getNextPosition(this.direction);
        // Check if ghost goes out of the map
        newPosition = this.getsOutOfMap(newPosition);

        this.position = newPosition;
    }

    findFastestWayHome() {
        if (!this.position.isOnSquare()) {
            return;
        }
        
        const x = this.position.asInteger(0);
        const y = this.position.asInteger(1);
        if (this.getDistanceToTarget(x, y) < 0.001 && GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.PATH) {
            this.direction = KEYS.S;
            this.targetPosition = new Position(13, 15);
        } else if (GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.NORMAL ||GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.SPECIAL) {
            let minDistance = Number.MAX_VALUE;
            let bestDecision = null;

            [KEYS.A, KEYS.S, KEYS.D, KEYS.W].forEach(direction => {
                if (!this.isWallInDirection(x, y, direction, true)) { 
                    let newX = x, newY = y;
                    if (direction === KEYS.A) {
                        newX = Math.max(x - 1, 0);
                    } else if (direction === KEYS.S) {
                        newY++;
                    } else if (direction === KEYS.D) {
                        newX = Math.min(x + 1, GHOST_ARRAY[y].length);
                    } else if (direction === KEYS.W) {
                        newY--;
                    }

                    let distance = this.getDistanceToTarget(newX, newY);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestDecision = direction;
                    }
                }
            });
            this.direction = bestDecision;
        } else {
            if (this.direction === KEYS.A) {
                if (GHOST_ARRAY[y][Math.max(x - 1, 0)] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.S;
                    } else {
                        this.direction = KEYS.W;
                    }
                }
            } else if (this.direction === KEYS.S) {
                if (GHOST_ARRAY[y + 1][x] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y][x - 1] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.D;
                    } else {
                        this.direction = KEYS.A;
                    }
                }
            } else if (this.direction === KEYS.D) {
                if (GHOST_ARRAY[y][Math.min(x + 1, GHOST_ARRAY[y].length - 1)] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.S;
                    } else {
                        this.direction = KEYS.W;
                    }
                }
            } else {
                if (GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y][x - 1] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.D;
                    } else {
                        this.direction = KEYS.A;
                    }
                }
            }
        }
        return true;
    }

    correctDirection() {
        // Check if ghost is on a whole square
        if (!this.position.isOnSquare()) {
            return;
        }

        const x = this.position.asInteger(0);
        const y = this.position.asInteger(1);

        if (this.isEatable) {
            // Chose the direction randomly
            let possibleDirections = [];
            if (!this.isWallInDirection(x, y, KEYS.A) && this.direction !== KEYS.D) {
                possibleDirections.push(KEYS.A);
            }
            if (!this.isWallInDirection(x, y, KEYS.D) && this.direction !== KEYS.A) {
                possibleDirections.push(KEYS.D);
            }
            if (!this.isWallInDirection(x, y, KEYS.W) && this.direction !== KEYS.S) {
                possibleDirections.push(KEYS.W);
            }
            if (!this.isWallInDirection(x, y, KEYS.S) && this.direction !== KEYS.W) {
                possibleDirections.push(KEYS.S);
            }

            this.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

        } else if (GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.NORMAL || GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.IGNORE_WHEN_EATEN) {
            // Just a normal intersection.
            // Choose the direction to go.
            this.direction = this.getBestDecision(x, y);
        } else if (GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.SPECIAL) {
            // One of the special four intersections with limited options
            // Choose the direction
            if (this.direction === KEYS.S) {
                // TODO: Implement the decision which direction should be used in order to continue
                this.direction = KEYS.A;
            }
        } else if (GHOST_ARRAY[y][x] === GHOST_INTERSECTIONS.GHOST_HOUSE) {
            if (x < 14) {
                this.direction = KEYS.D;
            } else if (x > 14) {
                this.direction = KEYS.A;
            } else {
                this.direction = KEYS.W;
            }
        } else {
            // Not on an intersection
            // Check if a move into the current direction is still possible and change direction if not
            if (this.direction === KEYS.A) {
                if (GHOST_ARRAY[y][Math.max(x - 1, 0)] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.S;
                    } else {
                        this.direction = KEYS.W;
                    }
                }
            } else if (this.direction === KEYS.S) {
                if (GHOST_ARRAY[y + 1][x] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y][x - 1] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.D;
                    } else {
                        this.direction = KEYS.A;
                    }
                }
            } else if (this.direction === KEYS.D) {
                if (GHOST_ARRAY[y][Math.min(x + 1, GHOST_ARRAY[y].length - 1)] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.S;
                    } else {
                        this.direction = KEYS.W;
                    }
                }
            } else {
                if (GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.WALL) {
                    if (GHOST_ARRAY[y][x - 1] === GHOST_INTERSECTIONS.WALL) {
                        this.direction = KEYS.D;
                    } else {
                        this.direction = KEYS.A;
                    }
                }
            }
        }
    }

    isWallInDirection(x, y, direction, allowGhostHouse = false) {
        switch (direction) {
            case KEYS.A:
                return GHOST_ARRAY[y][Math.max(x - 1, 0)] === GHOST_INTERSECTIONS.WALL || (allowGhostHouse && GHOST_ARRAY[y][Math.max(x - 1, 0)] === GHOST_INTERSECTIONS.GHOST_HOUSE);
            case KEYS.S:
                return GHOST_ARRAY[y + 1][x] === GHOST_INTERSECTIONS.WALL || (allowGhostHouse && GHOST_ARRAY[y + 1][x] === GHOST_INTERSECTIONS.GHOST_HOUSE);
            case KEYS.D:
                return GHOST_ARRAY[y][Math.min(x + 1, GHOST_ARRAY[y].length - 1)] === GHOST_INTERSECTIONS.WALL || (allowGhostHouse && GHOST_ARRAY[y][Math.min(x + 1, GHOST_ARRAY[y].length - 1)] === GHOST_INTERSECTIONS.GHOST_HOUSE);
            case KEYS.W:
                return GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.WALL || (allowGhostHouse && GHOST_ARRAY[y - 1][x] === GHOST_INTERSECTIONS.GHOST_HOUSE);
            default:
                return true;
        }
    }

    getsOutOfMap(newPosition) {
        if (newPosition.asInteger(1) !== 15) {
            return newPosition;
        }

        if (newPosition.x >= 28.5 && this.direction === KEYS.D) {
            newPosition.x = 1;
        } else if (newPosition.x <= 1 && this.direction === KEYS.A) {
            newPosition.x = 28.5;
        }

        return newPosition;
    }

    getNextPosition(direction) {
        return new Position(
            this.position.x + ((direction == KEYS.A && -this.ghostSpeed) || (direction == KEYS.D && this.ghostSpeed) || 0),
            this.position.y + ((direction == KEYS.W && -this.ghostSpeed) || (direction === KEYS.S && this.ghostSpeed) || 0),
        );
    }

    drawGhost(ctx) {
        // Colors for the ghost if it is eatable
        let background = "#072A6C";
        let color = "#FFFFFF";
        
        let r = this.blockSize * 0.7,
            h = this.blockSize * 0.6,
            x = (this.position.x) * this.blockSize,
            y = (this.position.y) * this.blockSize + CANVAS_OFFSET_Y,
            offsetX = -4,
            offsetY = -2,
            eyeOffsetX = 0,
            eyeOffsetY = 0,
            bottom = y + r + h + offsetY,
            waveHeight = r / 3;

        if (this.goHome) {
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.ellipse(x + offsetX + 3 * r / 5, y + r + offsetY - 1, 5, 6, 0, 0, 2 * Math.PI);
            ctx.ellipse(x + offsetX + 7 / 5 * r, y + r + offsetY - 1, 5, 6, 0, 0, 2 * Math.PI);
            ctx.fill();
            
            if (this.direction === KEYS.A) {
                eyeOffsetX -= 1;
            } else if (this.direction === KEYS.D) {
                eyeOffsetX += 1;
            } else if (this.direction === KEYS.W) {
                eyeOffsetY -= 2;
            } else if (this.direction === KEYS.S) {
                eyeOffsetY += 2;
            }
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + offsetX + 3 / 5 * r + eyeOffsetX, y + r + offsetY - 1 + eyeOffsetY, 3, 0, 2 * Math.PI);
            ctx.arc(x + offsetX + 7 / 5 * r + eyeOffsetX, y + r + offsetY - 1 + eyeOffsetY, 3, 0, 2 * Math.PI);
            ctx.fill();

            return;
        }

        ctx.fillStyle = this.color;
        if (this.isEatable && this.hasStarted) {
            let remainingTime = Math.round((10 * 1000 - (Date.now() - this.timer)) / 500);
            if (remainingTime < 6) {
                if (remainingTime % 2 === 0) {
                    background = '#FFFFFF';
                    color = '#072A6C';
                }
            }
            ctx.fillStyle = background;
        }

        if (this.ghostStateTimer + 0.15 * 1000 < Date.now()) {
            this.showFirstWaves = !this.showFirstWaves;
            this.ghostStateTimer = Date.now();
        }


        ctx.beginPath();
        ctx.moveTo(x + offsetX, y + r + offsetY);
        ctx.arc(x + offsetX + r, y + r + offsetY, r, Math.PI, 2 * Math.PI);
        ctx.lineTo(x + offsetX + r * 2, y + r + h + offsetY);
        
        // Wavy things at the bottom
        if (this.showFirstWaves) {
            ctx.lineTo(x + offsetX + 17 / 10 * r, bottom + waveHeight);
            ctx.lineTo(x + offsetX + 7 / 5 * r, bottom);
            ctx.lineTo(x + offsetX + r, bottom + waveHeight);
            ctx.lineTo(x + offsetX + 3 * r / 5, bottom);
            ctx.lineTo(x + offsetX + 3 * r / 10, bottom + waveHeight);
            ctx.lineTo(x + offsetX, y + h + offsetY + r);
        } else {
            ctx.lineTo(x + offsetX + r * 2, bottom + waveHeight);
            ctx.lineTo(x + offsetX + 8 / 5 * r, bottom);
            ctx.lineTo(x + offsetX + 34 / 25 * r, bottom + waveHeight);
            ctx.lineTo(x + offsetX + 6 / 5 * r, bottom + waveHeight);
            ctx.lineTo(x + offsetX + 6 / 5 * r, bottom);
            ctx.lineTo(x + offsetX + 4 * r / 5, bottom);
            ctx.lineTo(x + offsetX + 4 * r / 5, bottom + waveHeight);
            ctx.lineTo(x + offsetX + 16 * r / 25, bottom + waveHeight);
            ctx.lineTo(x + offsetX + 2 * r / 5, bottom);
            ctx.lineTo(x + offsetX, bottom + waveHeight);
        }

        ctx.lineTo(x + offsetX, y + r + offsetY);
        ctx.fill();

        if (!this.isEatable) {
            // Draw the basic eyes
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.ellipse(x + offsetX + 3 * r / 5, y + r + offsetY - 1, 4, 5, 0, 0, 2 * Math.PI);
            ctx.ellipse(x + offsetX + 7 / 5 * r, y + r + offsetY - 1, 4, 5, 0, 0, 2 * Math.PI);
            ctx.fill();

            let eyeOffsetX = 0, eyeOffsetY = 0;
            
            if (this.direction === KEYS.A) {
                eyeOffsetX -= 1;
            } else if (this.direction === KEYS.D) {
                eyeOffsetX += 1;
            } else if (this.direction === KEYS.W) {
                eyeOffsetY -= 2;
            } else if (this.direction === KEYS.S) {
                eyeOffsetY += 2;
            }
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + offsetX + 3 / 5 * r + eyeOffsetX, y + r + offsetY - 1 + eyeOffsetY, 2.5, 0, 2 * Math.PI);
            ctx.arc(x + offsetX + 7 / 5 * r + eyeOffsetX, y + r + offsetY - 1 + eyeOffsetY, 2.5, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x + offsetX + 3 / 5 * r, y + r + offsetY - 1, 2.5, 0, 2 * Math.PI);
            ctx.arc(x + offsetX + 7 / 5 * r, y + r + offsetY - 1, 2.5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x + offsetX + 0.8 * r * 2, y + r + offsetY + 3 / 4 * h);
            ctx.quadraticCurveTo(x + offsetX + 0.5 * r * 2, y + r + offsetY + 3 / 4 * h - 8, x + offsetX + 0.2 * r * 2, y + r + offsetY + 3 / 4 * h);
            ctx.stroke();
        }
    }

    collisionDetected(playerPosition) {
        const distance = Math.sqrt((playerPosition.x - this.position.x) ** 2 + (playerPosition.y - this.position.y) ** 2);
        return distance < 0.5;
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
        this.activeGhostCounter = 0;
        this.dyingTimer = null;
        this.playerLevel = 0;
        this.audio = new PacmanAudio();
        this.isFrighteningMode = false;
    }

    /**
     * Photos per second that will be rendered to the screen.
     * @type {number}
     */
    static FPS = 50;

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
            this.audio.intermission.pause();
            this.audio.beginning.play();
            this.currentState = PLAYING_STATES.COUNT_DOWN;
            this.timer = Date.now();
        } else if (
            e.keyCode === KEYS.P &&
            this.currentState === PLAYING_STATES.PAUSE
        ) {
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
     * Draws the start screen when the game has initialized.
     * TODO: This can eventually be moved to the map.
     */
    drawStartNewGame() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.ctx.font = "bold 24px Courier New";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Press N to start new game...", this.blockSize * 15, this.blockSize * 18);
    }

    drawCountDown(remainingTime) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.ctx.font = "bold 32px Courier New";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign= "center";
        
        
        this.ctx.fillText("GAME WILL START IN", this.blockSize * 15, this.blockSize * 17);
        this.ctx.fillText(remainingTime.toString(), this.blockSize * 15, this.blockSize * 20);
    }

    drawGameOver() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.ctx.font = "bold 32px Courier New";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER", this.blockSize * 15, this.blockSize * 18);
    }

    drawNextLevel() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.ctx.font = "bold 32px Courier New";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.textAlign = "center";
        this.ctx.fillText("NEXT LEVEL", this.canvas.clientWidth / 2, this.canvas.clientHeight / 2 - this.blockSize);
        this.ctx.fillText(this.playerLevel + 1, this.canvas.clientWidth / 2, this.canvas.clientHeight / 2 + this.blockSize);
    }

    /**
     * Initializes the game by drawing everything on the canvas element.
     */
    init() {
        // Get the high score of the player
        this.getPlayerHighScore();

        // Load the audio files
        this.audio.loadAudios();

        // Initialize the map
        this.map = new Map(this.blockSize);

        // Initialize the player
        this.player = new Player(this.blockSize);

        // Initialize the ghosts
        for (let i = 0; i < GHOSTS.length; i++) {
            this.ghosts.push(new Ghost(GHOSTS[i], this.blockSize));
        }

        // Set the current state to countdown
        this.currentState = PLAYING_STATES.INITIALIZING;

        // Play the pacman intermission sound
        // this.audio.intermission.loop = true;
        // this.audio.intermission.play();

        // Start the main loop
        // document.addEventListener('keydown', this.keyDown, true);
        document.addEventListener(
            "keydown",
            (e) => {
                this.keyDown(e);
            },
            true
        );

        // document.addEventListener('keypress', this.keyPress, true);
        document.addEventListener(
            "keypress",
            (e) => {
                this.keyPress(e);
            },
            true
        );

        this.timer = window.setInterval(() => {
            this.mainLoop();
        }, 1000 / Pacman.FPS);
    }

    /**
     * Main loop that draws the current game on the
     * canvas of the application.
     * This method executes every X seconds
     */
    mainLoop() {
        this.map.resetCanvas(this.ctx, this.canvas);

        // Draw the pills
        this.map.drawPills(this.ctx);
        this.map.drawDescription(this.ctx, this.player.score, this.player.highScore);
        this.map.drawLifes(this.ctx, this.player.lives);

        this.player.draw(this.ctx);
        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].drawGhost(this.ctx);
        }

        if (this.currentState === PLAYING_STATES.INITIALIZING) {
            // Game is currently being initialized
            this.drawStartNewGame();
        } else if (this.currentState === PLAYING_STATES.WAITING) {
            // Game is in waiting state
        } else if (this.currentState === PLAYING_STATES.PLAYING) {
            // Game play is running
            this.draw();
        } else if (this.currentState === PLAYING_STATES.COUNT_DOWN) {
            // Show the countdown for starting the game
            let remainingTime = Math.round((this.timer + 4.5 * 1000 - Date.now()) / 1000, 0);
            if (remainingTime === 0) {
                this.currentState = PLAYING_STATES.PLAYING;
                this.player.draw(this.ctx);
                for (let i = 0; i < this.ghosts.length; i++) {
                    this.ghosts[i].drawGhost(this.ctx);
                }
            } else {
                this.drawCountDown(remainingTime - 1);
            }
        } else if (this.currentState === PLAYING_STATES.DYING) {
            if (Date.now() > this.dyingTimer + 3 * 1000) {
                this.resetAfterDying();
                this.audio.beginning.play();
            }
        } else if (this.currentState === PLAYING_STATES.GAME_OVER) {
            this.drawGameOver();
            if (Date.now() > this.dyingTimer + 3 * 1000){
                this.gameOverHandler();
                this.currentState = PLAYING_STATES.WAITING;
            }
        } else if (this.currentState === PLAYING_STATES.LEVEL_COMPLETE) {
            this.drawNextLevel();
            if (Date.now() > this.dyingTimer + 3 * 1000) {
                this.map = new Map(this.blockSize);
                this.resetAfterDying();
                this.audio.beginning.play();
            }
        }
    }

    resetAfterDying() {
        this.player.position = new Position(14.5, 24);
        this.player.due = null;
        this.player.direction = KEYS.A;
        this.activeGhostCounter = 0;

        // Reset the ghosts
        this.ghosts = [];
        for (let i = 0; i < GHOSTS.length; i++) {
            this.ghosts.push(new Ghost(GHOSTS[i], this.blockSize));
        }
        this.timer = Date.now();
        this.currentState = PLAYING_STATES.COUNT_DOWN;
        this.dyingTimer = null;
    }

    gameOverHandler() {
        // Post the current state to the backend and redirect to the
        // result page
        
        const csrfToken = this.getCsrfToken();

        fetch("http://thebestpacman.ddns.net/highscore", {
            method: 'POST',
            mode: "same-origin",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({'score': this.player.score})
        }).then(response => {
            if (response.status === 201) {
                window.location.href = "/pacman";
            }
        });
    }

    getCsrfToken(){
        const value = `; ${document.cookie}`;
        const parts = value.split("; csrftoken=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    async getPlayerHighScore() {
        const response = await fetch('/highscore');
        const data = await response.json();

        if (data) {
            this.player.highScore = data.highScore;
        }
    }

    /**
     * Main function for drawing the map as well as the player on the canvas
     */
    draw() {
        // Check if we can start the ghostass
        if (this.activeGhostCounter < this.ghosts.length) {
            if (this.ghosts[this.activeGhostCounter].isStartable()) {
                this.activeGhostCounter += 1;
            }
        }

        // Move the ghosts
        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].move(this.player.position);
            // console.log(this.ghosts[i]);
        }

        // Draw the player
        this.player.move(this.ctx);

        // Check if the player was eaten
        for (let i = 0; i < this.ghosts.length; i++) {
            if (this.ghosts[i].collisionDetected(this.player.position) && !this.ghosts[i].goHome) {
                if (!this.ghosts[i].isEatable) {
                    // Player got eaten
                    this.player.died();
                    this.audio.death.play();
                    if (this.player.lives > 0) {
                        this.dyingTimer = Date.now();
                        this.currentState = PLAYING_STATES.DYING;
                    } else {
                        this.dyingTimer = Date.now();
                        this.currentState = PLAYING_STATES.GAME_OVER;
                    }
                    return;
                }

                // Player ate the ghost
                this.ghosts[i].wasEaten();
                this.player.addToScore(20);
                this.audio.eatghost.play();
            }
        }

        // Check if the player got new points
        let isItem = this.map.isPlacedItem(this.player.position);
        if (isItem > 0) {
            
            this.player.addToScore(isItem);
            
            if (this.activeGhostCounter < this.ghosts.length) {
                this.ghosts[this.activeGhostCounter].increaseEatenDotsCounter();
            }
            
            if (!this.map.isItemLeft()) {
                // All items were collected by the player
                this.playerLevel += 1;
                this.dyingTimer = Date.now();
                this.currentState = PLAYING_STATES.LEVEL_COMPLETE;
            }

            if (isItem === MAP_ELEMENTS.BIG_ITEM) {
                this.audio.eatfruit.play();
                // Start the frightening mode of the ghosts and make them eatable
                for (let i = 0; i < this.ghosts.length; i++) {
                    this.ghosts[i].makeEatable();
                }
            }
        }
    }
}


class PacmanAudio {
    constructor() {
        this.beginning = new Audio();
        this.chomp = new Audio();
        this.death = new Audio();
        this.eatfruit = new Audio();
        this.eatghost = new Audio();
        this.extrapac = new Audio();
        this.intermission = new Audio();
        this.waka = new Audio();
        this.siren = new Audio();
    }

    loadAudios() {
        this.beginning.src = "static/sounds/pacman_beginning.wav";
        this.chomp.src = "static/sounds/pacman_chomp.wav";
        this.death.src = "static/sounds/pacman_death.wav";
        this.eatfruit.src = "static/sounds/pacman_eatfruit.wav";
        this.eatghost.src = "static/sounds/pacman_eatghost.ogg";
        this.extrapac.src = "static/sounds/pacman_extrapac.wav";
        this.intermission.src = "static/sounds/pacman_intermission.wav";
        this.waka.src = "static/sounds/pacman_eating.ogg";
        this.siren.src = "static/sounds/pacman_ghost_siren.wav";
    }
}

const CANVAS_OFFSET_X = 0;
const CANVAS_OFFSET_Y = 40;

/**
 * States of the pacman game
 * @type {{COUNT_DOWN: number, GAME_OVER: number, NOT_STARTED: number, WAITING: number, DYING: number, PLAYING: number, INITIALIZING: number, LEVEL_COMPLETE: number}}
 */
const PLAYING_STATES = {
    NOT_STARTED: 0,
    WAITING: 1,
    PLAYING: 2,
    DYING: 3,
    GAME_OVER: 4,
    COUNT_DOWN: 5,
    INITIALIZING: 6,
    PAUSE: 7,
    LEVEL_COMPLETE: 8,
};

const KEYS = {
    N: 78,
    P: 1,
    S: 83,
    A: 65,
    W: 87,
    D: 68,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
};

const MAP_ELEMENTS = {
    WALL: 0,
    ITEM: 1,
    EMPTY: 2,
    NOT_ALLOWED: 3,
    BIG_ITEM: 4,
};

const GHOST_PERSONALITIES = {
    BLINKY: null,
    PINKY: null,
    INKY: null,
    CLYDE: null,
};

const GHOSTS = [
    {
        name: "Blinky",
        startingPoint: new Position(14.5, 12),
        homePosition: new Position(25, 0),
        offsetChaseMode: [0, 0],
        color: "#FF0000",
        eatenDotsMin: 0
    },
    {
        name: "Pinky",
        startingPoint: new Position(14.5, 15),
        homePosition: new Position(4, 0),
        offsetChaseMode: [0, 0],
        color: "#00FFDE",
        eatenDotsMin: 10
    },
    {
        name: "Inky",
        startingPoint: new Position(12.5, 15),
        homePosition: new Position(29, 33),
        offsetChaseMode: [0, 0],
        color: "#FFB8DE",
        eatenDotsMin: 15,
    },
    {
        name: "Clyde",
        startingPoint: new Position(16.5, 15),
        homePosition: new Position(0, 33),
        offsetChaseMode: [0, 0],
        color: "#FFB847",
        eatenDotsMin: 20,
    },
];

const GHOST_INTERSECTIONS = {
    WALL: 0,
    PATH: 1,
    NORMAL: 2,
    SPECIAL: 3,
    GHOST_HOUSE: 4,
    IGNORE_WHEN_EATEN: 5,
};

const GHOST_MOVEMENTS = {
    1: [
        { type: "SCATTER", duration: 7 },
        { type: "CHASE", duration: 20 },
        { type: "SCATTER", duration: 7 },
        { type: "CHASE", duration: 20 },
        { type: "SCATTER", duration: 5 },
        { type: "CHASE", duration: 20 },
        { type: "SCATTER", duration: 5 },
        { type: "CHASE", duration: Number.MAX_VALUE }
    ]
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const GHOST_ARRAY = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 5, 1, 1, 5, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 2, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 4, 4, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 4, 4, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 0, 4, 4, 4, 4, 4, 4, 0, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1], // Middle
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 2, 1, 1, 2, 1, 1, 3, 1, 1, 3, 1, 1, 2, 1, 1, 2, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 2, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];


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
        { curve: [3.5, 3.5, 4.0, 3.5] },
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
        { curve: [8.5, 3.5, 9.0, 3.5] },
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
        { curve: [3.5, 7.5, 4.0, 7.5] },
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
        { curve: [17.5, 3.5, 18.0, 3.5] },
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
        { curve: [23.5, 3.5, 24.0, 3.5] },
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
        { curve: [23.5, 7.5, 24.0, 7.5] },
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
        { curve: [8.5, 7.5, 9.0, 7.5] },
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
        { curve: [11.5, 7.5, 12.0, 7.5] },
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
        { curve: [17.5, 10.5, 18.0, 10.5] },
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
        { curve: [3.5, 22.5, 4.0, 22.5] },
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
        { curve: [8.5, 16.5, 9.0, 16.5] },
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
        { curve: [8.5, 22.5, 9.0, 22.5] },
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
        { curve: [3.5, 28.5, 4.0, 28.5] },
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
        { curve: [11.5, 19.5, 12.0, 19.5] },
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
        { curve: [11.5, 25.5, 12.0, 25.5] },
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
        { curve: [17.5, 22.5, 18.0, 22.5] },
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
        { curve: [23.5, 22.5, 24.0, 22.5] },
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
        { curve: [20.5, 16.5, 21.0, 16.5] },
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
        { curve: [17.5, 28.5, 18.0, 28.5] },
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
        { curve: [11.5, 13.5, 12.0, 13.5] },
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
        { line: [29, 16.5] },
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
        { line: [29.0, 14.5] },
    ],
];
