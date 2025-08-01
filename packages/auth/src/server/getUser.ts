// packages/auth/src/server/getServerUser.ts
import { User } from '../types';
import {config} from "@unpuzzle/config"

export async function getUser(): Promise<User | null> {
  try {
    const res = await fetch(config.authRoute, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) return null;

    const {body} = await res.json();
    return body as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
