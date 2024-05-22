import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const ChessBoard = forwardRef(({ boardPixelSize, initialPlayerSide, onDropListener, onStateChange }, ref) => {
    let [board, setBoard] = useState(); // not const to set board to new Chessboard() later
    const game = useRef(new Chess());
    const playerSide = useRef(initialPlayerSide);

    useImperativeHandle(ref, () => {
        return {
            resetGame() {
                game.current = new Chess();
                board.position(game.current.fen());
                setBoard({...board});
            },
    
            setPosition(fen) {
                game.current.load(fen, { skipValidation: true });
                board.position(game.current.fen());
                setBoard({...board});
            },

            makeMove(moveObj) {
                game.current.move(moveObj);
                board.position(game.current.fen());
                setBoard({...board});
            },

            getGameStatus() {
                if (game.current.in_checkmate())
                    return 'Checkmate';

                if (game.current.in_draw())
                    return 'Draw';

                return 'Ongoing';
            },

            getSideToMove() {
                return _getSideToMove();
            },

            getPgn() {
                return game.current.pgn();
            },

            getFen() {
                return game.current.fen();
            },

            getPlayerSide() {
                return playerSide.current;
            },

            swapPlayerSide() {
                playerSide.current = playerSide.current === 'White' ? 'Black' : 'White';
                
                board.orientation('flip');
                setBoard({...board});
            },

            isRepetition() {
                return game.current.in_threefold_repetition();
            },

            isStalemate() {
                return game.current.in_stalemate();
            },

            isInsufficientMat() {
                return game.current.insufficient_material();
            }
        }
    });

    useEffect(() => {
        let config = {
            position: 'start', pieceTheme: './chesspieces/{piece}.png',
            draggable: true, onDragStart: onDragStart, onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
    
        board = new Chessboard('board', config);
        setBoard({...board});
    }, []);

    useEffect(() => {
        if (onStateChange)
            onStateChange()
    });

    function _getSideToMove() {
        return game.current.turn() === 'b' ? 'Black' : 'White';
    }

    //#region Board Listeners
    // disallows dragging when game is over OR
    // piece is not player's side OR it is not player's turn to move
    function onDragStart(source, piece, position, orientation) {
        if (game.current.in_checkmate() || game.current.in_draw())
            return false;

        const _side = playerSide.current;
        return piece.charAt(0) === _side.charAt(0).toLowerCase() && _getSideToMove() === _side;
    }

    function onDrop(source, target, piece, newPos, oldPos, orientation) {
        let _playerMove = game.current.move({ from: source, to: target, promotion: 'q' })
        if (!_playerMove)
            return 'snapback';

        if (onDropListener)
            onDropListener();
    }
    
    function onSnapEnd() {
        board.position(game.current.fen())
        setBoard({...board})
    }
    //#endregion

    return (
        <>
            <div id='board' style={{width: boardPixelSize}}></div>
        </>
    )
});

export default ChessBoard