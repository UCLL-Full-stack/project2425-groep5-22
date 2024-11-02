export type Game = {
  id?: number,
  // user: UserInput,
  user?: any,
  intensity: Intensity,
  name: string,
  groups: boolean,
  duration: number,
  explanation: string,
  tags: string[]
}

export type Tag = {
  id?: number,
  tag: string,
  createdAt?: Date,
  updatedAt?: Date
}

export type Intensity = {
  id?: number,
  intensity: string,
  order: number,
  createdAt: Date,
  updatedAt: Date
}
