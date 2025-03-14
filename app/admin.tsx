import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { getUserData } from '../utils/auth';

export default function AdminRedirect() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await getUserData();
        const isAdmin = user.email === 'tom@salesoracle.io' || 
                       user.email === 'blackkettleteashoppe@gmail.com';
        
        if (isAdmin) {
          router.replace('/(tabs)/admin');
        } else {
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.replace('/(tabs)');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }
  
  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});