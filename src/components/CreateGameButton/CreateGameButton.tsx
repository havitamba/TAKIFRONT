import { useSetAtom } from "jotai";
import "./CreateGameButton.css";
import { gameFormAtom } from "../../store/atoms";
import { Plus } from "@phosphor-icons/react";

function CreateGameButton() {
  const setGameForm = useSetAtom(gameFormAtom);
  
  return (
    <button 
      className="create-game-btn" 
      onClick={() => setGameForm(true)}
      aria-label="Create new game"
    >
      <Plus size={20} className="plus-icon" />
      <span className="btn-text">Create Game</span>
    </button>
  );
}

export default CreateGameButton;