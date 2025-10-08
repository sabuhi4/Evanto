import { z } from 'zod';

export const signUpSchema = z
    .object({
        fullName: z.string().min(1, 'Full name is required'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export const signInSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z
    .object({
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export const eventSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    user_id: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    location: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    featured: z.boolean().default(false),
    start_date: z.string().or(z.coerce.date()),
    end_date: z.string().or(z.coerce.date()),
    ticket_price: z.number().min(0, { message: 'Ticket price can not be negative' }).optional().nullable(),
    max_participants: z.number().optional().nullable(),
    image: z.string().optional().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    member_avatars: z.array(z.string()).optional().default([]),
    member_count: z.number().optional().default(0),
    type: z.literal('event').default('event'),
    status: z.string().default('active'),
});

export type Event = z.infer<typeof eventSchema>;

export const meetupSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    user_id: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    location: z.string().optional().nullable(),
    category: z.string().min(1, 'Category is required'),
    featured: z.boolean().default(false),
    start_date: z.string().or(z.coerce.date()),
    meetup_link: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    max_participants: z.number().optional().nullable(),
    member_avatars: z.array(z.string()).optional().default([]),
    member_count: z.number().optional().default(0),
    type: z.literal('meetup').default('meetup'),
    status: z.string().default('active'),
});

export type Meetup = z.infer<typeof meetupSchema>;

export const userSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    email: z.string().email('Invalid email format'),
    full_name: z.string().optional(),
    avatar_url: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    user_interests: z.array(z.string()).default([]),
    notifications_enabled: z.boolean().default(true),
    language: z.string().default('en'),
    dark_mode: z.boolean().default(false),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    last_login: z.string().optional().nullable(),
});

export type User = z.infer<typeof userSchema>;

export const paymentMethodSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    user_id: z.string().uuid().optional(),
    type: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
    card_type: z.string().optional(),
    last_four_digits: z.string().optional(),
    expiry_month: z.number().optional(),
    expiry_year: z.number().optional(),
    is_default: z.boolean().default(false),
    created_at: z.string().optional(),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;


export const bookingSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    user_id: z.string().uuid().optional(),
    event_id: z.string().uuid().optional(),
    order_number: z.string().min(1, 'Order number is required'),
    total_amount: z.number().min(0, 'Total amount cannot be negative'),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'refunded']).default('pending'),
    payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),
    payment_method_id: z.string().uuid().optional(),
    selected_seats: z.array(z.object({
        seat: z.string(),
        type: z.string(),
        row: z.number(),
        column: z.number(),
        price: z.number(),
    })).optional().default([]),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    confirmed_at: z.string().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const favoriteSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  user_id: z.string().uuid(),
  item_id: z.string().uuid(),
  item_type: z.enum(['event', 'meetup']),
  created_at: z.string().optional(),
});

export type Favorite = z.infer<typeof favoriteSchema>;

export type UnifiedItem = Event | Meetup;

export type AuthProvider = 'google' | 'apple' | 'facebook';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: AuthProvider;
}

export const bookingFormSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    gender: z.enum(['male', 'female']),
    birth_date: z.date(),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    country: z.string().min(1, 'Country is required'),
    accept_terms: z.boolean().refine(val => val, 'You must accept the terms'),
    event_id: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

