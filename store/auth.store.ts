import { create } from 'zustand';
import { User } from "@/type";
import { getCurrentUser, account, databases } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite";

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;
    updateProfile: (userData: Partial<User>) => Promise<void>;
    signOut: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setLoading: (value) => set({ isLoading: value }),
    setUser: (user) => set({ user }),

    fetchAuthenticatedUser: async () => {
        set({ isLoading: true });

        try {
            const user = await getCurrentUser();
            if (user) set({ isAuthenticated: true, user: user as User });
            else set({ isAuthenticated: false, user: null });
        } catch (error) {
            console.log('fetchAuthenticatedUser error:', error);
            set({ isAuthenticated: false, user: null });
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (userData: Partial<User>) => {
        try {
            set({ isLoading: true });
            const currentUser = get().user;

            if (!currentUser?.$id) throw new Error('No user found');

            // Update name in Appwrite account if provided
            if (userData.name) {
                await account.updateName(userData.name);
            }

            // Update user document in database
            const updatedUser = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                currentUser.$id,
                userData
            );

            set({ user: updatedUser as User });
        } catch (error) {
            console.log('updateProfile error:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        try {
            set({ isLoading: true });
            await account.deleteSession('current');
            set({
                isAuthenticated: false,
                user: null
            });
        } catch (error) {
            console.log('signOut error:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;