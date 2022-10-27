import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import CustomModal from '../components/UI/Modal';
import { API_URL_IP_NETWORK } from '../constants/Variables';

export default function CameraScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchData = async (code) => {
    console.log('fetch start ', code);
    const result = await fetch(`${API_URL_IP_NETWORK}/artikli/barcode/${code}`);
    console.log('fetch result ', result);
    const resData = await result.json();

    console.log('fetch resData ', resData);

    setModalData(resData);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log('handleBarCodeScanned type ', type);
    console.log('handleBarCodeScanned data ', data);
    fetchData(data);
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    setModalVisible(!modalVisible);
    setModalType(type);
    // setModalData(data);
  };

  const handleCloseModal = () => {
    setModalVisible((prev) => !prev);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const selectItemHandler = () => {
    const item = JSON.parse(modalData);

    props.navigation.navigate('ArtikalDetails', {
      artikal: item.data,
      artikalIme: item.data.ime,
    });
  };

  console.log('MODAL VISIBLE ', modalVisible);

  return (
    <View style={styles.container}>
      <CustomModal
        modalVisible={modalVisible}
        handleCloseModal={handleCloseModal}
        type={modalType}
        data={modalData}
        selectHandler={selectItemHandler}
      />
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
