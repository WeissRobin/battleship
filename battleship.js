class Player {
    constructor(Board, Symbol, ID) {
        this.Board = Board;
        this.Symbol = Symbol;
        this.ID = ID;
    }

    attack(Board, Col, Row) {
        return Board.receiveAttack(Col, Row);
    }

    getSymbol() {
        return this.Symbol;
    }
}

class Ship {
    constructor(length) {
        this.length = length;
        this.damage = 0;
        this.sunk = false;
    }

    hit() {
        this.damage++;
        this.isSunk();
    }

    isSunk() {
        if(this.length === this.damage) {
            this.sunk = true;
            return true;
        }
    }
}

class Gameboard {
    constructor() {
        this.Columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.Rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.Board = {};
        this.Ships = [];
        this.ReceivedAttacks = [];
        this.Generate();
    }

    Generate() {
        for (let Col of this.Columns) {
            this.Board[Col] = [];
            for (let Row of this.Rows) {
                this.Board[Col].push(Row);
            }
        }
    }

    placeShip(Ship, Col, Row, Rotation = 'vertical') {
        if (Rotation === 'vertical') {
            for (let i = 0; i < Ship.length; i++) {
                this.Board[Col][(Row - 1) + i] = Ship;
            }
        }
        else {
            for (let i = 0; i < Ship.length; i++) {
                this.Board[Col + i][Row - 1] = Ship;
            }
        }
    }

    receiveAttack(Col, Row) {
        if (this.Board[Col][Row - 1] instanceof Ship) {
            let Ship = this.Board[Col][Row - 1];
            Ship.hit();
            return true;
        } else {
            return false;
        }
    }

    displayBoard(Element) {
        this.Columns.forEach(Col => {
            const boardColumn = document.createElement('div');
            this.Rows.forEach(Row => {
                const boardCell = document.createElement('span');
                boardCell.classList.add('board-cell');
                boardCell.setAttribute('data-col', Col);
                boardCell.setAttribute('data-row', Row);
                boardColumn.appendChild(boardCell);
            });
            Element.appendChild(boardColumn);
        });
    }

    placeShipsOnBoard(Ships) {
        Ships.forEach(Ship => {
            const { ship, x, y, rotation } = Ship;
            this.placeShip(ship, x, y, rotation);
            this.Ships.push(Ship.ship);
        });
    }

    areShipsSunk() {
        for (let Ship of this.Ships) {
            if(!Ship.sunk) {
                return false;
            }
            return true;
        }
    }

    resetBoard() {
        for (let Col of this.Columns) {
            for (let Row of this.Rows) {
                this.Board[Col][Row - 1] = '';
            }
        }
        this.Ships = [];
    }

    boardClickHandeler(Element) {
        const hitSound = new Audio('hit.wav');
        const missSound = new Audio('miss.wav');

        Element.addEventListener('click', (e) => {
            if(e.target.classList.contains('board-cell')) {
                const Cell = e.target;
                const Col = Cell.getAttribute('data-col');
                const Row = Cell.getAttribute('data-row');

                if (Cell.textContent === '❌') {
                    return;
                } else {
                    if (Engine.attackRound(Col, Row)) {
                        hitSound.play();
                        Cell.textContent = Engine.getAttacker().getSymbol();
                    } else {
                        missSound.play();
                        Cell.textContent = '❌';
                    }
                }
            }
            Game.UpdateUI();
        });
    }
}

const Engine = (() => {    
    const redBoard = new Gameboard();
    const blueBoard = new Gameboard();

    const redPlayer = new Player(redBoard, '🔴', 'Red');
    const bluePlayer = new Player(blueBoard, '🔵', 'Blue');

    let Attacker = bluePlayer;
    let Defender = redPlayer;

    const readyBoards = () => {
        const redShips = [
            { ship: new Ship(2), x: 1, y: 1, rotation: 'horizontal'},
        ];
        const blueShips = [
            { ship: new Ship(2), x: 1, y: 1, rotation: 'horizontal'},
        ];
    
        redBoard.placeShipsOnBoard(redShips);
        blueBoard.placeShipsOnBoard(blueShips);
    }

    getAttacker = () => {
        return Attacker;
    }

    getDefender = () => {
        return Defender;
    }

    switchPlayers = () => {
        Attacker == bluePlayer ? Attacker = redPlayer : Attacker = bluePlayer;
        Defender == redPlayer ? Defender = bluePlayer : Defender = redPlayer;
    }

    attackRound = (x, y) => {
        const attackResult = Attacker.attack(Defender.Board, x, y);
        switchPlayers();
        return attackResult;
    }

    gameOver = () => {
        if(getAttacker().Board.areShipsSunk()) {
            return true;
        }
        return false;
    }

    restartGame = () => {
        redBoard.resetBoard();
        blueBoard.resetBoard(); 
        readyBoards();
    }

    startGame = () => {
        readyBoards();
    }
    return { redBoard, blueBoard, attackRound, getDefender, getAttacker, gameOver, restartGame, startGame }
})();

const Game = (()=> {
    const redBoard = document.querySelector('.Red-player');
    const blueBoard = document.querySelector('.Blue-player');

    const gameOver = document.querySelector('.game-over');
    const currPlayer = document.querySelector('.current-player');

    const restartButton = document.querySelector('.restart-button');
    const startButton = document.querySelector('.start-button');

    const DefBoard = document.querySelector(`.${Engine.getDefender().ID}-player`);
    const AtkBoard = document.querySelector(`.${Engine.getAttacker().ID}-player`);

    AtkBoard.style.pointerEvents = 'none';
    DefBoard.style.pointerEvents = 'none';
    
    Engine.redBoard.displayBoard(redBoard);
    Engine.blueBoard.displayBoard(blueBoard);
   
    Engine.redBoard.boardClickHandeler(redBoard);
    Engine.blueBoard.boardClickHandeler(blueBoard);

    startButton.addEventListener('click', () => {
        Engine.startGame();
        UpdateUI();
        startButton.style.display = 'none';
    });

    restartButton.addEventListener('click', () => {
        const allCells = document.querySelectorAll('.board-cell');
        Engine.restartGame();
        gameOver.style.display = 'none';
        restartButton.style.display = 'none';
        allCells.forEach(Cell => Cell.textContent = '');
        console.log(allCells);
        UpdateUI();
    });

    const UpdateUI = () => {
        const DefBoard = document.querySelector(`.${Engine.getDefender().ID}-player`);
        const AtkBoard = document.querySelector(`.${Engine.getAttacker().ID}-player`);

        if(Engine.gameOver()) {
            gameOver.style.display = 'block';
            gameOver.textContent = `${Engine.getDefender().ID} player wins!`;

            restartButton.style.display = 'block';

            AtkBoard.style.pointerEvents = 'none';
            DefBoard.style.pointerEvents = 'none';
        } else {
            AtkBoard.style.pointerEvents = 'none';
            DefBoard.style.pointerEvents = 'auto';
        }

        currPlayer.innerHTML = `
        <span style='color: ${Engine.getAttacker().Color}'>${Engine.getAttacker().ID}</span> is attacking <span style='color: ${Engine.getDefender().Color}'>${Engine.getDefender().ID}'s</span> board
        `;
    }
    return { UpdateUI }
})();