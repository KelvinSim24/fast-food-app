import { View, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '@/store/auth.store';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const EditProfile = () => {
    const { user, updateProfile, isLoading } = useAuthStore();
    const [name, setName] = useState(user?.name || '');

    const handleUpdate = async () => {
        try {
            await updateProfile({ name });
            Alert.alert('Success', 'Profile updated successfully');
            router.push('/profile');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 px-4 py-6">
                <View className="gap-y-4">
                    <CustomInput
                        label="Name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View className="mt-8">
                    <CustomButton
                        title="Save Changes"
                        onPress={handleUpdate}
                        isLoading={isLoading}
                        style="bg-primary"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;