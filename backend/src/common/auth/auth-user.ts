import type { PublicUser } from "../../users/users.types";

export type AuthUser = PublicUser;

export type JwtPayload = {
  id: string;
};
