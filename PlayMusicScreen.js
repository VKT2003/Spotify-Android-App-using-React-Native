import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';

const PlayMusicScreen = ({ songs, currentSong }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  console.log('currentSong:', currentSong.thumbnail);
  useEffect(() => {
    const loadSound = async () => {
      try {
        if (currentSong && currentSong.url) {
          if (sound) {
            await sound.unloadAsync();
          }

          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: currentSong.url },
            { shouldPlay: true },
            (status) => {
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying);
              } else {
                console.log('Error loading sound:', status.error);
              }
            }
          );
          setSound(newSound);
        } else {
          console.log('No playUrl found or currentSong is undefined');
        }
      } catch (error) {
        console.log('Error loading sound:', error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentSong]);

  const toggleSound = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.log('Error toggling sound:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Now Playing</Text>
      {currentSong && currentSong.thumbnail ? (
        <Image
          style={styles.thumbnail}
          source={{ uri: currentSong.thumbnail }}
        />
      ) : (
        <Text>No thumbnail available</Text>
      )}
      <TouchableOpacity onPress={toggleSound}>
        {isPlaying ? (
          <AntDesign name="pause" size={44} color="black" />
        ) : (
          <AntDesign name="play" size={44} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  thumbnail: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default PlayMusicScreen;
