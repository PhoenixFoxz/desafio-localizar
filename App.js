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
import * as Location from "expo-location"; // Importa o módulo de localização do Expo
import Modal from "react-native-modal"; // Importa o componente Modal do React Native
import moment from "moment"; // Importa a biblioteca Moment.js para manipulação de datas e horas

export default function App() {
  const [location, setLocation] = useState(null); // Estado para armazenar a localização do usuário
  const [errorMsg, setErrorMsg] = useState(null); // Estado para armazenar mensagens de erro
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const [dateTime, setDateTime] = useState(null); // Estado para armazenar a data e hora atual
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial

  useEffect(() => {
    // Efeito para carregar a localização do usuário quando o componente é montado
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Solicita permissões de localização
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({}); // Obtém a localização atual do usuário
        setLocation(location);
      } catch (error) {
        setErrorMsg("Failed to get location");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSave = () => {
    // Função para lidar com o clique no botão de salvar
    setModalVisible(true); // Exibe o modal de confirmação
  };

  const handleConfirm = () => {
    // Função para lidar com a confirmação no modal
    setDateTime(moment().format("DD-MM-YYYY HH:mm:ss")); // Obtém a data/hora atual apenas ao confirmar
    // Aqui você pode enviar os dados do ponto para o servidor ou armazená-los localmente junto com a data/hora
    setModalVisible(false); // Fecha o modal de confirmação
    Alert.alert("Ponto registrado com sucesso!"); // Exibe um alerta confirmando o registro do ponto
  };

  if (isLoading) {
    // Se o aplicativo estiver carregando, exibe um indicador de atividade
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    // Renderização do componente principal
    <View style={styles.container}>
      {errorMsg && <Text>{errorMsg}</Text>}{" "}
      {/* Exibe uma mensagem de erro, se houver */}
      {location && (
        // Se a localização estiver disponível, exibe o mapa com a localização atual do usuário
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
      <Text>{dateTime}</Text> {/* Exibe a data/hora atual */}
      <Button title="Registrar Ponto" onPress={handleSave} />{" "}
      {/* Botão para registrar o ponto */}
      <Modal isVisible={isModalVisible}>
        {/* Modal de confirmação */}
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            Deseja confirmar o registro do ponto?
          </Text>
          <Button title="Confirmar" onPress={handleConfirm} />{" "}
          {/* Botão para confirmar o registro */}
          <Button
            title="Cancelar"
            onPress={() => setModalVisible(false)}
          />{" "}
          {/* Botão para cancelar */}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos do componente
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
