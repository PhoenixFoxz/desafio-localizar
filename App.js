import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Localizar from "./src/screens/Localizar";

// Criação/inicialização do mecanismo Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#A0E3F2" },
            headerTintColor: "white",
          }}
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Localizar"
            component={Localizar}
            options={{ title: "Marque seu Ponto!" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
