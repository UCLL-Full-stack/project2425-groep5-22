import { Game } from "@/types";
import userService from "./UserService";

const getGames = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + userService.getUser()?.token
    },
  });
}

const createGame = async (game: Game) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userService.getUser()?.token
    },
    body: JSON.stringify(game),
  });
}

const getGameById = async (id: string) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + userService.getUser()?.token
    },
  });
}

const updateGame = async (id: string, game: Game) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userService.getUser()?.token
    },
    body: JSON.stringify(game),
  });
}

const deleteGame = async (id: string, game: Game) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userService.getUser()?.token
    },
    body: JSON.stringify(game),
  });
}

export default {
  getGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame
}