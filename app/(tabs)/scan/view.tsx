import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';

export default function Display() {
    const { out } = useLocalSearchParams();
    console.log('out:', out)
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <Text style={{ color: 'white' }}>Data: {out}</Text>
        </View>
    );
}