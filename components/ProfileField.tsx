import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ProfileFieldProps {
    label: string;
    value: string;
    icon: string;
}

const ProfileField = ({ label, value, icon }: ProfileFieldProps) => {
    return (
        <View className="flex-row items-center p-4 bg-gray-50 rounded-xl">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                <Ionicons name={icon} size={20} color="#F59E0B" />
            </View>
            <View className="ml-3 flex-1">
                <Text className="text-sm text-gray-500">{label}</Text>
                <Text className="text-base font-medium">{value}</Text>
            </View>
        </View>
    );
};

export default ProfileField;