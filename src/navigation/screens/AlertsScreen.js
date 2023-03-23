import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const alertsData = [
  { id: '1', text: 'Alert 1' },
  { id: '2', text: 'Alert 2' },
  { id: '3', text: 'Alert 3' },
  { id: '4', text: 'Alert 4' },
  { id: '5', text: 'Alert 5' },
];

const AlertsScreen = () => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={alertsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default AlertsScreen;