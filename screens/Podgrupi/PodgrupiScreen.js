import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Platform,
  View,
  Text,
  Button,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { API_URL_IP_NETWORK } from '../../constants/Variables';
import PodgrupaItem from '../../components/podgrupi/PodgrupaItem';
import ArtikalItem from '../../components/artikli/ArtikalItem';

const PodgrupiScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [podgrupi, setPodgrupi] = useState([]);
  const [artikli, setArtikli] = useState([]);

  const grupa = props.navigation.getParam('grupa');

  const loadPodgrupi = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await fetch(
        `${API_URL_IP_NETWORK}/podgrupi/withArtikli/${grupa}`
      );

      const resData = await result.json();
      const artikliArray = resData.pop();
      const { artikli } = artikliArray;

      if (resData.status === 404) {
        setError(resData.message);
      }
      setPodgrupi(resData);
      setArtikli(artikli);
    } catch (err) {
      console.log('CATCH ERR ', err);
      setError(err);
    }
    setIsRefreshing(false);
  }, [setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadPodgrupi
    );

    // clean-up function to remove event listeners
    return () => {
      willFocusSub.remove();
    };
  }, [loadPodgrupi]);

  useEffect(() => {
    setIsLoading(true);
    loadPodgrupi().then(() => {
      setIsLoading(false);
    });
  }, [loadPodgrupi]);

  const selectItemHandler = (grupa, podgrupa) => {
    props.navigation.navigate('Artikli', {
      grupa: grupa,
      podgrupa: podgrupa,
    });
  };

  const selectArtikalHandler = (item) => {
    props.navigation.navigate('ArtikalDetails', {
      artikal: item,
      artikalIme: item.ime,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title='Try again' onPress={() => {}} color={Colors.primary} />
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
      onRefresh={loadPodgrupi}
      data={podgrupi}
      refreshing={isRefreshing}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PodgrupaItem
          title={item.ime}
          image={item.url}
          description={item.grupa}
          onSelect={() => {
            selectItemHandler(item.grupa, item.ime);
          }}
        />
      )}
      ListFooterComponent={
        artikli.length > 0 && (
          <>
            <Text style={styles.title}>Artikli</Text>
            <FlatList
              // style={{ margin: 10 }}
              refreshing={isRefreshing}
              data={artikli}
              keyExtractor={(item) => item.id.toString()}
              initialNumToRender={10}
              renderItem={({ item }) => (
                <ArtikalItem
                  item={item}
                  onSelect={() => {
                    selectArtikalHandler(item);
                  }}
                />
              )}
            />
          </>
        )
      }
    />
  );
};

PodgrupiScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.state.params.grupa,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: Colors.grey,
    margin: 10,
  },
});

export default PodgrupiScreen;
