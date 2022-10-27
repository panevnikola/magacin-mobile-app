import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

const ArtikalDetailsScreen = (props) => {
  const [loading, setIsLoading] = useState();
  const [error, setError] = useState();
  const artikal = props.navigation.getParam('artikal');

  console.log('ARTIKAL DET ', artikal);

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: artikal.slikaUrl }} />
      <View style={styles.actions}>
        <Text style={styles.title}>{artikal.ime}</Text>
      </View>
      <Text style={styles.price}>{artikal.cena.toFixed(2)} MKD</Text>
      <Text style={styles.description}>{artikal.opis}</Text>
      <View style={styles.dostapno}>
        <Text
          style={
            artikal.dostapnost
              ? styles.dostapnoLabelSuccess
              : styles.dostapnoLabelDanger
          }
        >
          {artikal.dostapnost ? 'Dostapno' : 'Ne e dostapno'}
        </Text>
        {artikal.dostapnost ? (
          <Ionicons
            name={'checkmark-circle'}
            size={26}
            color={Colors.success}
          />
        ) : (
          <Ionicons name={'close-circle'} size={26} color={Colors.danger} />
        )}
      </View>
    </ScrollView>
  );
};

ArtikalDetailsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: () => (
      <Text style={styles.headerTitle}>
        {navData.navigation.getParam('artikalIme')}
      </Text>
    ),
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: Colors.white,
  },
  actions: {
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  dostapno: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  dostapnoLabelSuccess: {
    fontFamily: 'open-sans',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: Colors.success,
    marginRight: 5,
  },
  dostapnoLabelDanger: {
    fontFamily: 'open-sans',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: Colors.danger,
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default ArtikalDetailsScreen;
