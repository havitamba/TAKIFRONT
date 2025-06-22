import * as yup from 'yup';
import { REQUIRED_FIELD, ROOMNAME_CHARACTER_LIMIT, USERNAME_CHARACTER_LIMIT } from '../utils/constants';

export const createGameSchema = yup.object().shape({
	username: yup.string().required(REQUIRED_FIELD).max(30, USERNAME_CHARACTER_LIMIT),
	roomName: yup.string().required(REQUIRED_FIELD).max(30, ROOMNAME_CHARACTER_LIMIT),
    maxPlayers:yup.number().required(REQUIRED_FIELD)
});
export const joinGameSchema = yup.object().shape({
	playerName: yup.string().required(REQUIRED_FIELD).max(30, USERNAME_CHARACTER_LIMIT),
});