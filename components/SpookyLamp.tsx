import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle,
  withTiming,
  withRepeat,
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';

export const SpookyLamp = ({ children }: { children: React.ReactNode }) => {
  const leftLightWidth = useSharedValue('15rem');
  const rightLightWidth = useSharedValue('15rem');
  const centerLightWidth = useSharedValue('8rem');
  const centerLineWidth = useSharedValue('15rem');
  const opacity = useSharedValue(0.5);

  React.useEffect(() => {
    const animate = () => {
      opacity.value = withSequence(
        withTiming(1, { duration: 800 }),
        withDelay(300, withTiming(0.5, { duration: 800 }))
      );
      leftLightWidth.value = withSequence(
        withTiming('30rem', { duration: 800 }),
        withDelay(300, withTiming('15rem', { duration: 800 }))
      );
      rightLightWidth.value = withSequence(
        withTiming('30rem', { duration: 800 }),
        withDelay(300, withTiming('15rem', { duration: 800 }))
      );
      centerLightWidth.value = withSequence(
        withTiming('16rem', { duration: 800 }),
        withDelay(300, withTiming('8rem', { duration: 800 }))
      );
      centerLineWidth.value = withSequence(
        withTiming('30rem', { duration: 800 }),
        withDelay(300, withTiming('15rem', { duration: 800 }))
      );
    };

    animate();
    const interval = setInterval(animate, 3000);
    return () => clearInterval(interval);
  }, []);

  const leftLightStyle = useAnimatedStyle(() => ({
    width: leftLightWidth.value,
    opacity: opacity.value,
  }));

  const rightLightStyle = useAnimatedStyle(() => ({
    width: rightLightWidth.value,
    opacity: opacity.value,
  }));

  const centerLightStyle = useAnimatedStyle(() => ({
    width: centerLightWidth.value,
  }));

  const centerLineStyle = useAnimatedStyle(() => ({
    width: centerLineWidth.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.lightContainer}>
        <Animated.View style={[styles.leftLight, leftLightStyle]} />
        <Animated.View style={[styles.rightLight, rightLightStyle]} />
        <Animated.View style={[styles.centerLight, centerLightStyle]} />
        <Animated.View style={[styles.centerLine, centerLineStyle]} />
        <View style={styles.topMask} />
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  lightContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftLight: {
    position: 'absolute',
    height: 200,
    backgroundColor: '#FF6B00',
    opacity: 0.3,
    transform: [
      { rotate: '-70deg' },
      { translateY: -100 }
    ],
    borderRadius: 100,
  },
  rightLight: {
    position: 'absolute',
    height: 200,
    backgroundColor: '#FF6B00',
    opacity: 0.3,
    transform: [
      { rotate: '70deg' },
      { translateY: -100 }
    ],
    borderRadius: 100,
  },
  centerLight: {
    position: 'absolute',
    height: 150,
    backgroundColor: '#FF6B00',
    opacity: 0.5,
    transform: [
      { translateY: -150 }
    ],
    borderRadius: 100,
  },
  centerLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FF6B00',
    transform: [
      { translateY: -180 }
    ],
  },
  topMask: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    backgroundColor: '#121212',
    top: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    paddingHorizontal: 20,
    transform: [
      { translateY: Platform.select({ web: -200, default: -100 }) }
    ],
  },
});