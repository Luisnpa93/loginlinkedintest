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

export interface NewsletterConfig {
  title: string;
  username?: string;
  articles: Article[];
  events: Event[];
}

interface Article {
  title: string;
  summary: string;
  url: string;
}

interface Event {
  title: string;
  summary: string;
  url: string;
}
