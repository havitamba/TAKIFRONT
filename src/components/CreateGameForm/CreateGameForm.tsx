import { useAtom } from "jotai";
import { gameFormAtom, nameAtom, profileAtom } from "../../store/atoms";

import "./CreateGameForm.css";
import { XIcon } from "@phosphor-icons/react";
import { Field, Formik } from "formik";
import { socketClient } from "../../utils/socketClient";
import { createGameSchema } from "../../schemas/schema";
import { profilePictures } from "../../utils/constants";

function CreateGameForm() {
  const [gameForm, setGameForm] = useAtom(gameFormAtom);
  const [name, setName] = useAtom(nameAtom);
  const [profile, setProfile] = useAtom(profileAtom);

  return (
    gameForm && (
      <div className="form-overlay">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Create New Game</h2>
            <button
              className="close-button"
              onClick={() => setGameForm(false)}
              aria-label="Close"
            >
              <XIcon size={20} />
            </button>
          </div>

          <Formik
            initialValues={{
              username: name,
              roomName: "",
              maxPlayers: "2",
              profilePicture: profile,
            }}
            validationSchema={createGameSchema}
            onSubmit={(values) => {
              socketClient.emit("createRoom", {
                playerName: values.username,
                roomName: values.roomName,
                maxPlayers: Number(values.maxPlayers),
                profile: values.profilePicture,
              });
              setProfile(values.profilePicture);
              setName(values.username);
              setGameForm(false);
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
              <form onSubmit={handleSubmit} className="form-content">
                <div className="input-group">
                  <label htmlFor="username" className="input-label">
                    Your Name
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className={`input-field ${
                      touched.username && errors.username ? "error" : ""
                    }`}
                    onChange={handleChange}
                    value={values.username}
                    placeholder="Enter your name"
                  />
                  {touched.username && errors.username && (
                    <span className="error-message">{errors.username}</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="roomName" className="input-label">
                    Room Name
                  </label>
                  <input
                    id="roomName"
                    name="roomName"
                    type="text"
                    className={`input-field ${
                      touched.roomName && errors.roomName ? "error" : ""
                    }`}
                    onChange={handleChange}
                    value={values.roomName}
                    placeholder="Enter room name"
                  />
                  {touched.roomName && errors.roomName && (
                    <span className="error-message">{errors.roomName}</span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="maxPlayers" className="input-label">
                    Max Players
                  </label>
                  <Field
                    as="select"
                    id="maxPlayers"
                    name="maxPlayers"
                    className={`select-field ${
                      touched.maxPlayers && errors.maxPlayers ? "error" : ""
                    }`}
                  >
                    <option value="2">2 Players</option>
                    <option value="3">3 Players</option>
                    <option value="4">4 Players</option>
                  </Field>
                  {touched.maxPlayers && errors.maxPlayers && (
                    <span className="error-message">{errors.maxPlayers}</span>
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

                <button type="submit" className="submit-button">
                  Create Game
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    )
  );
}

export default CreateGameForm;
