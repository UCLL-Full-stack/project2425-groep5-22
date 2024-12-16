type Role = "superadmin" | "admin" | "guest";

type GameInput = {
  id?: number,
  user: UserInput,
  intensity: IntensityInput,
  name: string,
  groups: boolean,
  duration: number,
  explanation: string,
  tags: string[]
}

type IntensityInput = {
  id?: number,
  intensity: string,
  order: number
}

type MediaInput = {
  id?: number,
  game: GameInput,
  name: string,
  file: string,
  filetype: string
}

type TagInput = {
  id?: number,
  tag: string,
}

type UserInput = {
  id?: number,
  username: string,
  role: Role,
  email: string,
  password: string
}

type AuthenticationResponse = {
  token: string;
  email: string;
  role: Role;
};

export {
  Role,
  GameInput,
  IntensityInput,
  MediaInput,
  TagInput,
  UserInput,
  AuthenticationResponse
}