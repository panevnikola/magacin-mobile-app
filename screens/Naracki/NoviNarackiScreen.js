import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NarackiItem from '../../components/naracki/NarackiItem';

const NoviNarackiScreen = (props) => {
  const [naracki, setNaracki] = useState([]);

  useEffect(() => {
    console.log('useEffect NarackiScreen');
    const willFocusSub = props.navigation.addListener('willFocus', getAllKeys);

    // clean-up function to remove event listeners
    return () => {
      willFocusSub.remove();
    };
  }, [getAllKeys]);

  const getAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();

      const result = await AsyncStorage.multiGet(keys);

      const parsedResult = result.map((item) => JSON.parse(item[1]));

      setNaracki(parsedResult);
    } catch (e) {
      // read key error
    }
  };

  console.log('naracki ', naracki);

  return (
    <View style={styles.centered}>
      <NarackiItem />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default NoviNarackiScreen;
