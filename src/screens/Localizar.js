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

export default function Localizar() {
  const [location, setLocation] = useState(null); // Estado para armazenar a localização do usuário
  const [errorMsg, setErrorMsg] = useState(null); // Estado para armazenar mensagens de erro
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const [dateTime, setDateTime] = useState(null); // Estado para armazenar a data e hora atual
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial
  const [streetName, setStreetName] = useState(null); // Estado para armazenar o nome da rua

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

        // Obtém o nome da rua com base na latitude e longitude
        const streetName = await getStreetName(
          location.coords.latitude,
          location.coords.longitude
        );
        setStreetName(streetName); // Define o nome da rua no estado
      } catch (error) {
        setErrorMsg("Failed to get location");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getStreetName = async (latitude, longitude) => {
    try {
      // Chama a função reverseGeocodeAsync para obter as informações de localização
      const locationInfo = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      // Verifica se foram retornadas informações de localização
      if (locationInfo && locationInfo.length > 0) {
        // Extrai o nome da rua das informações de localização
        const streetName = locationInfo[0].street;
        return streetName;
      } else {
        // Retorna null se não foram encontradas informações de localização
        return null;
      }
    } catch (error) {
      // Lida com erros, se houver algum
      console.error("Erro ao obter o nome da rua:", error);
      return null;
    }
  };

  const handleSave = () => {
    // Função para lidar com o clique no botão de salvar
    setModalVisible(true); // Exibe o modal de confirmação
  };

  const handleConfirm = () => {
    // Função para lidar com a confirmação no modal
    setDateTime(moment().format("DD-MM-YYYY HH:mm")); // Obtém a data/hora atual apenas ao confirmar
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
      {errorMsg && <Text>{errorMsg}</Text>}
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
      {/* Exibe o nome da rua, se disponível */}
      {streetName && <Text style={styles.colorText}>{streetName}</Text>}
      {/* Exibe a data/hora atual */}
      <Text style={styles.colorText}>{dateTime}</Text>
      <Button color={"#F2A341"} title="Registrar Ponto" onPress={handleSave} />
      {/* Botão para registrar o ponto */}
      <Modal isVisible={isModalVisible}>
        {/* Modal de confirmação */}
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            Deseja confirmar o registro do ponto?
          </Text>
          <View style={styles.botaoEspaco}>
            <Button title="Confirmar" onPress={handleConfirm} />
            {/* Botão para confirmar o registro */}
            <Button
              color={"#F24452"}
              title="Cancelar"
              onPress={() => setModalVisible(false)}
            />
          </View>
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
    backgroundColor: "#A0E3F2",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "70%",
    marginBottom: 38,
  },
  modal: {
    backgroundColor: "#F29199",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    color: "white",
    marginBottom: 20,
    fontSize: 18,
  },
  colorText: {
    color: "white",
    fontWeight: "bold",
    textShadowRadius: 10,
  },
  botaoEspaco: {
    flexDirection: "row",
  },
});