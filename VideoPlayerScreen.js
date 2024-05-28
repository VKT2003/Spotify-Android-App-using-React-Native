import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, PanResponder, Text, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function VideoPlayerScreen({ route }) {
  const { videoUri } = route.params;
  const videoRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [slideSpeed, setSlideSpeed] = useState('');
  const [showSlideSpeed, setShowSlideSpeed] = useState(false);

  const SWIPE_SENSITIVITY = 0.002;

  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.unlockAsync();
    };

    setOrientation();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const handleSeek = async (value) => {
    const newPositionMillis = value * videoDuration;
    await videoRef.current.setPositionAsync(newPositionMillis);
    setSliderValue(value);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setShowSlideSpeed(true); // Show slideSpeedText when sliding starts
    },
    onPanResponderMove: (_, gestureState) => {
      const seekPosition = gestureState.dx * SWIPE_SENSITIVITY;
      const newPosition = Math.max(0, Math.min(1, sliderValue + seekPosition));
      const speed = gestureState.vx;

      // Calculate speed direction (forward or backward)
      const speedDirection = speed >= 0 ? 'Forward' : 'Backward';
      const formattedSpeed = Math.abs(speed).toFixed(2);

      // Calculate position difference in seconds
      const positionDiffSeconds = Math.abs(newPosition - sliderValue) *(videoDuration/1000);

      // Set slideSpeedText to display speed, direction, and position difference in seconds
      setSlideSpeed(`${formattedSpeed}x ${speedDirection} - ${positionDiffSeconds.toFixed(0)}s`);

      handleSeek(newPosition);
    },
    onPanResponderRelease: () => {
      setShowSlideSpeed(false); // Hide slideSpeedText when sliding ends
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.videoPlayer}
        onPlaybackStatusUpdate={(status) => {
          setVideoDuration(status.durationMillis);
          setSliderValue(status.positionMillis / status.durationMillis);
        }}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        onValueChange={handleSeek}
        thumbTintColor="#007AFF"
        minimumTrackTintColor="#007AFF"
      />
      {showSlideSpeed && (
        <View style={styles.slideSpeedContainer}>
          <Text style={styles.slideSpeedText}>{slideSpeed}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  slider: {
    width: '80%',
    marginTop: 20,
  },
  slideSpeedContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 60,
    alignSelf: 'center',
  },
  slideSpeedText: {
    color: 'white',
    fontSize: 20,
  },
});
