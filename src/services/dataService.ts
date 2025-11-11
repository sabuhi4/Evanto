import { supabase } from '@/utils/supabase';
import { 
  eventSchema, 
  meetupSchema, 
  userSchema,
  bookingSchema,
  favoriteSchema,
  type Event, 
  type Meetup, 
  type User,
  type Booking,
  type Favorite,
  type UnifiedItem
} from '@/utils/schemas';



const createItem = async <T>(table: string, schema: any, data: any): Promise<T> => {
  const validatedData = schema.omit({ id: true, created_at: true, updated_at: true }).parse(data);
  const { data: result, error } = await supabase
    .from(table)
    .insert(validatedData)
    .select()
    .single();
  if (error) throw error;
  return result;
};

const updateItem = async <T>(table: string, id: string, data: any): Promise<T> => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result;
};

const deleteItem = async (table: string, id: string): Promise<void> => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};

export const createEvent = (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => createItem<Event>('events', eventSchema, data);
export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*').neq('status', 'cancelled');
  if (error) throw error;
  return data || [];
};
export const updateEvent = (id: string, data: Partial<Event>) => updateItem<Event>('events', id, data);
export const deleteEvent = (id: string) => deleteItem('events', id);

export const createMeetup = (data: Omit<Meetup, 'id' | 'created_at' | 'updated_at'>) => createItem<Meetup>('meetups', meetupSchema, data);
export const getMeetups = async (): Promise<Meetup[]> => {
  const { data, error } = await supabase.from('meetups').select('*').neq('status', 'cancelled');
  if (error) throw error;
  return data || [];
};
export const updateMeetup = (id: string, data: Partial<Meetup>) => updateItem<Meetup>('meetups', id, data);
export const deleteMeetup = (id: string) => deleteItem('meetups', id);

export const createUser = (data: Omit<User, 'id' | 'created_at' | 'updated_at'>) => createItem<User>('users', userSchema, data);
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data || [];
};
export const updateUser = (id: string, data: Partial<User>) => updateItem<User>('users', id, data);
export const deleteUser = (id: string) => deleteItem('users', id);


export const createBooking = async (data: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'confirmed_at'>): Promise<Booking> => {
  const validatedData = bookingSchema.omit({ id: true, created_at: true, updated_at: true, confirmed_at: true }).parse(data);
  
  if (data.event_id) {
    const availability = await getSeatAvailability(data.event_id);
    const requestedSeats = data.selected_seats?.length || 0;
    
    if (requestedSeats > availability.availableSeats) {
      throw new Error(`Not enough seats available. Requested: ${requestedSeats}, Available: ${availability.availableSeats}`);
    }
    
    if (availability.isFullyBooked) {
      throw new Error('Event is fully booked');
    }
  }
  
  return createItem<Booking>('bookings', bookingSchema, validatedData);
};

export const getUserBookings = async (): Promise<Booking[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getEventBookings = async (eventId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('event_id', eventId)
    .in('status', ['pending', 'confirmed']);

  if (error) throw error;
  return data || [];
};

export const getSeatAvailability = async (eventId: string, maxParticipants?: number | null): Promise<{
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[];
  isFullyBooked: boolean;
}> => {
  const bookings = await getEventBookings(eventId);
  
  const bookedSeats: string[] = [];
  bookings.forEach(booking => {
    if (booking.selected_seats && Array.isArray(booking.selected_seats)) {
      booking.selected_seats.forEach((seat: any) => {
        if (seat.seat) {
          bookedSeats.push(seat.seat);
        }
      });
    }
  });

  const totalSeats = maxParticipants || 63;
  const availableSeats = totalSeats - bookedSeats.length;
  const isFullyBooked = availableSeats <= 0;

  return {
    totalSeats,
    availableSeats,
    bookedSeats,
    isFullyBooked
  };
};

export const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<Booking> => {
  const updateData: any = { 
    status,
    updated_at: new Date().toISOString(),
    ...(status === 'confirmed' && { confirmed_at: new Date().toISOString() })
  };

  if (status === 'cancelled') {
    updateData.selected_seats = [];
  }

  return updateItem<Booking>('bookings', bookingId, updateData);
};

export const fetchPaymentCards = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }
  return data || [];
};

