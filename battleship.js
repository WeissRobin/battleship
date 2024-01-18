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

    placeShip(Ship, Col, Row, Rotation = 'horizontal') {
        if (Rotation === 'horizontal') {
            for (let i = 0; i < Ship.length; i++) {
                this.Board[Col][(Row - 1) + i] = Ship;
            }
        }
        else {
            for (let i = 0; i < Ship.length; i++) {
                this.Board[Col + i][Row - 1] = Ship;
            }
        }
        return this.Board;
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
}

module.exports = { Ship, Gameboard }