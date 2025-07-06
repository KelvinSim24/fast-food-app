import { create } from 'zustand';
import { User } from "@/type";
import {getCurrentUser} from "@/lib/appwrite";

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated:false,
    user:null,
    isLoading:true,

    setIsAuthenticated:(value) => set({isAuthenticated: value}),
    setLoading:(value) => ({isLoading:value}),
    setUser:(user) => set({user}),

    fetchAuthenticatedUser: async () => {
        set({isLoading:true});

        try {
    const user = await getCurrentUser();

    if(user) set({isAuthenticated:true,user: user as User});
    else set({isAuthenticated:false,user:null});
        } catch (error) {
            console.log('fetchAuthenticatedUser error:',error);
        } finally {
            set({isLoading:false});
        }
    }
}))

export default useAuthStore;