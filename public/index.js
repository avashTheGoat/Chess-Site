let ENGINE_URL = null;

let playerSide = 'White';

let board = null;
let game = new Chess();

//#region Board Listeners
function onDrop(source, target, piece, newPos, oldPos, orientation) {
    let _playerMove = game.move({ from: source, to: target, promotion: 'q' })
    if (!_playerMove)
        return 'snapback';

    updateStatusText();

    // uncomment for player to be able to play
    // with themselves
    // playerSide = getSideToMove();

    try {
        doEngineMove().then(() => updateStatusText()).catch(error => console.error(error));
    }

    catch (error) {
        console.error(error);
    }
}

// disallows dragging when game is over OR piece
// is not player's side OR it is not player's turn to move
function onDragStart(source, piece, position, orientation) {
    if (game.in_checkmate() || game.in_draw())
        return false;

    return piece.charAt(0) === playerSide.charAt(0).toLowerCase() && getSideToMove() === playerSide;
}

function onSnapEnd() {
    board.position(game.fen());
}
//#endregion

let config = {
    position: 'start', pieceTheme: '/img/chesspieces/{piece}.png',
    draggable: true, onDragStart: onDragStart, onDrop: onDrop,
    onSnapEnd: onSnapEnd
}
board = Chessboard('board', config);

//#region Player Side Button
let $playerSideButton = $('#playerSide');

$playerSideButton.on('click', () => {
    if (playerSide === 'White')
        playerSide = 'Black';

    else playerSide = 'White';

    $playerSideButton.html(`<p>Side: ${playerSide}</p>`);
});
//#endregion

//#region Reset Button
let $resetButton = $('#reset');
$resetButton.on('click', () => {
    game = Chess();
    board.position(game.fen());
    $statusText.html('White to move');
});
//#endregion

//#region Plies
let $pliesSlider = $('#pliesSlider');
let $pliesDisplay = $('#pliesDisplay');

$pliesSlider.on('input', () => {
    $pliesDisplay.html(`Plies: ${$pliesSlider.val()}`)
});
//#endregion

//#region Status Text
let $statusText = $('#gameStatus')
function updateStatusText() {
    if (game.in_checkmate())
        $statusText.html(`${getSideToMove()} has been checkmated`);

    else if (game.in_draw())
        $statusText.html(`The game is a draw`);

    else $statusText.html(`${getSideToMove()} to move`)
}
//#endregion

//#region Engine
function getEngineMove() {
    return new Promise((resolve, reject) => {
        fetch( `${ENGINE_URL}/api/move?fen=${game.fen()}&numPlies=${$pliesSlider.val()}`)
        .then(response => response.json()).then(moveJson => resolve(moveJson))
        .catch(error => reject(error));
    });
}

function doEngineMove() {
    let _makeEngineMove = (move) => {
        return new Promise((resolve, reject) => {
            try {
                let _moveString = move.move;
                game.move({ from: _moveString.charAt(0) + _moveString.charAt(1),
                    to: _moveString.charAt(2) + _moveString.charAt(3),
                    promotion: _moveString.length == 5 ? _moveString.charAt(4) : ''
                });

                board.position(game.fen());
                resolve();
            }

            catch(error) {
                reject(error);
            }
        });
    }

    if (ENGINE_URL === null) {
        fetch('../engine_url.txt').then(_file => _file.text())
        .then(_text => {
            ENGINE_URL = _text;
            return getEngineMove().then(moveJson => _makeEngineMove(moveJson));
        })
    }

    else {
        return getEngineMove().then(moveJson => _makeEngineMove(moveJson));
    }
}
//#endregion

//#region Misc
function getSideToMove() {
    return game.turn() === 'b' ? 'Black' : 'White';
}
//#endregion