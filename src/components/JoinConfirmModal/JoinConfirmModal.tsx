import { useAtom } from "jotai";
import "./JoinConfirmModal.css";
import { joinConfirmAtom, nameAtom, profileAtom } from "../../store/atoms";
import { XIcon } from "@phosphor-icons/react";
import { Formik } from "formik";
import { socketClient } from "../../utils/socketClient";
import { joinGameSchema } from "../../schemas/schema";
import { profilePictures } from "../../utils/constants";

function JoinConfirmModal({ quittable }: { quittable: boolean }) {
  const [joinConfirm, setJoinConfirm] = useAtom(joinConfirmAtom);
  const [name, setName] = useAtom(nameAtom);
  const [profile, setProfile] = useAtom(profileAtom);

  return (
    joinConfirm && (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3 className="modal-title">Join Game</h3>
            {quittable && (
              <button
                className="close-button"
                onClick={() => setJoinConfirm(false)}
                aria-label="Close"
              >
                <XIcon size={18} />
              </button>
            )}
          </div>

          <Formik
            initialValues={{ playerName: name, profilePicture: profile }}
            validationSchema={joinGameSchema}
            onSubmit={(values) => {
              setName(values.playerName);
              setProfile(values.profilePicture);
              if (quittable) {
                socketClient.emit("joinRoom", {
                  roomId: joinConfirm,
                  playerName: values.playerName,
                  profile: values.profilePicture,
                });
              }
              setJoinConfirm(false);
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              touched,
              errors,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} className="modal-content">
                <div className="input-group">
                  <label htmlFor="playerName" className="input-label">
                    Your Name
                  </label>
                  <input
                    id="playerName"
                    name="playerName"
                    type="text"
                    className={`input-field ${
                      touched.playerName && errors.playerName ? "error" : ""
                    }`}
                    onChange={handleChange}
                    value={values.playerName}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  {touched.playerName && errors.playerName && (
                    <span className="error-message">{errors.playerName}</span>
                  )}
                </div>
                <div className="input-group">
                  <label className="input-label">Profile Picture</label>
                  <div className="profile-picture-grid">
                    {profilePictures.map((picture) => {
                      const profilePicPath = new URL(
                        `../../assets/profiles/${picture.name}.jpg`,
                        import.meta.url
                      ).href;

                      return (
                        <button
                          key={picture.id}
                          type="button"
                          className={`profile-picture-option ${
                            values.profilePicture === picture.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setFieldValue("profilePicture", picture.id)
                          }
                          title={picture.name}
                        >
                          <img className="profile-pic" src={profilePicPath} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" className="join-button">
                  Join Game
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    )
  );
}

export default JoinConfirmModal;
