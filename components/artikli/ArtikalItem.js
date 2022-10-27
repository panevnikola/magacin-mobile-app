import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Counter from 'react-native-counters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../constants/Colors';
import * as actions from '../../store/actions/actions';

const ArtikalItem = (props) => {
  const { item, onSelect } = props;
  const dispatch = useDispatch();

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const onChange = async (number, type) => {
    item.kolicina = number;
    // storeData(item);
    console.log('art item ', item);
    if (item.kolicina > 0) {
      await dispatch(actions.addNaracka(item));
    } else {
      await dispatch(actions.removeItemFromNaracka(item.id));
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`@${value.ime}`, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  return (
    <TouchableCmp onPress={onSelect} useForeground>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: item.slikaUrl,
            }}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>
            {item.ime.length > 23 ? item.ime.substring(0, 23) + `..` : item.ime}
          </Text>
          <Text style={styles.details}>
            {item.opis.length > 23
              ? item.opis.substring(0, 23) + `..`
              : item.opis}
          </Text>
          <Text style={styles.details}>{item.cena} MKD</Text>
        </View>
        <View style={styles.counterContainer}>
          <Counter start={0} onChange={onChange.bind(this)} />
        </View>
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 90,
    flexDirection: 'row',
    borderBottomColor: '#c3c3c3',
    borderBottomWidth: 0.5,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  detailsContainer: {
    marginLeft: 15,
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  details: {
    fontSize: 13,
    fontWeight: '100',
    color: Colors.grey,
  },
  counterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginRight: 10,
  },
  cena: {
    fontSize: 13,
    fontWeight: '100',
    marginBottom: 15,
    marginRight: 15,
    color: Colors.primary,
  },
});

export default ArtikalItem;
