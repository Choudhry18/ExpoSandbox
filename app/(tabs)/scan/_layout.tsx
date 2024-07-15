import { Stack } from 'expo-router';
import React from 'react';

export default function _layout(){
    return(
        <Stack>
            <Stack.Screen 
            name='index'
            options={{ headerTitle: 'Scanner'}}
            />
            <Stack.Screen 
            name='view'
            options={{ headerBackTitle: 'Scan Again' }}
            />
        </Stack>
    )
}