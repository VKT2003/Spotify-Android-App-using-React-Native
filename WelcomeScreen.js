import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const handleContinue = () => {
    navigation.navigate('VideoList');
  };

  const handleMusicSearch = () => {
    navigation.navigate('SearchMusic');
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://lh3.googleusercontent.com/rormhrw_yZt2v1OKZBaiFCSt8b8QU02kEKiuilfgnpGkOMQd87xm7b7SyIlGoHsL18M' }}
        style={styles.logo}
      />
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>Play media videos 📽️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.continueButton} onPress={handleMusicSearch}>
        <Text style={styles.buttonText}>Play online videos or music 🎵🎸</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'hsla(206, 57%, 16%, 1.0)', // Adjusted background color
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 300, // Adjusted width
    alignItems: 'center', // Center align button text
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default WelcomeScreen;
