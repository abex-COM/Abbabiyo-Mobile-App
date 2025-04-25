import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if ([12, 1, 2].includes(month)) return 'Bega (Dry Season)';
  if ([3, 4, 5].includes(month)) return 'Belg (Short Rainy Season)';
  if ([6, 7, 8, 9].includes(month)) return 'Kiremt (Main Rainy Season)';
  return 'Meher (Harvest/Post-Rainy Season)';
};

const CurrentSeason = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.seasonText}>Current Season: {getCurrentSeason()}</Text>
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