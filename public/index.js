let ENGINE_URL = null;

let playerSide = 'White';

let $board = $('#board');

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

    doEngineMove();

    updateStatusText();
}

// disallows dragging when game is over OR piece
// is not player's side OR it is not player's turn to move
function onDragStart(source, piece, position, orientation) {
    if (game.in_checkmate() || game.in_draw())
        return false;

    return piece.charAt(0) === playerSide.charAt(0).toLowerCase() && getSideToMove() === playerSide;
}

function updateBoardPos() {
    board.position(game.fen());
}
//#endregion

let config = {
    position: 'start', pieceTheme: '/img/chesspieces/{piece}.png',
    draggable: true, onDragStart: onDragStart, onDrop: onDrop,
    onSnapEnd: updateBoardPos
}
board = Chessboard('board', config);

//#region Player Side Button
let $playerSideButton = $('#playerSide');

// $playerSideButton.on('click', () => {
//     if (playerSide === 'White')
//         playerSide = 'Black';

//     else playerSide = 'White';

//     $playerSideButton.html(`<p>Side: ${playerSide}</p>`);
// });
//#endregion

//#region Reset Button
let $resetButton = $('#reset');
$resetButton.on('click', () => {
    game = Chess();
    board.position(game.fen());

    $statusText.html(`${getSideToMove()} to move`);
});
//#endregion

//#region Settings Menu
//#region Opening & Closing
let $settings = $('#settings');
$settings.css('display', 'none');

let $settingsOpenButton = $('#settingsButton');
$settingsOpenButton.on('click', () => {
    $settings.css('display', 'block');
});

let $settingsCloseButton = $('#settingsClose');
$settingsCloseButton.on('click', () => {
    $settings.css('display', 'none');
    $board.css('display', 'block');
});
//#endregion

//#region Engine Settings
//#region Plies
let $pliesSlider = $('#pliesSlider');
let $pliesDisplay = $('#pliesDisplay');

$pliesSlider.on('input', () => {
    $pliesDisplay.html(`Plies: ${$pliesSlider.val()}`)
});
//#endregion

let $quiescenceCheckbox = $('#useQuiescenceInput');
//#endregion

//#region Initial FEN
let $initialFenInput = $('#initialFenInput');
let $loadFenButton = $('#loadFenButton');
$loadFenButton.on('click', () => {
    console.log(`Initial fen: ${$initialFenInput.val()}`);

    game = new Chess($initialFenInput.val());
    board.position(game.fen());
    ghostBoard.position(game.fen());
});
//#endregion
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
function getEngineMove(callback) {
    fetch( `${ENGINE_URL}api/move?fen=${game.fen()}&numPlies=${$pliesSlider.val()}`
    + `&shouldUseQuiescence=${$quiescenceCheckbox.is(':checked')}`)
    .then(response => response.json()).then(response => callback(response))
    .catch(error => console.error(error));
}

function doEngineMove(callback) {
    let _makeEngineMove = (move) => {
        let _moveString = move.move;

        game.move({ from: _moveString.charAt(0) + _moveString.charAt(1),
            to: _moveString.charAt(2) + _moveString.charAt(3),
            promotion: _moveString.length == 5 ? _moveString.charAt(4) : ''
        })
        board.position(game.fen());
        callback();
    }

    if (!ENGINE_URL) {
        fetch('../engine_url.txt').then(_file => _file.text())
        .then(_text => {
            ENGINE_URL = _text;
            getEngineMove(_makeEngineMove);
        })
    }

    else getEngineMove(_makeEngineMove);
}
//#endregion

//#region Misc
function getSideToMove() {
    return game.turn() === 'b' ? 'Black' : 'White';
}
//#endregion