import { useEffect } from "react";
import title from "../../assets/title_screen.png";

import CreateGameButton from "../../components/CreateGameButton/CreateGameButton";
import CreateGameForm from "../../components/CreateGameForm/CreateGameForm";
import "./HomePage.css";
import { socketClient } from "../../utils/socketClient";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  gamestateAtom,
  joiningAtom,
  myRoomAtom,
  nameAtom,
  profileAtom,
  roomsAtom,
} from "../../store/atoms";
import LobbyButton from "../../components/LobbyButton/LobbyButton";
import { useNavigate } from "react-router";
import JoinConfirmModal from "../../components/JoinConfirmModal/JoinConfirmModal";
import { GameControllerIcon } from "@phosphor-icons/react";

function HomePage() {
  const [rooms, setRooms] = useAtom(roomsAtom);
  const name = useAtomValue(nameAtom);
  const navigate = useNavigate();
  const setJoin = useSetAtom(joiningAtom);
  const [gameState, setGameState] = useAtom(gamestateAtom);
  const setMyRoom = useSetAtom(myRoomAtom);
  const [profile, setProfile] = useAtom(profileAtom);

  useEffect(() => {
    setMyRoom(null);
    socketClient.on("refreshRooms", (rooms) => {
      console.log("rooms", rooms);
      setRooms(rooms);
    });
    socketClient.on("updateGame", ({ room }) => {
      console.log("Game started");
      navigate(`/game/${room.id}`);
      const { id, ...game } = room;
      setGameState(game);
    });
    socketClient.on("joinedRoom", (data) => {
      console.log("joining");
      setMyRoom(data.room);
      navigate(`/waiting/${data.roomId}`);
      setJoin(true);
    });
    socketClient.emit("enteredLobby");

    return () => {
      socketClient.off("updateGame");
      socketClient.off("refreshRooms");
      socketClient.off("joinedRoom");
    };
  }, [setRooms, navigate, setGameState, setJoin]);

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="header-section">
          <img src={title} className="game-title" alt="Game Title" />
          <div className="player-info">
            <img
              className="profile-pic"
              src={
                new URL(
                  `../../assets/profiles/${profile ? profile : "default"}.jpg`,
                  import.meta.url
                ).href
              }
            />
            <span className="player-name">{name || "Anonymous"}</span>
          </div>
        </div>

        <div className="game-section">
          <div className="section-header">
            <h2 className="section-title">
              <GameControllerIcon size={24} className="controller-icon" />
              Game Rooms
            </h2>
            <CreateGameButton />
          </div>

          <div className="rooms-container">
            {rooms.length > 0 ? (
              <div className="rooms-list">
                {rooms.map((room) => (
                  <LobbyButton
                    key={room.id}
                    name={room.name}
                    maxPlayers={room.maxPlayers}
                    playerCount={room.players}
                    roomId={room.id}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <GameControllerIcon size={48} className="empty-icon" />
                <h3 className="empty-title">No Game Rooms Available</h3>
                <p className="empty-description">
                  Be the first to create a game room and invite your friends!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateGameForm />
      <JoinConfirmModal quittable={true} />
    </div>
  );
}

export default HomePage;
