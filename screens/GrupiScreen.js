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
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../components/UI/HeaderButton';
import GrupaItem from '../components/grupi/GrupaItem';
import Colors from '../constants/Colors';
import { API_URL_IP_NETWORK } from '../constants/Variables';

const GrupiScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [grupi, setGrupi] = useState([]);

  const loadGrupi = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await fetch(`${API_URL_IP_NETWORK}/grupi`);

      const resData = await result.json();

      if (resData.status === 404) {
        setError(resData.message);
      }
      setGrupi(resData);
    } catch (err) {
      console.log('CATCH ERR ', err);
      setError(err);
    }
    setIsRefreshing(false);
  }, [setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadGrupi);

    // clean-up function to remove event listeners
    return () => {
      willFocusSub.remove();
    };
  }, [loadGrupi]);

  useEffect(() => {
    setIsLoading(true);
    loadGrupi().then(() => {
      setIsLoading(false);
    });
  }, [loadGrupi]);

  const selectItemHandler = (grupa) => {
    props.navigation.navigate('Podgrupi', {
      grupa: grupa,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title='Try again' onPress={loadGrupi} color={Colors.primary} />
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

  if (grupi.length < 1) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Не се пронајдени групи</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadGrupi}
      data={grupi}
      refreshing={isRefreshing}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <GrupaItem
          title={item.ime}
          image={item.url}
          podGrupa={item.podGrupa}
          onSelect={() => {
            selectItemHandler(item.ime);
          }}
        />
      )}
    />
  );
};

GrupiScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Групи',
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
});
export default GrupiScreen;
