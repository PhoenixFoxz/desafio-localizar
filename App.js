import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Modal from "react-native-modal";
import moment from "moment";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg("Failed to get location");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSave = () => {
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setDateTime(moment().format("DD-MM-YYYY HH:mm:ss")); // Obtém a data/hora atual apenas ao confirmar
    // Aqui você pode enviar os dados do ponto para o servidor ou armazená-los localmente junto com a data/hora
    setModalVisible(false);
    Alert.alert("Ponto registrado com sucesso!");
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Localização Atual"
          />
        </MapView>
      )}
      <Text>{dateTime}</Text>
      <Button title="Registrar Ponto" onPress={handleSave} />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            Deseja confirmar o registro do ponto?
          </Text>
          <Button title="Confirmar" onPress={handleConfirm} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "70%",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
  },
});
