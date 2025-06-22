import { useSetAtom } from "jotai";
import "./ChangeColorModal.css";
import { changeColorAtom } from "../../store/atoms";
import { socketClient } from "../../utils/socketClient";
import { useParams } from "react-router";

function ChangeColorModal() {
  const setChangeColor = useSetAtom(changeColorAtom);
  const change_color = new URL(
    `../../assets/change_color_borderless.png`,
    import.meta.url
  ).href;
  const { id } = useParams();

  const handleColorClick = (color: string) => {
    socketClient.emit("playCard", id, {
      color: color,
      value: "change_color",
    });
    setChangeColor(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal if clicking on the backdrop (not the color selector)
    if (e.target === e.currentTarget) {
      e.stopPropagation();
    }
  };

  return (
    <div className="color-selector-backdrop" onClick={handleBackdropClick}>
      <div className="color-selector">
        <div
          className="red button"
          onClick={() => {
            handleColorClick("red");
          }}
        />
        <div
          className="yellow button"
          onClick={() => {
            handleColorClick("yellow");
          }}
        />
        <div
          className="blue button"
          onClick={() => {
            handleColorClick("blue");
          }}
        />
        <div
          className="green button"
          onClick={() => {
            handleColorClick("green");
          }}
        />
      </div>
    </div>
  );
}

export default ChangeColorModal;
