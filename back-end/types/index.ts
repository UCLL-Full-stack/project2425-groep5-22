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
  email: string,
  password: string
}

export {
  GameInput,
  IntensityInput,
  MediaInput,
  TagInput,
  UserInput
}