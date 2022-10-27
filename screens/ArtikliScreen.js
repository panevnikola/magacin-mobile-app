import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Platform,
  View,
  Text,
  Button,
  ActivityIndicator,
} from 'react-native';

import Colors from '../constants/Colors';
import ArtikalItem from '../components/artikli/ArtikalItem';
import { API_URL_IP_NETWORK } from '../constants/Variables';

const ArtikliScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [artikli, setArtikli] = useState([]);

  const grupa = props.navigation.getParam('grupa');
  const podgrupa = props.navigation.getParam('podgrupa');

  const loadArtikli = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await fetch(
        `${API_URL_IP_NETWORK}/mobile/artikli/grupa/${grupa}/${podgrupa}`
      );

      console.log('ART SCREEN loadartikli ', result)

      const resData = await result.json();

      if (resData.status === 404) {
        setError(resData.message);
      }
      setArtikli(resData);
    } catch (err) {
      setError(err);
    }
    setIsRefreshing(false);
  }, [setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadArtikli);

    // clean-up function to remove event listeners
    return () => {
      willFocusSub.remove();
    };
  }, [loadArtikli]);

  useEffect(() => {
    setIsLoading(true);
    loadArtikli().then(() => {
      setIsLoading(false);
    });
  }, [loadArtikli]);

  const selectItemHandler = (item) => {
    props.navigation.navigate('ArtikalDetails', {
      artikal: item,
      artikalIme: item.ime
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title='Try again'
          onPress={loadArtikli}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='small' color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadArtikli}
      refreshing={isRefreshing}
      data={artikli}
      keyExtractor={(item) => item.id.toString()}
      initialNumToRender={10}
      renderItem={({ item }) => (
        <ArtikalItem
          item={item}
          onSelect={() => {
            selectItemHandler(item);
          }}
        />
      )}
    />
  );
};

ArtikliScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam('podgrupa'),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'open-sans',
    marginBottom: 10,
  },
  headerTitle: {
    // fontFamily: 'open-sans',
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default ArtikliScreen;
