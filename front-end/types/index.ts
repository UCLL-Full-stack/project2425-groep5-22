export type Game = {
  id?: number,
  user: User,
  intensity: Intensity,
  name: string,
  groups: boolean,
  duration: number,
  explanation: string,
  tags: (string | Tag)[],
  createdAt?: Date,
  updatedAt?: Date
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
  createdAt?: Date,
  updatedAt?: Date
}

export type Role = 'superadmin' | 'admin' | 'guest';

export type User = {
  id?: number,
  username?: string,
  email?: string,
  password?: string,
  games?: Game[],
  role?: Role,
  createdAt?: Date,
  updatedAt?: Date
}

export type AuthenticationResponse = {
  token: string,
  email: string,
  role: string
}

export type AuthStatus = {
  status: boolean,
  user?: User
}

export type Filter = {
  tags: string[],
  intensityId: number | null,
  groups: boolean | null,
  duration: number | null,
}