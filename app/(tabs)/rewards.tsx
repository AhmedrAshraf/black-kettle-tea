import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, Skull, Clock, Check } from 'lucide-react-native';
import { getUserData } from '../../utils/auth';
import { getRewards, getRewardHistory } from '../../utils/rewards';

const { width } = Dimensions.get('window');

const LOGO_IMAGE = 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=200&auto=format&fit=crop';

export default function RewardsScreen() {
  const [userData, setUserData] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUserData();
        setUserData(user);
        
        const rewardsData = await getRewards(user.id);
        setRewards(rewardsData);
        
        const history = await getRewardHistory(user.id);
        setRewardHistory(history);
      } catch (error) {
        console.error('Error loading rewards data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleRedeemReward = async () => {
    // Implement reward redemption logic
    console.log('Redeeming reward');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
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
            <Text style={styles.headerTitle}>Your Rewards</Text>
          </View>
          
          <View style={styles.rewardCardContainer}>
            <LinearGradient
              colors={['#2D0A31', '#1A0118']}
              style={styles.rewardCard}
            >
              <View style={styles.rewardCardHeader}>
                <Text style={styles.rewardCardTitle}>Rewards Card</Text>
                <Image 
                  source={{ uri: LOGO_IMAGE }} 
                  style={styles.logoImage}
                />
              </View>
              
              <Text style={styles.rewardCardSubtitle}>
                {rewards?.punches === 9 
                  ? 'You\'ve earned a FREE tea!' 
                  : `${rewards?.punches || 0}/9 punches to free tea`
                }
              </Text>
              
              <View style={styles.punchCardContainer}>
                {Array.from({ length: 9 }).map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.punchCircle,
                      index < (rewards?.punches || 0) && styles.punchedCircle
                    ]}
                  >
                    {index < (rewards?.punches || 0) && (
                      <Skull size={12} color="#FFF" />
                    )}
                  </View>
                ))}
              </View>
              
              {rewards?.punches === 9 && (
                <TouchableOpacity 
                  style={styles.redeemButton}
                  onPress={handleRedeemReward}
                >
                  <LinearGradient
                    colors={['#FF6B00', '#FF3800']}
                    style={styles.redeemButtonGradient}
                  >
                    <Text style={styles.redeemButtonText}>Redeem Free Tea</Text>
                    <Gift size={18} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
          
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.howItWorksContainer}>
            <View style={styles.howItWorksItem}>
              <View style={styles.howItWorksIcon}>
                <Skull size={24} color="#FF6B00" />
              </View>
              <View style={styles.howItWorksContent}>
                <Text style={styles.howItWorksTitle}>Buy Tea</Text>
                <Text style={styles.howItWorksDescription}>
                  Each tea purchase earns you one punch on your rewards card
                </Text>
              </View>
            </View>
            
            <View style={styles.howItWorksItem}>
              <View style={styles.howItWorksIcon}>
                <Gift size={24} color="#FF6B00" />
              </View>
              <View style={styles.howItWorksContent}>
                <Text style={styles.howItWorksTitle}>Collect 9 Punches</Text>
                <Text style={styles.howItWorksDescription}>
                  After 9 purchases, you'll earn a free tea of your choice
                </Text>
              </View>
            </View>
            
            <View style={styles.howItWorksItem}>
              <View style={styles.howItWorksIcon}>
                <Check size={24} color="#FF6B00" />
              </View>
              <View style={styles.howItWorksContent}>
                <Text style={styles.howItWorksTitle}>Redeem Reward</Text>
                <Text style={styles.howItWorksDescription}>
                  Show your app to the checkout counter to claim your free tea
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Purchase History</Text>
          
          <View style={styles.historyContainer}>
            {rewardHistory.length > 0 ? (
              rewardHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyIconContainer}>
                    {item.type === 'punch' ? (
                      <Skull size={20} color="#FF6B00" />
                    ) : (
                      <Gift size={20} color="#FF6B00" />
                    )}
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <View style={styles.historyStatus}>
                    {item.status === 'completed' ? (
                      <Check size={20} color="#4CAF50" />
                    ) : (
                      <Clock size={20} color="#FFC107" />
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyHistoryText}>No purchase history yet</Text>
            )}
          </View>
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
  rewardCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  rewardCard: {
    borderRadius: 15,
    padding: 15,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    maxWidth: Platform.OS === 'web' ? 400 : '100%',
    alignSelf: 'center',
  },
  rewardCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardCardTitle: {
    fontFamily: 'Nosifer',
    fontSize: 18,
    color: '#FF6B00',
  },
  logoImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  rewardCardSubtitle: {
    fontFamily: 'SpecialElite',
    fontSize: 13,
    color: '#CCC',
    marginBottom: 10,
  },
  punchCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  punchCircle: {
    width: width / 13,
    height: width / 13,
    maxWidth: 30,
    maxHeight: 30,
    borderRadius: width / 26,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: 'rgba(30, 30, 30, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  punchedCircle: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  redeemButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 5,
  },
  redeemButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemButtonText: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#FFF',
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: 'Creepster',
    fontSize: 22,
    color: '#FF6B00',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  howItWorksContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  howItWorksItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  howItWorksIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  howItWorksContent: {
    flex: 1,
  },
  howItWorksTitle: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  howItWorksDescription: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#CCC',
  },
  historyContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  historyDate: {
    fontFamily: 'SpecialElite',
    fontSize: 12,
    color: '#999',
  },
  historyStatus: {
    marginLeft: 10,
  },
  emptyHistoryText: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});