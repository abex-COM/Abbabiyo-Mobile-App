import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CurrentSeason = ({ season }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.seasonText}>Current Season: {season}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 10,
  },
  seasonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CurrentSeason;