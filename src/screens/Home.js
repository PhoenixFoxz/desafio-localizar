import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import logo from "../../assets/logo.png";
import React, { useState } from "react";

export default function Home({ navigation }) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressablePressed,
        ]}
        onPress={() => navigation.navigate("Localizar")}
      >
        <Text style={styles.botao}>MARCAR PONTO</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 0.5,
    borderRadius: 100,
  },
  pressablePressed: {
    backgroundColor: "rgba(242, 163, 65, 0.2)", // Cor de fundo quando pressionado
  },
  container: {
    flex: 1,
    backgroundColor: "#A0E3F2",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  botao: {
    backgroundColor: "#F2A341",
    padding: 25,
    borderRadius: 30,
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    margin: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
