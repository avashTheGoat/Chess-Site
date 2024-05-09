import { useRef } from 'react';

import Title from './Title.jsx';
import OptionsBar from './OptionsBar.jsx';
import ChessBoard from './ChessBoard.jsx';
import GameStatus from './GameStatus.jsx';
import Settings from './Settings.jsx';

import engineURL from './EngineURL.js';

import './App.css';

export default function App() {
  const boardRef = useRef();
  const gameStatusRef = useRef();
  const settingsRef = useRef();

  function tryCallNoReturnFunc(func) {
    if (!func)
      return;

    func();
  }

  return (
    <>
      <div id='top' style={{display: 'flex', flexDirection: 'column', gap: 10}}>
        <Title/>
        <OptionsBar onResetClick={() => tryCallNoReturnFunc(boardRef.current.resetGame)}
         onSideClick={() => {
            tryCallNoReturnFunc(boardRef.current.swapPlayerSide);
            tryCallNoReturnFunc(boardRef.current.resetGame);
         }}
         onSettingsClick={() => tryCallNoReturnFunc(settingsRef.current.toggleDisplay)}
         />
      </div>

      <div id='main' style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <ChessBoard boardPixelSize={'425px'} initialPlayerSide={'White'} ref={boardRef}
         onStateChange={() => {
            if (!gameStatusRef.current)
              return;
            gameStatusRef.current.updateStatus();
          }}
          getOpponentMove={() => {
            const qParams = {};
            qParams.numPlies = `${settingsRef.current.getNumPlies()}`;
            qParams.useQuiescence = `${settingsRef.current.getQuiescence()}`;
            
            let pgn = boardRef.current.getPgn();
            const fenIndex = pgn.indexOf('FEN'); // happens if position is set from initial FEN
            if (fenIndex >= 0) {
              let _parsedFen = '';
              for (let i = fenIndex + 5; i < pgn.length; i++) {
                if (pgn.charAt(i) === '"')
                  break;

                _parsedFen += pgn.charAt(i);
              }

              qParams.fen = _parsedFen;

              let _parsedPgn = pgn.substring(pgn.indexOf('1.'), pgn.length);
              pgn = _parsedPgn;
            }

            qParams.pgn = `${pgn}`;

            let finalUrl = engineURL + '?';
            for (const [pName, pVal] of Object.entries(qParams)) {
              finalUrl += `${pName}=${pVal}&`;
            }
            finalUrl = finalUrl.substring(0, finalUrl.length - 1);

            return new Promise((resolve, reject) => {
              fetch(finalUrl).then(res => res.json()).then(resObj => resolve(resObj.move))
              .catch(e => reject(e));
            });
          }}/>
        <GameStatus getGameStatus={() => {
            if (!boardRef.current)
              return;
            return boardRef.current.getGameStatus();
          }}
         getSideToMove={() => {
            if (!boardRef.current)
              return;
            return boardRef.current.getSideToMove();
          }} ref={gameStatusRef}
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

      <Settings ref={settingsRef} onLoadFen={(fen) => {
        boardRef.current.setPosition(fen);
      }}/>
    </>
  )
}