export const createPaymentCard = async (cardData: {
  type: string;
  card_type: string;
  last_four_digits: string;
  expiry_month: number;
  expiry_year: number;
  is_default?: boolean;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const existingCards = await fetchPaymentCards();
  const shouldSetDefault = existingCards.length === 0;

  const insertData = {
    type: cardData.type,
    card_type: cardData.card_type,
    last_four_digits: cardData.last_four_digits,
    expiry_month: cardData.expiry_month,
    expiry_year: cardData.expiry_year,
    user_id: user.id,
    is_default: shouldSetDefault,
  };

  return createItem('payment_methods', null, insertData);
};

export const updatePaymentCard = async (id: string, cardData: Partial<{
  card_type: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}>) => {
  const updateData: any = { updated_at: new Date().toISOString() };
  
  if (cardData.card_type !== undefined) updateData.card_type = cardData.card_type;
  if (cardData.expiry_month !== undefined) updateData.expiry_month = cardData.expiry_month;
  if (cardData.expiry_year !== undefined) updateData.expiry_year = cardData.expiry_year;
  if (cardData.is_default !== undefined) updateData.is_default = cardData.is_default;

  return updateItem('payment_methods', id, updateData);
};

export const deletePaymentCard = (id: string) => deleteItem('payment_methods', id);

export const setDefaultPaymentCard = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', user.id);

  const { error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const fetchFavorites = async (userId: string) => {
  const { data, error } = await supabase.from('favorites').select('item_id,user_id,item_type').eq('user_id', userId);
  if (error) throw error;
  return data || [];
};

export const addFavorite = async (itemId: string, userId: string, itemType: 'event' | 'meetup') => {
  const { data: existing, error: checkError } = await supabase
    .from('favorites')
    .select('*')
    .eq('item_id', itemId)
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    return true;
  }
  const validatedData = favoriteSchema.omit({ id: true, created_at: true }).parse({
    user_id: userId,
    item_id: itemId,
    item_type: itemType
  });

  const { error } = await supabase
    .from('favorites')
    .insert(validatedData);
  if (error) throw error;
  return true;
};

export const deleteFavorite = async (itemId: string, userId: string) => {
  const { error } = await supabase.from('favorites').delete().match({ item_id: itemId, user_id: userId });
  if (error) throw error;
  return true;
};

export const fetchUserProfile = async (userId?: string) => {
  let authUser;
  if (userId) {
    const { data } = await supabase.auth.getUser();
    authUser = data.user;
  } else {
    const { data } = await supabase.auth.getUser();
    authUser = data.user;
  }
  
  if (!authUser) return null;

  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (!existingUser) {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        avatar_url: authUser.user_metadata?.avatar_url,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (createError) {
      if (createError.code === '23505' && createError.message.includes('email')) {
        const { data: existingUserByEmail } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle();
        
        if (existingUserByEmail) {
          return existingUserByEmail;
        }
      }
      throw createError;
    }
    return newUser;
  }

  return existingUser;
};

export const updateUserProfile = async (profileData: {
  full_name?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  user_interests?: string[];
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  return updateItem('users', user.id, {
    ...profileData,
    updated_at: new Date().toISOString()
  });
};

export const fetchUserStats = async (userId?: string) => {
  let user;
  if (userId) {
    user = { id: userId };
  } else {
    const authUser = (await supabase.auth.getUser()).data.user;
    if (!authUser) return null;
    user = authUser;
  }

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id')
    .eq('user_id', user.id);

  if (eventsError) throw eventsError;

  const { data: meetups, error: meetupsError } = await supabase
    .from('meetups')
    .select('id')
    .eq('user_id', user.id);

  if (meetupsError) throw meetupsError;

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id')
    .eq('user_id', user.id)
    .in('status', ['pending', 'confirmed']);

  if (bookingsError) throw bookingsError;

  return {
    events_created: events?.length || 0,
    meetups_created: meetups?.length || 0,
    total_created: (events?.length || 0) + (meetups?.length || 0),
    events_attending: bookings?.length || 0,
    followers: 0,
    following: 0
  };
};


export const getAllItems = async (options?: {
  page?: number;
  pageSize?: number;
  sortBy?: 'start_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}): Promise<UnifiedItem[]> => {
  const page = options?.page || 0;
  const pageSize = options?.pageSize || 20;
  const sortBy = options?.sortBy || 'start_date';
  const sortOrder = options?.sortOrder || 'asc';

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const eventsQuery = supabase
    .from('events')
    .select('*')
    .neq('status', 'cancelled')
    .order('featured', { ascending: false })
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to);

  const meetupsQuery = supabase
    .from('meetups')
    .select('*')
    .neq('status', 'cancelled')
    .order('featured', { ascending: false })
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to);

  const [eventsResult, meetupsResult] = await Promise.all([
    eventsQuery,
    meetupsQuery
  ]);

  if (eventsResult.error) throw eventsResult.error;
  if (meetupsResult.error) throw meetupsResult.error;

  const events: UnifiedItem[] = (eventsResult.data || []).map(event => ({
    ...event,
    type: 'event' as const,
  }));

  const meetups: UnifiedItem[] = (meetupsResult.data || []).map(meetup => ({
    ...meetup,
    type: 'meetup' as const,
  }));

  const result = [...events, ...meetups].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (!aValue || !bValue) return 0;

    const aDate = new Date(aValue).getTime();
    const bDate = new Date(bValue).getTime();
    return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
  });

  return result;
};

export const getItemById = async (id: string, type: 'event' | 'meetup'): Promise<UnifiedItem | null> => {
  const table = type === 'event' ? 'events' : 'meetups';
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) return null;
  
  const unifiedItem: UnifiedItem = {
    ...data,
    type: type as 'event' | 'meetup',
  };
  
  return unifiedItem;
};
