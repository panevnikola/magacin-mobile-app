import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

import Colors from '../../constants/Colors';

const PodgrupaItem = ({ title, image, description, onSelect }) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card elevation={3} style={{ margin: 10 }}>
      <TouchableCmp onPress={onSelect} useForeground>
        <View>
          <Card.Cover source={{ uri: image }} height={100} />
          <Card.Title
            title={title}
            subtitle={description}
            subtitleNumberOfLines={2}
            style={{ marginTop: 5, marginBottom: 10 }}
          />
        </View>
      </TouchableCmp>
    </Card>
  );
};
export default PodgrupaItem;
