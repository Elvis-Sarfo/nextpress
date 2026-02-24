import type { DefaultSession, DefaultJWT } from 'next-auth';
import type { SerializedPermission } from './permissions';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isAdmin: boolean;
      perms: SerializedPermission[];
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    isAdmin: boolean;
    perms: SerializedPermission[];
  }
}
