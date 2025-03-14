import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from '../utils/auth';
import { SpookyLamp } from '../components/SpookyLamp';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';

export default function LoginScreen() {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);

  React.useEffect(() => {
    titleOpacity.value = withSequence(
      withDelay(500, withTiming(1, { duration: 800 }))
    );
    titleTranslateY.value = withSequence(
      withDelay(500, withTiming(0, { duration: 800 }))
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SpookyLamp>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={[styles.titleContainer, titleStyle]}>
            <Text style={styles.logo}>Black Kettle Tea</Text>
            <Text style={styles.tagline}>Brew Something Wicked</Text>
          </Animated.View>
          
          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeOff size={20} color="#999" /> : 
                  <Eye size={20} color="#999" />
                }
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#FF6B00', '#FF3800']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Brewing...' : 'Login'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SpookyLamp>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontFamily: 'Nosifer',
    fontSize: 32,
    color: '#FF6B00',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 107, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  tagline: {
    fontFamily: 'SpecialElite',
    fontSize: 16,
    color: '#CCC',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 15,
    color: '#FFF',
    fontFamily: 'SpecialElite',
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'SpecialElite',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#CCC',
    fontFamily: 'SpecialElite',
  },
  registerLink: {
    color: '#FF6B00',
    fontFamily: 'SpecialElite',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3800',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'SpecialElite',
  },
});