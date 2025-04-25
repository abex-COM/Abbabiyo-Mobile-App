import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Recommendation = ({ recommendations }) => {
  // Check if recommendations are provided and if it's a valid string
  if (!recommendations || typeof recommendations !== 'string' || recommendations.trim() === "") {
    return (
      <View style={styles.container}>
        <Text>No recommendations available at the moment.</Text>
      </View>
    );
  }

  // Split the string by newline or bullet point (•)
  const recommendationList = recommendations
    .split('\n')  // Split by newline character
    .map((rec) => rec.trim())
    .filter(Boolean);  // Remove any empty strings

  return (
    <View style={styles.container}>
      <ScrollView>
        {recommendationList.map((rec, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardDescription}>{rec}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Learn More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    padding: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Recommendation;