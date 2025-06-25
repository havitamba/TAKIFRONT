import { useAtom, useAtomValue } from "jotai";
import {
  changeColorAtom,
  gameoverAtom,
  gamestateAtom,
  nameAtom,
} from "../../store/atoms";
import Card from "../../components/Card/Card";
import { useEffect } from "react";
import { socketClient } from "../../utils/socketClient";
import GameOver from "../../components/GameOver/GameOver";
import "./GamePage.css";
import ChangeColorModal from "../../components/ChangeColorModal/ChangeColorModal";

function GamePage() {
  const [gameState, setGameState] = useAtom(gamestateAtom);
  const [gameOver, setGameOver] = useAtom(gameoverAtom);
  const name = useAtomValue(nameAtom);
  const changeColor = useAtomValue(changeColorAtom);

  useEffect(() => {
    socketClient.on("updateGame", ({ room }) => {
      const { id, ...game } = room;
      setGameState(game);
      console.log("game is ", game);
    });
    socketClient.on("gameOver", (data) => {
      setGameOver(data);
    });

    return () => {
      socketClient.off("gameOver");
      socketClient.off("updateGame");
    };
  }, []);

  // Find current player for turn indicator
  const currentPlayer = gameState?.players.find(
    (player) => player.name === name
  );
  const isCurrentPlayerTurn = gameState?.players[gameState?.turn].name === name;

  const yourIndex = gameState?.players.findIndex((p) => p.name === name);

  // Create reordered opponents starting from your position + 1
  const reorderedOpponents = [];
  if (gameState?.players && yourIndex !== undefined) {
    for (let i = 1; i < gameState.players.length; i++) {
      const nextIndex = (yourIndex + i) % gameState.players.length;
      reorderedOpponents.push(gameState.players[nextIndex]);
    }
  }

  return !gameOver.winner ? (
    <div className="gameContainer">
      {/* Opponents Section */}
      <div className="opponentsSection">
        {reorderedOpponents.map((player, playerIndex) => (
          <div
            key={playerIndex}
            className={`opponentContainer ${
              gameState?.players[gameState?.turn].name === player.name
                ? "current-turn"
                : ""
            }`}
          >
            <div className="playerInfo">
              <img
                className="profile-pic"
                src={
                  new URL(
                    `../../assets/profiles/${
                      player.profile ? player.profile : "default"
                    }.jpg`,
                    import.meta.url
                  ).href
                }
                alt={`${player.name}'s profile`}
              />
              <div className="playerName">{player.name}</div>
            </div>
            <div className="opponentHand">
              {Array.from(
                { length: Math.min(player.hand!, 10) },
                (_, index) => (
                  <Card type="opp" key={index} />
                )
              )}
              {player.hand! > 10 && (
                <div className="card-overflow">+{player.hand! - 10}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Center Game Area */}
      <div className="centerArea">
        <div className="gameCards">
          <div className="drawPile">
            <Card type="draw" />
            <span className="cardLabel">Draw</span>
          </div>
          <div className="discardPile">
            <Card card={gameState?.discard} />
            <span className="cardLabel">Discard</span>
          </div>
        </div>
      </div>

      {/* Player Hand Section */}
      <div
        className={`playerSection ${isCurrentPlayerTurn ? "current-turn" : ""}`}
      >
        <div className="playerInfo">
          <img
            className="profile-pic"
            src={
              new URL(
                `../../assets/profiles/${
                  currentPlayer?.profile ? currentPlayer.profile : "default"
                }.jpg`,
                import.meta.url
              ).href
            }
            alt="Your profile"
          />
          <div className="playerName">Your Hand</div>
        </div>
        <div className="playerHand">
          {gameState?.hand.map((card, index) => (
            <Card type={"player"} card={card} key={index} />
          ))}
        </div>
      </div>
      {changeColor && <ChangeColorModal />}
    </div>
  ) : (
    <GameOver />
  );
}

export default GamePage;
