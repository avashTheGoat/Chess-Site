import { useRef, useState } from 'react';

import OptionsBar from './OptionsBar.jsx';
import ChessBoard from './ChessBoard.jsx';
import GameStatus from './GameStatus.jsx';
import Settings from './Settings.jsx';

import engineURL from './EngineURL.js';

import './App.css';

export default function App() {
  const [playerSide, setPlayerSide] = useState('White');
  
  const boardRef = useRef();
  const gameStatusRef = useRef();
  const settingsRef = useRef();

  function tryCallNoReturnFunc(func) {
    if (!func)
      return;

    func();
  }

  /**
   * Parses the board's PGN. If the board was not set with an initial FEN,
   * the FEN will be an empty string.
   * @returns an array with FEN first and PGN second
   */
  function getParsedPosition() {
    let pgn = boardRef.current.getPgn();
    const fenIndex = pgn.indexOf('FEN'); // happens if position is set from initial FEN

    if (fenIndex < 0)
      return ['', pgn];

    let _parsedFen = '';
    for (let i = fenIndex + 5; i < pgn.length; i++) {
      if (pgn.charAt(i) === '"')
        break;

      _parsedFen += pgn.charAt(i);
    }

    const _pgnStart = pgn.indexOf('1.');
    if (_pgnStart < 0)
      return [_parsedFen, ''];

    let _parsedPgn = pgn.substring(_pgnStart, pgn.length);
    return [_parsedFen, _parsedPgn];
  }

  /**
   * Makes a fetch request to the engine API and returns a Promise.
   * @returns a Promise object that resolves the string move.
   */
  function fetchEngineMove() {
    const qParams = {};
    qParams.numPlies = `${settingsRef.current.getNumPlies()}`;
    qParams.useQuiescence = `${settingsRef.current.getQuiescence()}`;
    
    const [fen, pgn] = getParsedPosition();
    qParams.fen = `${fen}`
    qParams.pgn = `${pgn}`;

    let finalUrl = engineURL + '?';
    for (const [pName, pVal] of Object.entries(qParams))
      finalUrl += `${pName}=${pVal}&`;
    finalUrl = finalUrl.substring(0, finalUrl.length - 1);

    return new Promise((resolve, reject) => {
      fetch(finalUrl).then(res => res.json()).then(resObj => resolve(resObj.move))
      .catch(e => reject(e));
    });
  }

  function swapPlayerSide() {
    if (!boardRef.current.flip)
      return;

    setPlayerSide((_side) => _side === 'White' ? 'Black' : 'White');
    boardRef.current.flip();
  }

  return (
    <>
      <div id='top' style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        <h1>Epic Chess Engine</h1>
        <OptionsBar curSide={playerSide} onResetClick={() => tryCallNoReturnFunc(boardRef.current.resetGame)}
          onSideClick={() => {
            swapPlayerSide();
            tryCallNoReturnFunc(boardRef.current.resetGame);
          }}
          onSettingsClick={() => tryCallNoReturnFunc(settingsRef.current.toggleDisplay)}/>
      </div>

      <div id='main' style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <ChessBoard ref={boardRef} playerSide={playerSide} boardPixelSize={'425px'}
         onStateChange={() => {
            if (gameStatusRef.current)
              gameStatusRef.current.updateStatus();
            
            if (boardRef.current)
            {
              if (!boardRef.current.isGameOver() &&
                  boardRef.current.getSideToMove() != playerSide)
              {
                fetchEngineMove().then(move => {
                  const from = move.substring(0, 2);
                  const to = move.substring(2, 4);
                  const promotion = move.length === 5 ? move.charAt(4) : '';
                  
                  boardRef.current.makeMove({from: from, to: to, promotion: promotion});
                }).catch(e => console.error(e));
              }
            }
          }}/>
        <GameStatus ref={gameStatusRef}
          getGameStatus={() => {
            if (!boardRef.current)
              return;
            return boardRef.current.getGameStatus();
          }}
          getPgn={() => { return getParsedPosition()[1]; }}
          getSideToMove={() => {
            if (!boardRef.current)
              return;
            return boardRef.current.getSideToMove();
          }}
          isRepetition={() => {
            if (!boardRef.current)
              return;
            return boardRef.current.isRepetition();
          }}
          isInsufficientMat={() => {
            if (!boardRef.current)
              return;
            return boardRef.current.isInsufficientMat();
          }}
          isStalemate={() => {
            if (!boardRef.current)
              return;
            return boardRef.current.isStalemate();
          }}/>
      </div>

      <Settings ref={settingsRef}
       onLoadFen={(fen) => boardRef.current.setPosition(fen, true)}/>
    </>
  )
}