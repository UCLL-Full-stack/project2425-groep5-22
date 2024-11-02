import { Game } from "@/types";

const createGame = async (game: Game) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(game),
  });
}

export default {
  createGame
}