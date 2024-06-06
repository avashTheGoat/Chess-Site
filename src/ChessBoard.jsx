import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const ChessBoard = forwardRef(({ playerSide, boardPixelSize, onDropListener, onStateChange }, ref) => {
    const [board, setBoard] = useState();
    const game = useRef(new Chess());

    const playerSideRef = useRef();
    playerSideRef.current = playerSide;

    useImperativeHandle(ref, () => {
        return {
            flip() {
                board.orientation('flip');
                setBoard({...board});
            },

            resetGame() {
                game.current = new Chess();
                board.position(game.current.fen());
                setBoard({...board});
            },
    
            setPosition(fen, isInstant) {
                game.current.load(fen, { skipValidation: true });
                board.position(game.current.fen(), isInstant);
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

            isRepetition() {
                return game.current.in_threefold_repetition();
            },

            isStalemate() {
                return game.current.in_stalemate();
            },

            isInsufficientMat() {
                return game.current.insufficient_material();
            },

            isGameOver() {
                return game.current.in_checkmate() || game.current.in_draw();
            }
        }
    });

    useEffect(() => {
        const config = {
            position: 'start', pieceTheme: './chesspieces/{piece}.png',
            draggable: true, onDragStart: onDragStart, onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
    
        setBoard({...new Chessboard('board', config)});
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

        const _side = playerSideRef.current;
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