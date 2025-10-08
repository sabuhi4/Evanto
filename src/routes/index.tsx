import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { PublicRoute } from '@/components/guards/PublicRoute';

const SignIn = lazy(() => import('@/features/auth/SignIn').then(module => ({ default: module.SignIn })));
const SignUp = lazy(() => import('@/features/auth/SignUp').then(module => ({ default: module.SignUp })));
const ForgotPassword = lazy(() => import('@/features/auth/ForgotPassword'));
const EmailSent = lazy(() => import('@/features/auth/EmailSent'));
const VerifyCode = lazy(() => import('@/features/auth/VerifyCode').then(module => ({ default: module.VerifyCode })));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));

const SplashScreen = lazy(() => import('@/features/onboarding/SplashScreen').then(module => ({ default: module.SplashScreen })));
const OnboardingStep1 = lazy(() => import('@/features/onboarding/OnboardingStep1'));
const OnboardingStep2 = lazy(() => import('@/features/onboarding/OnboardingStep2'));
const OnboardingStep3 = lazy(() => import('@/features/onboarding/OnboardingStep3'));
const Welcome = lazy(() => import('@/features/Welcome'));
const ChooseYourInterests = lazy(() => import('@/features/onboarding/ChooseYourInterests'));
const Congratulation = lazy(() => import('@/features/onboarding/Congratulation'));

const CreateEvent = lazy(() => import('@/features/events/CreateEvent'));
const EventDetails = lazy(() => import('@/features/events/EventDetails'));
const UpdateEvent = lazy(() => import('@/features/events/UpdateEvent'));
const ManageEvents = lazy(() => import('@/features/events/ManageEvents'));

const CreateMeetupStep1 = lazy(() => import('@/features/meetups/CreateMeetupStep1'));
const CreateMeetupStep2 = lazy(() => import('@/features/meetups/CreateMeetupStep2'));
const CreateMeetupStep3 = lazy(() => import('@/features/meetups/CreateMeetupStep3'));

const Home = lazy(() => import('@/features/Home'));
const Search = lazy(() => import('@/features/Search'));
const Favorites = lazy(() => import('@/features/Favorites'));
const UpcomingEvent = lazy(() => import('@/features/UpcomingEvent'));

const BookEvent = lazy(() => import('@/features/bookings/BookEvent'));
const SelectSeats = lazy(() => import('@/features/bookings/SelectSeats'));
const Summary = lazy(() => import('@/features/bookings/Summary'));

const Ticket = lazy(() => import('@/features/tickets/Tickets'));
const TicketDetails = lazy(() => import('@/features/tickets/TicketDetails'));

const CreateCard = lazy(() => import('@/features/payments/CreateCard'));
const PaymentDetails = lazy(() => import('@/features/payments/PaymentDetails'));

const Profile = lazy(() => import('@/features/account/Profile').then(module => ({ default: module.Profile })));
const Settings = lazy(() => import('@/features/account/Settings').then(module => ({ default: module.Settings })));
const Language = lazy(() => import('@/features/profile/Language'));
const Notification = lazy(() => import('@/features/profile/Notification'));
const ChangePassword = lazy(() => import('@/features/profile/ChangePassword'));

const Help = lazy(() => import('@/features/support/Help'));
const Privacy = lazy(() => import('@/features/support/Privacy'));
const About = lazy(() => import('@/features/support/About'));

const LoadingSpinner = () => (
    <div className="flex-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

export const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<SplashScreen />} />
                
                <Route path="/auth/sign-in" element={<PublicRoute><SignIn /></PublicRoute>} />
                <Route path="/auth/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
                <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                <Route path="/auth/email-sent" element={<PublicRoute><EmailSent /></PublicRoute>} />
                <Route path="/auth/verify-code" element={<PublicRoute><VerifyCode /></PublicRoute>} />
                <Route path="/auth/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

                <Route path="/onboarding/step-1" element={<PublicRoute><OnboardingStep1 /></PublicRoute>} />
                <Route path="/onboarding/step-2" element={<PublicRoute><OnboardingStep2 /></PublicRoute>} />
                <Route path="/onboarding/step-3" element={<PublicRoute><OnboardingStep3 /></PublicRoute>} />
                <Route path="/onboarding/interests" element={<PublicRoute><ChooseYourInterests /></PublicRoute>} />
                <Route path="/onboarding/congratulations" element={<PublicRoute><Congratulation /></PublicRoute>} />
                <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />

                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/upcoming" element={<UpcomingEvent />} />

                <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/events/:id/edit" element={<ProtectedRoute><UpdateEvent /></ProtectedRoute>} />
                <Route path="/events/manage" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />

                <Route path="/meetups/create/step-1" element={<ProtectedRoute><CreateMeetupStep1 /></ProtectedRoute>} />
                <Route path="/meetups/create/step-2" element={<ProtectedRoute><CreateMeetupStep2 /></ProtectedRoute>} />
                <Route path="/meetups/create/step-3" element={<ProtectedRoute><CreateMeetupStep3 /></ProtectedRoute>} />

                <Route path="/bookings/event/:id" element={<ProtectedRoute><BookEvent /></ProtectedRoute>} />
                <Route path="/bookings/select-seats" element={<ProtectedRoute><SelectSeats /></ProtectedRoute>} />
                <Route path="/bookings/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />

                <Route path="/tickets" element={<Ticket />} />
                <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />

                <Route path="/payments/cards" element={<ProtectedRoute><CreateCard /></ProtectedRoute>} />
                <Route path="/payments/details" element={<ProtectedRoute><PaymentDetails /></ProtectedRoute>} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile/language" element={<ProtectedRoute><Language /></ProtectedRoute>} />
                <Route path="/profile/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
                <Route path="/profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Suspense>
    );
};
