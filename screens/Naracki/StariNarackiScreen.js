import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StariNarackiScreen = (props) => {
  return (
    <View style={styles.centered}>
      <Text>Stari Naracki</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StariNarackiScreen;
