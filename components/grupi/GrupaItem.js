import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import { Button, Card } from 'react-native-paper';

import Colors from '../../constants/Colors';

const GrupaItem = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card elevation={3} style={{ margin: 10, borderRadius: 10 }}>
      <TouchableCmp onPress={props.onSelect} useForeground>
        <View>
          <Card.Title title={props.title} subtitle={props.podGrupa} />
          <Card.Cover source={{ uri: props.image }} />
          <Card.Actions style={{ alignSelf: 'flex-end' }}>
            <Button onPress={props.onSelect} color={Colors.primary}>
              Види артикли
            </Button>
          </Card.Actions>
        </View>
      </TouchableCmp>
    </Card>
  );
};
export default GrupaItem;
