import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ImageBackground,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Gift, Skull } from 'lucide-react-native';
import { getUserData } from '../../utils/auth';
import { getRewards } from '../../utils/rewards';

// Define tea images
const YERBA_MATE_IMAGE = Platform.select({
  web: require('../../assets/images/yerba.jpg'),
  default: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=1000&auto=format&fit=crop'
});

// const HORROR_EVENT_IMAGE = Platform.select({
//   web: require('../../assets/images/Horror through the ages.jpeg'),
//   default: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop'
// });

const featuredTeas = [
  {
    name: 'Yerba Mate',
    description: 'A traditional South American herbal tea known for its robust flavor and energizing properties',
    image: YERBA_MATE_IMAGE,
    checkoutUrl: 'https://blackkettletea.com/product-details/product/67292bf22546291bf4a7512f'
  }
];

const events = [
  {
    title: 'Horror Through The Ages Art Show',
    date: 'May 3rd, 2025',
    // image: HORROR_EVENT_IMAGE,
    image: YERBA_MATE_IMAGE,
    url: 'https://www.facebook.com/events/217-barstow-st-downtown-eau-claire-wi/horror-through-the-ages-art-show/982063540539205/'
  }
];

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [rewards, setRewards] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getUserData();
        setUserData(user);
        const rewardsData = await getRewards(user.id);
        setRewards(rewardsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

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
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{userData?.name || 'Tea Lover'}</Text>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#FF6B00" />
            </TouchableOpacity>
          </View>

          <View style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>Rewards</Text>
            <Text style={styles.rewardText}>
              {rewards?.punches || 0}/9 punches to free tea
            </Text>
            <View style={styles.punchGrid}>
              {Array.from({ length: 9 }).map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.punch,
                    i < (rewards?.punches || 0) && styles.punchedCircle
                  ]}
                >
                  {i < (rewards?.punches || 0) && <Skull size={12} color="#FFF" />}
                </View>
              ))}
            </View>
            {rewards?.punches === 9 && (
              <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemText}>Redeem Free Tea</Text>
                <Gift size={16} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Featured Teas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredTeas.map((tea, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.teaCard}
                onPress={() => Linking.openURL(tea.checkoutUrl)}
              >
                <Image source={typeof tea.image === 'string' ? { uri: tea.image } : tea.image} style={styles.teaImage} />
                <View style={styles.teaInfo}>
                  <Text style={styles.teaName}>{tea.name}</Text>
                  <Text style={styles.teaDescription}>{tea.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {events.map((event, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.eventCard}
              onPress={() => Linking.openURL(event.url)}
            >
              <Image source={typeof event.image === 'string' ? { uri: event.image } : event.image} style={styles.eventImage} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#CCC',
  },
  username: {
    fontFamily: 'Creepster',
    fontSize: 24,
    color: '#FF6B00',
    flex: 1,
    marginLeft: 10,
  },
  notificationButton: {
    padding: 10,
  },
  rewardCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 15,
  },
  rewardTitle: {
    fontFamily: 'Nosifer',
    fontSize: 20,
    color: '#FF6B00',
    marginBottom: 10,
  },
  rewardText: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#FFF',
    marginBottom: 15,
  },
  punchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  punch: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  redeemText: {
    fontFamily: 'SpecialElite',
    color: '#FFF',
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: 'Creepster',
    fontSize: 24,
    color: '#FF6B00',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  teaCard: {
    width: 250,
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 15,
    overflow: 'hidden',
  },
  teaImage: {
    width: '100%',
    height: 150,
  },
  teaInfo: {
    padding: 15,
  },
  teaName: {
    fontFamily: 'SpecialElite',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 5,
  },
  teaDescription: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#CCC',
  },
  eventCard: {
    margin: 20,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: 15,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontFamily: 'SpecialElite',
    fontSize: 18,
    color: '#FFF',
    marginBottom: 5,
  },
  eventDate: {
    fontFamily: 'SpecialElite',
    fontSize: 14,
    color: '#CCC',
  },
});