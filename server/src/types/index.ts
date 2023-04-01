import { User } from "src/entities/user.entity"

export type JwtPayload = {
    id: number,
    username?: string,
    linkedinId?: string,
    displayName?: string,
    email: string,
    linkedinEmail?: string,
    photo?: string
  }

export type LinkedInPayload = {
    user: User, 
    accessToken: string,
}