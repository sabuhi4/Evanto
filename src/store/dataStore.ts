import { create } from 'zustand';

interface MeetupCreation {
  title: string;
  start_date: string;
  category: string;
  description: string;
  meetup_link: string | null;
  location: string | null;
  image: string | null;
  max_participants: number | null;
  step: number;
}

interface DataState {
  meetupCreation: MeetupCreation;
  updateMeetupCreation: (updates: Partial<MeetupCreation>) => void;
  setMeetupCreationStep: (step: number) => void;
  resetMeetupCreation: () => void;
}

const initialMeetupCreation: MeetupCreation = {
  title: '',
  start_date: '',
  category: 'Other',
  description: '',
  meetup_link: null,
  location: null,
  image: null,
  max_participants: null,
  step: 1,
};

export const useDataStore = create<DataState>((set) => ({
  meetupCreation: initialMeetupCreation,
  
  updateMeetupCreation: (updates) => set(state => ({
    meetupCreation: { ...state.meetupCreation, ...updates }
  })),
  
  setMeetupCreationStep: (step) => set(state => ({
    meetupCreation: { ...state.meetupCreation, step }
  })),
  
  resetMeetupCreation: () => set({ meetupCreation: initialMeetupCreation }),
}));