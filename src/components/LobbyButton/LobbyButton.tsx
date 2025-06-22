import { useSetAtom } from "jotai";
import "./LobbyButton.css";
import { joinConfirmAtom } from "../../store/atoms";
import { UserIcon } from "@phosphor-icons/react";

function LobbyButton({
  name,
  maxPlayers,
  playerCount,
  roomId,
}: {
  name: string;
  maxPlayers: number;
  playerCount: number;
  roomId: string;
}) {
  const setConfirm = useSetAtom(joinConfirmAtom);
  const isFull = playerCount >= maxPlayers;

  return (
    <button
      className={`lobby-card ${isFull ? "full" : ""}`}
      onClick={() => {
        if (!isFull) {
          setConfirm(roomId);
        }
      }}
      disabled={isFull}
    >
      <div className="lobby-info">
        <h3 className="room-name">{name}</h3>
        <div className="player-info">
          <UserIcon size={16} className="users-icon" />
          <span className="player-count">
            {playerCount}/{maxPlayers} players
          </span>
        </div>
      </div>

      <div className="join-indicator">
        {isFull ? (
          <span className="status-badge full">Full</span>
        ) : (
          <span className="status-badge available">Join</span>
        )}
      </div>
    </button>
  );
}

export default LobbyButton;
