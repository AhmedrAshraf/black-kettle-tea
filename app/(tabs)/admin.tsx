import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ImageBackground,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, User, Coffee, Plus, Minus, Check, X } from 'lucide-react-native';
import { getUserData } from '../../utils/auth';
import { getAllUsers, updateUserRewards } from '../../utils/admin';
import { router } from 'expo-router';

export default function AdminScreen() {
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUserData();
        setUserData(user);
        
        // Check if user is admin (specific email addresses)
        const adminEmails = ['tom@salesoracle.io', 'blackkettleteashoppe@gmail.com'];
        const userIsAdmin = adminEmails.includes(user.email);
        setIsAdmin(userIsAdmin);
        
        if (userIsAdmin) {
          const allUsers = await getAllUsers();
          setUsers(allUsers);
          setFilteredUsers(allUsers);
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);
  
  const handleAddPunch = async (userId) => {
    try {
      const updatedUser = await updateUserRewards(userId, 'add');
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, punches: updatedUser.punches } : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(
        filteredUsers.map(user => 
          user.id === userId ? { ...user, punches: updatedUser.punches } : user
        )
      );
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, punches: updatedUser.punches });
      }
      
      Alert.alert('Success', 'Punch added successfully');
    } catch (error) {
      console.error('Error adding punch:', error);
      Alert.alert('Error', 'Failed to add punch');
    }
  };
  
  const handleRemovePunch = async (userId) => {
    try {
      const updatedUser = await updateUserRewards(userId, 'remove');
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, punches: updatedUser.punches } : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(
        filteredUsers.map(user => 
          user.id === userId ? { ...user, punches: updatedUser.punches } : user
        )
      );
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, punches: updatedUser.punches });
      }
      
      Alert.alert('Success', 'Punch removed successfully');
    } catch (error) {
      console.error('Error removing punch:', error);
      Alert.alert('Error', 'Failed to remove punch');
    }
  };
  
  const handleResetPunches = async (userId) => {
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to reset this user\'s punches to 0?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedUser = await updateUserRewards(userId, 'reset');
              
              // Update local state
              const updatedUsers = users.map(user => 
                user.id === userId ? { ...user, punches: 0 } : user
              );
              
              setUsers(updatedUsers);
              setFilteredUsers(
                filteredUsers.map(user => 
                  user.id === userId ? { ...user, punches: 0 } : user
                )
              );
              
              if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({ ...selectedUser, punches: 0 });
              }
              
              Alert.alert('Success', 'Punches reset successfully');
            } catch (error) {
              console.error('Error resetting punches:', error);
              Alert.alert('Error', 'Failed to reset punches');
            }
          },
        },
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }
  
  if (!isAdmin) {
    // Redirect to home if not admin
    router.replace('/(tabs)');
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedText}>
          You do not have permission to access this area.
        </Text>
      </View>
    );
  }
  
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1635774855317-edf3ee4463db?q=80&w=2069&auto=format&fit=crop' }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(20,0,20,0.95)']}
        style={styles.overlay}
      >
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          
          <View style={styles.usersContainer}>
            <Text style={styles.sectionTitle}>Customers</Text>
            
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.userItem}
                  onPress={() => setSelectedUser(user)}
                >
                  <View style={styles.userItemLeft}>
                    <View style={styles.userAvatar}>
                      <User size={20} color="#FF6B00" />
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user .name}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                  </View>
                  <View style={styles.userPunches}>
                    <Coffee size={16} color="#FF6B00" />
                    <Text style={styles.userPunchesText}>{user.punches}/9</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noUsersText}>No users found</Text>
            )}
          </View>
          
          {selectedUser && (
            <View style={styles.userDetailContainer}>
              <View style={styles.userDetailHeader}>
                <Text style={styles.userDetailTitle}>Customer Details</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedUser(null)}
                >
                  <X size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.userDetailContent}>
                <View style={styles.userDetailInfo}>
                  <Text style={styles.userDetailName}>{selectedUser.name}</Text>
                  <Text style={styles.userDetailEmail}>{selectedUser.email}</Text>
                  <Text style={styles.userDetailMember}>
                    Member since: {selectedUser.createdAt || 'October 2025'}
                  </Text>
                </View>
                
                <View style={styles.punchesContainer}>
                  <Text style={styles.punchesTitle}>Reward Punches</Text>
                  <View style={styles.punchesControls}>
                    <TouchableOpacity 
                      style={styles.punchButton}
                      onPress={() => handleRemovePunch(selectedUser.id)}
                    >
                      <Minus size={20} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.punchesCount}>
                      <Text style={styles.punchesCountText}>{selectedUser.punches}/9</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.punchButton}
                      onPress={() => handleAddPunch(selectedUser.id)}
                    >
                      <Plus size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.resetButton}
                    onPress={() => handleResetPunches(selectedUser.id)}
                  >
                    <Text style={styles.resetButtonText}>Reset Punches</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.actionButton}>
                    <LinearGradient
                      colors={['#FF6B00', '#FF3800']}
                      style={styles.actionButtonGradient}
                    >
                      <Text style={styles.actionButtonText}>View Purchase History</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <LinearGradient
                      colors={['#2D0A31', '#1A0118']}
                      style={styles.actionButtonGradient}
                    >
                      <Text style={styles.actionButtonText}>Send Notification</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  unauthorizedText: {
    fontFamily: 'SpecialElite',
    fontSize: 18,
    color: '#FF6B00',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Nosifer',
    fontSize: 28,
    color: '#FF6B00',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#FFF',
    fontFamily: 'SpecialElite',
  },
  usersContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Creepster',
    fontSize: 22,
    color: '#FF6B00',
    marginBottom: 15,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  userItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  userEmail: {
    fontFamily: 'SpecialElite',
    fontSize: 12,
    color: '#999',
  },
  userPunches: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPunchesText: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#FF6B00',
    marginLeft: 5,
  },
  noUsersText: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  userDetailContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    overflow: 'hidden',
  },
  userDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D0A31',
    padding: 15,
  },
  userDetailTitle: {
    fontFamily: 'Creepster',
    fontSize: 20,
    color: '#FF6B00',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetailContent: {
    padding: 20,
  },
  userDetailInfo: {
    marginBottom: 20,
  },
  userDetailName: {
    fontFamily: 'SpecialElite',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 5,
  },
  userDetailEmail: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#CCC',
    marginBottom: 5,
  },
  userDetailMember: {
    fontFamily: 'SpecialElite',
    fontSize: 12,
    color: '#999',
  },
  punchesContainer: {
    marginBottom: 20,
  },
  punchesTitle: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#FF6B00',
    marginBottom: 10,
  },
  punchesControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  punchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  punchesCount: {
    paddingHorizontal: 20,
  },
  punchesCountText: {
    fontFamily: 'SpecialElite',
    fontSize: 18,
    color: '#FFF',
  },
  resetButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#FF3800',
    borderRadius: 5,
  },
  resetButtonText: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#FF3800',
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  actionButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#FFF',
  },
});