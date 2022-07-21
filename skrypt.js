var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit')
        
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss')
        
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipSunk: 0,

    ships: [
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] }],
    
    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);

            if (ship.hits[index] === 'hit') {
                view.displayMessage('Ups, już wcześniej trafiłeś to pole!');
                return true;
            }
           else if (index >= 0) {
                ship.hits[index] === 'hit'; 
                view.displayHit(guess);
                view.displayMessage('TRAFIONY!');
                
                if (this.isSunk(ship)) {
                    view.displayMessage('Zatopileś mój okręt!');
                    this.shipSunk++;
                }
                return true;
            }
        };
        view.displayMiss(guess);
        view.displayMessage('Spudłowałeś!');
        return false;
    },
    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++){
            if (ship.hits[i] !== 'hit') {
                return false;
            }
            
        }
        return true;
    },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++){
            do {
                locations = this.generateShip();
            } while (this.collision(location));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if (direction === 1) {
            // generujem poczatkowe pole okretu w ukladzie pionowym - wylosowano 1
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }
        else {
            row = Math.floor(Math.random() * this.boardSize - this.shipLength);
            col = Math.floor(Math.random() * this.boardSize);
            // generujemy poczatkowe pole okretu w ukladzie poziomym  - wylosowano 0 
        }
    
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++){
        if (direction === 1) {
            // dodajemy do tablicy[] pola okretu w ukladzie poziomym
            newShipLocations.push(row + ''+(col + i));
        }
        else {
            // dodajemy do tablicy[] pola okretu w ukladzie pionowym
            newShipLocations.push((row + i) + '' + col);
        }    
    }
    return newShipLocations; 
},
    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++){
            var ship = model.ships[i];
            for (var j = 0; j < location.length; j++){
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};


var controller = {
    guesses: 0,
    procesGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipSunk === model.numShips) {
                view.displayMessage('Zatopiłeś wszystkie moje okręty, w ' + this.guesses + ' próbach');
            }
        }
    }  
}


function parseGuess(guess) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    
    
    if (guess === null || guess.length !== 2) {
        alert('Ups, proszę wpisać literę i cyfrę')
    }
    else {
        firstChair = guess.charAt(0);
        firstChair = firstChair.toUpperCase();
        var row = alphabet.indexOf(firstChair);
       
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Ups, to nie są współrzędne');
        }
        else if (row < 0 || row > model.boardSize || column < 0 || column >= model.boardSize) {
            alert('Ups, pole poza planszą');
        }
        else {
            return row + column;
        }
    }
    return null;
};

function init() {
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleFireButton() {
    var guessInput = document.getElementById('guessInput');
    var guess = guessInput.value;
    controller.procesGuess(guess);

    guessInput.value = '';
};

function handleKeyPress(e) {
    var fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}



window.onload = init;
// controller.procesGuess('A0');

// controller.procesGuess('A6');
// controller.procesGuess('B6');
// controller.procesGuess('C6');