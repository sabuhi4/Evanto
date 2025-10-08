import { User } from '@supabase/supabase-js';

export interface UserProfile {
  avatar_url?: string;
  full_name?: string;
}

export interface AuthUser {
  avatar_url?: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
}

export const getAvatarSource = (
  profile?: UserProfile | null,
  user?: AuthUser | null
): string | undefined => {
  if (profile?.avatar_url) {
    return profile.avatar_url;
  }
  
  if (user?.avatar_url) {
    return user.avatar_url;
  }
  
  if (user?.user_metadata?.avatar_url) {
    return user.user_metadata.avatar_url;
  }
  
  return undefined;
};

export const getUserInitials = (
  profile?: UserProfile | null,
  user?: AuthUser | null
): string => {
  const name = profile?.full_name || 
               user?.user_metadata?.full_name || 
               user?.user_metadata?.name || 
               user?.email?.split('@')[0] || 
               'User';
  
  return name
    .split(' ')
    .map((word: string) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
export const getAvatarProps = (
  profile?: UserProfile | null,
  user?: AuthUser | null,
  size: number = 40
) => {
  const src = getAvatarSource(profile, user);
  const initials = getUserInitials(profile, user);
  
  return {
    src,
    children: !src ? initials : undefined,
    sx: {
      width: size,
      height: size,
      bgcolor: !src ? '#5D9BFC' : undefined,
      color: !src ? 'white' : undefined,
      fontSize: size * 0.4,
      fontWeight: 'bold',
    }
  };
};
