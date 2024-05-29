import { forwardRef, useImperativeHandle, useState } from 'react';
import MoveUI from './MoveUI.jsx'

import './GameStatus.css'

const GameStatus = forwardRef(({ getGameStatus, getSideToMove, getPgn,
    isStalemate, isRepetition, isInsufficientMat }, ref) => {
    const [statusDisplay, setStatusDisplay] = useState('White to move.');
    // not const so that moves can be reset without unnecessarily updating state twice in updateStatus
    let [moves, setMoves] = useState([]);

    useImperativeHandle(ref, () => {
        return {
            updateStatus() {
                setStatusDisplay(getStatusDisplay());

                moves = [];
                let _splitPgn = getPgn().split(' ');
                // starting at 1 because index 0 is always 1.
                // continuing if divisible by 3 because those
                // elements are always numbers
                for (let i = 1; i < _splitPgn.length; i++) {
                    if (i % 3 == 0)
                        continue;

                    // storing index in moves list for key prop & display
                    moves.push([_splitPgn[i], moves.length]);
                }

                setMoves(moves);
            }
        }
    })
    
    function getStatusDisplay() {
        const _status = getGameStatus();
        let _side = getSideToMove();

        if (!_side)
            _side = 'White';

        if (_status === 'Checkmate')
            return _side + ' is checkmated.';

        if (_status === 'Draw')
        {
            if (isRepetition())
                return 'Draw by repetition.';

            if (isInsufficientMat())
                return 'Draw by insufficient material.';

            if (isStalemate())
                return 'Draw by stalemate.';
        }

        return _side + ' to move.';
    }

    let moveUI = [];
    for (let i = 0; i < moves.length; i++) {
        // skipping black's moves since they are already handled
        if (i % 2 == 1)
            continue;

        let _whiteMove = moves[i][0];
        let _blackMove = i == (moves.length - 1) ? '' : moves[i + 1][0];
        let _moveNum = Math.ceil((moves[i][1] + 1) / 2);

        moveUI.push(
            <>
                <MoveUI moveNum={_moveNum} whiteMove={_whiteMove} blackMove={_blackMove} key={_moveNum}/>
            </>
        );
    }

    return (
        <>
            <div id='gameInfo'>
                <h2 id='gameStatus'>
                    {statusDisplay}
                </h2>

                <div id='moves'>
                    {moveUI}
                </div>
            </div>
        </>
    )
});

export default GameStatus