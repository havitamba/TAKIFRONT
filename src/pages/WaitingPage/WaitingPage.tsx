import { useNavigate, useParams } from "react-router";
import "./WaitingPage.css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  gamestateAtom,
  joinConfirmAtom,
  joiningAtom,
  myRoomAtom,
  nameAtom,
  profileAtom,
} from "../../store/atoms";
import { useEffect, useState } from "react";
import { socketClient } from "../../utils/socketClient";
import { toast } from "react-toastify";
import JoinConfirmModal from "../../components/JoinConfirmModal/JoinConfirmModal";
import {
  WifiHighIcon,
  WifiSlashIcon,
  UsersIcon,
  ArrowLeftIcon,
  ClockIcon,
  CrownIcon,
  UserIcon,
} from "@phosphor-icons/react";

function WaitingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const name = useAtomValue(nameAtom);
  const profile = useAtomValue(profileAtom);
  const [joining, setJoining] = useAtom(joiningAtom);
  const [valid, setValid] = useState(false);
  const setConfirm = useSetAtom(joinConfirmAtom);
  const setGameState = useSetAtom(gamestateAtom);
  const [myRoom, setMyRoom] = useAtom(myRoomAtom);
  const [isConnected, setIsConnected] = useState(true);
  const [dots, setDots] = useState("");

  // Animated dots for loading effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socketClient.on("refreshWaitingRoom", (room) => {
      setMyRoom(room);
      setIsConnected(true);
      console.log(room);
    });

    socketClient.on("updateGame", ({ room }) => {
      console.log("Game started");
      navigate(`/game/${room.id}`);
      const { id, ...game } = room;
      setGameState(game);
      console.log(game);
    });

    socketClient.on("connect", () => setIsConnected(true));
    socketClient.on("disconnect", () => setIsConnected(false));

    return () => {
      socketClient.off("refreshWaitingRoom");
      socketClient.off("updateGame");
      socketClient.off("connect");
      socketClient.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (joining) {
      setJoining(false);
      setValid(true);
    } else if (name) {
      console.log("setting null room");
      setMyRoom(null);
      socketClient.on("joinRoomError", (message) => {
        console.log(message);
        navigate("/");
        toast.error(message);
      });
      socketClient.on("joinedRoom", (data) => {
        setValid(true);
        setMyRoom(data.room);
      });
      socketClient.emit("joinRoom", {
        roomId: id,
        playerName: name,
        profile: profile,
      });
      setValid(true);
    } else {
      setConfirm(true);
    }
    return () => {
      socketClient.off("joinedRoom");
      socketClient.off("joinRoomError");
    };
  }, [name]);

  const playerCount = myRoom?.players.length || 0;
  const maxPlayers = myRoom?.maxPlayers || 0;
  const isRoomFull = playerCount >= maxPlayers;

  return (
    <div className="waiting-page">
      <div className="waiting-page__background-pattern"></div>

      <div className="waiting-page__container">
        {/* Connection Status */}
        <div className="waiting-page__connection-status">
          <div
            className={`connection-badge ${
              isConnected
                ? "connection-badge--connected"
                : "connection-badge--disconnected"
            }`}
          >
            {isConnected ? (
              <WifiHighIcon size={16} />
            ) : (
              <WifiSlashIcon size={16} />
            )}
            <span>{isConnected ? "Connected" : "Reconnecting..."}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="waiting-page__card">
          {/* Header */}
          <div className="waiting-page__header">
            <div className="waiting-page__title-section">
              <div className="waiting-page__title-container">
                <div className="pulse-dot"></div>
                <h1 className="waiting-page__title">Waiting Room</h1>
                <div className="pulse-dot"></div>
              </div>

              {valid ? (
                <div className="waiting-page__welcome">
                  <p className="waiting-page__welcome-text">
                    {"Welcome, "}
                    <span className="waiting-page__player-name">{name}</span>!
                  </p>
                  <p className="waiting-page__status-text">
                    Waiting for the game to start{dots}
                  </p>
                </div>
              ) : (
                <div className="waiting-page__validating">
                  <div className="waiting-page__validating-content">
                    <ClockIcon size={20} />
                    <p>Validating connection{dots}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room Info */}
          <div className="waiting-page__content">
            {myRoom && (
              <div className="room-info">
                <div className="room-info__header">
                  <h2 className="room-info__title">
                    <CrownIcon size={24} />
                    {myRoom?.name}
                  </h2>
                  <div className="room-info__status">
                    Game Status: <span>Waiting</span>
                  </div>
                </div>

                {/* Player Slots */}
                <div className="player-slots">
                  <div className="player-slots__header">
                    <h3 className="player-slots__title">
                      <UsersIcon size={24} />
                      Players ({playerCount}/{maxPlayers})
                    </h3>
                  </div>

                  <div className="player-slots__grid">
                    {Array.from({ length: maxPlayers }, (_, index) => (
                      <div
                        key={index}
                        className={`player-slot ${
                          index < playerCount
                            ? "player-slot--filled"
                            : "player-slot--empty"
                        }`}
                      >
                        <div className="player-slot__avatar">
                          {index < playerCount ? (
                            myRoom?.players[index].profile ? (
                              <img
                                className="profile"
                                src={
                                  new URL(
                                    `../../assets/profiles/${myRoom?.players[index].profile}.jpg`,
                                    import.meta.url
                                  ).href
                                }
                              />
                            ) : (
                              <UserIcon size={20} weight="fill" />
                            )
                          ) : (
                            <UserIcon size={20} weight="light" />
                          )}
                        </div>
                        <div className="player-slot__label">
                          {index < playerCount
                            ? myRoom?.players[index].name
                            : "Waiting..."}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Messages */}
                <div className="status-message">
                  {isRoomFull ? (
                    <div className="status-badge status-badge--full">
                      🎉 Room is full! Game should start soon...
                    </div>
                  ) : (
                    <div className="status-badge status-badge--waiting">
                      Waiting for {maxPlayers - playerCount} more{" "}
                      {maxPlayers - playerCount === 1 ? "player" : "players"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="waiting-page__actions">
              <button onClick={() => navigate("/")} className="back-button">
                <ArrowLeftIcon size={20} />
                <span>Back to Lobby</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="particle particle--1"></div>
        <div className="particle particle--2"></div>
        <div className="particle particle--3"></div>
      </div>

      {!name && <JoinConfirmModal quittable={false} />}
    </div>
  );
}

export default WaitingPage;
