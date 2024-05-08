import { forwardRef, useImperativeHandle, useState } from 'react';
import './GameStatus.css'

const GameStatus = forwardRef(({ getGameStatus, getSideToMove, isStalemate,
    isRepetition, isInsufficientMat }, ref) => {
    const [statusDisplay, setStatusDisplay] = useState('White to move.');

    useImperativeHandle(ref, () => {
        return {
            updateStatus() {
                setStatusDisplay(getStatusDisplay());
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

    return (
        <>
            <div id='gameInfo'>
                <h2 id='gameStatus'>
                    {statusDisplay}
                </h2>
            </div>
        </>
    )
});

export default GameStatus