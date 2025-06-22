import { useAtomValue, useSetAtom } from "jotai";
import { useParams } from "react-router";
import { changeColorAtom, gamestateAtom } from "../../store/atoms";
import type { CardInterface } from "../../types";
import { socketClient } from "../../utils/socketClient";

function Card({ card, type }: { card?: CardInterface; type?: string }) {
  const gameState = useAtomValue(gamestateAtom);
  const myTurn = gameState?.myId == gameState?.players[gameState.turn].id;
  const { id } = useParams();
  const setChangeColor = useSetAtom(changeColorAtom);
  const cardImagePath = card
    ? new URL(
        `../../assets/cards/${[
          card.color == "none" ? "" : card.color + "_",
          card.value,
        ].join("")}.png`,
        import.meta.url
      ).href
    : type == "opp" || type == "draw"
    ? new URL(`../../assets/cards/card_back.png`, import.meta.url).href
    : "";

  return (
    <img
      src={cardImagePath}
      className="card"
      style={
        (type == "player" && myTurn) || (type == "draw" && myTurn)
          ? { cursor: "pointer" }
          : {}
      }
      onClick={() => {
        if (type == "player" && myTurn) {
          if (card?.value == "change_color") {
            setChangeColor(true);
          } else {
            socketClient.emit("playCard", id, card);
          }
        } else if (type == "draw" && myTurn) {
          socketClient.emit("playCard", id, "draw");
        }
      }}
    ></img>
  );
}
export default Card;
