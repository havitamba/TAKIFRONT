import { useAtom } from "jotai";
import { gameoverAtom } from "../../store/atoms";
import "./GameOver.css";
import { useNavigate } from "react-router";
import Confetti from "react-confetti";

function GameOver() {
  const [gameOver, setGameOver] = useAtom(gameoverAtom);
  const navigate = useNavigate();

  const isWinner = gameOver.result === "win";

  return (
    <div className="gameover-overlay">
      <div className={`gameover-container ${isWinner ? "winner" : "loser"}`}>
        <div className="gameover-header">
          <h1 className="gameover-title">Game Over!</h1>
          <div
            className={`result-badge ${
              isWinner ? "winner-badge" : "loser-badge"
            }`}
          >
            {isWinner ? "🎉 Victory! 🎉" : "💔 Defeat 💔"}
          </div>
        </div>

        <div className="gameover-content">
          <p className="result-text">
            {isWinner ? "Congratulations! You won!" : "Skill Issue"}
          </p>

          {gameOver.result === "lose" && gameOver.winner && (
            <p className="winner-announcement">
              The winner is{" "}
              <span className="winner-name">{gameOver.winner}</span>
            </p>
          )}
        </div>

        <div className="gameover-actions">
          <button
            className="back-button"
            onClick={() => {
              setGameOver({ winner: null, result: null });
              navigate("/");
            }}
          >
            <span className="button-icon">🏠</span>
            Back to Lobby
          </button>
        </div>
      </div>
      {isWinner && <Confetti />}
    </div>
  );
}

export default GameOver;
