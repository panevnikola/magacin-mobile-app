import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const PartnerItem = (props) => {
  const { item, onSelect } = props;

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <TouchableCmp onPress={onSelect} useForeground>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {item.ime.length > 23 ? item.ime.substring(0, 23) + `..` : item.ime}
          </Text>
          <Text style={styles.adresa}>
            {item.adresa.length > 35
              ? item.adresa.substring(0, 35) + `..`
              : item.adresa}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsLabel}>{item.bankaDeponent}</Text>
          <Text style={styles.detailsLabel}>Edb: {item.edb}</Text>
          <Text
            style={styles.detailsLabelTel}
            onPress={() => {
              Linking.openURL(`tel:${item.telefonskiBroj}`);
            }}
          >
            <Ionicons
              name={Platform.OS === 'android' ? 'md-call' : 'ios-call'}
              size={14}
            />{' '}
            {item.telefonskiBroj}
          </Text>
        </View>
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    height: 90,
    flexDirection: 'row',
    borderBottomColor: '#c3c3c3',
    borderBottomWidth: 0.5,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 10,
  },
  adresa: {
    fontSize: 13,
    fontWeight: '100',
    color: Colors.grey,
  },
  detailsContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 10,
  },
  detailsLabel: {
    fontSize: 13,
    fontWeight: '100',
    color: Colors.grey,
    marginVertical: 4,
  },
  detailsTel: {
    fontSize: 13,
    fontWeight: '100',
    // color: Colors.grey,
    marginVertical: 4,
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

export default PartnerItem;
