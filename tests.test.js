const { Ship, Gameboard } = require('./battleship');

it('Sunk test no. 1 (sunked)', () => {
    let ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
});

it('Sunk test no. 2 (not sunked)', () => {
    let ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
});

it('Place ship test horizontal', () => {
    let _ship = new Ship(3);
    let _Gameboard = new Gameboard();
    expect(_Gameboard.placeShip(_ship, 1, 1, 'horizontal')).toEqual({
        '1': [
          _ship, _ship, _ship, 4,  5,
          6, 7, 8, 9, 10
        ],
        '2': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '3': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '4': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '5': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '6': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '7': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '8': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '9': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ],
        '10': [
          1, 2, 3, 4,  5,
          6, 7, 8, 9, 10
        ]
    });
})

it('Place ship test vertical', () => {
    let _ship = new Ship(3);
    let _Gameboard = new Gameboard();
    expect(_Gameboard.placeShip(_ship, 1, 1, 'vertical')).toEqual({
        '1': [
          _ship, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '2': [
          _ship, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '3': [
          _ship, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '4': [
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '5': [
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '6': [
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '7': [
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '8': [
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '9': [
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ],
        '10': [
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10
        ]
    }); 
})

it('Attack test (true)', () => {
    let _ship = new Ship(3);
    let _Gameboard = new Gameboard();

    _Gameboard.placeShip(_ship, 1, 1, 'horizontal');
    expect(_Gameboard.receiveAttack(1, 1)).toBeTruthy();
})

it('Attack test (false)', () => {
    let _ship = new Ship(3);
    let _Gameboard = new Gameboard();

    _Gameboard.placeShip(_ship, 1, 1, 'horizontal');
    expect(_Gameboard.receiveAttack(1, 4)).toBeFalsy();
})

it('Damaged test of ship', () => {
    let _ship = new Ship(3);
    let _Gameboard = new Gameboard();

    _Gameboard.placeShip(_ship, 1, 1, 'horizontal');
    _Gameboard.receiveAttack(1, 1);
    expect(_ship.damage).toBe(1);
})

it('Sunked ship', () => {
        let _ship = new Ship(3);
        let _Gameboard = new Gameboard();
    
        _Gameboard.placeShip(_ship, 1, 1, 'horizontal');
        _Gameboard.receiveAttack(1, 1);
        _Gameboard.receiveAttack(1, 2);
        _Gameboard.receiveAttack(1, 3);
        expect(_ship.sunk).toBeTruthy();
        expect(_ship.damage).toBe(3);
})