import { View, Text, ScrollView, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '@/store/auth.store';
import { Ionicons } from '@expo/vector-icons';
import ProfileField from '@/components/ProfileField';
import CustomButton from '@/components/CustomButton';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {images} from "@/constants";
import { Image as RNImage } from 'react-native';


const Profile = () => {
    const { user, signOut, isLoading } = useAuthStore();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/(auth)/sign-in');
        } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
        }
    };

    const profileFields = [
        {
            label: 'Name',
            value: user?.name || 'Not set',
            icon: 'person-outline'
        },
        {
            label: 'Email',
            value: user?.email || 'Not set',
            icon: 'mail-outline'
        },
        {
            label: 'Account ID',
            value: user?.accountId || 'Not set',
            icon: 'card-outline'
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-4">
                {/* Profile Header */}
                <View className="items-center py-6">
                    <View className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                        <RNImage
                            source={images.profile}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    </View>

                    <Text className="mt-4 text-xl font-semibold">
                        {user?.name || 'User Name'}
                    </Text>
                    <Text className="text-gray-500">
                        {user?.email || 'email@example.com'}
                    </Text>
                </View>


                {/* Profile Fields */}
                <View className="gap-y-4">
                    {profileFields.map((field, index) => (
                        <ProfileField
                            key={index}
                            label={field.label}
                            value={field.value}
                            icon={field.icon}
                        />
                    ))}
                </View>

                {/* Actions */}
                <View className="mt-8 gap-y-4 mb-32">
                    <CustomButton
                        title="Edit Profile"
                        onPress={() => router.push('/edit-profile')}
                        style="bg-primary"
                        leftIcon={<Ionicons name="create-outline" size={20} color="white" />}
                    />

                    <CustomButton
                        title="Sign Out"
                        onPress={handleSignOut}
                        isLoading={isLoading}
                        style="bg-red-500"
                        leftIcon={<Ionicons name="log-out-outline" size={20} color="white" />}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;