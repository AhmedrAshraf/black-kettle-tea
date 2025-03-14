import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { signOut } from '../../utils/auth';

export default function ProfileScreen() {
  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Nosifer',
    fontSize: 24,
    color: '#FF6B00',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
  },
  signOutText: {
    fontFamily: 'SpecialElite',
    color: '#FFF',
    fontSize: 16,
  },
});