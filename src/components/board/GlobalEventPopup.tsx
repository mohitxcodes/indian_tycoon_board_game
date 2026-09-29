import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  ZoomIn,
  ZoomOut,
  SlideInUp,
  SlideOutUp,
  Keyframe
} from 'react-native-reanimated';

interface GlobalEventPopupProps {
  latestEvent: string;
}

export const GlobalEventPopup: React.FC<GlobalEventPopupProps> = ({ latestEvent }) => {
  const [currentEvent, setCurrentEvent] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (latestEvent) {
      setCurrentEvent(latestEvent);
      setKey(prev => prev + 1); // Force re-render with new key to restart animation

      const timer = setTimeout(() => {
        setCurrentEvent(null);
      }, 3000); // Show for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [latestEvent]);

  if (!currentEvent) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        key={key}
        entering={ZoomIn.duration(400).springify()}
        exiting={ZoomOut.duration(300)}
        style={styles.popupBase}
      >
        <View style={styles.popupWrapper}>
          <Text style={styles.icon}>📢</Text>
          <Text style={styles.text} numberOfLines={2}>
            {currentEvent}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 999,
  },
  popupBase: {
    backgroundColor: '#1E40AF', // Deep blue shadow
    borderRadius: 16,
    paddingBottom: 6, // 3D effect depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
    maxWidth: '85%',
  },
  popupWrapper: {
    backgroundColor: '#3B82F6', // Vibrant blue
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#93C5FD', // Light blue border highlight
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flexShrink: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});
