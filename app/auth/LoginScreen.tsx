import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      const { token } = response.data.data;
      await AsyncStorage.setItem("token", token);
      setDialogMessage("Login successful!");
      setIsSuccess(true);
      setDialogVisible(true);
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || "An error occurred";
      setDialogMessage(errorMessage);
      setIsSuccess(false);
      setDialogVisible(true);
    }
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    if (isSuccess) {
      router.replace("/(tabs)");
    }
  };

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <Image
          source={require("../../assets/images/autoparts.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Selamat Datang di Auto Parts</Text>
        <Text style={styles.subtitle}>Happy Shopping</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/auth/RegisterScreen")}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss}>
            <Dialog.Title>
              {isSuccess ? "Success" : "Login Failed"}
            </Dialog.Title>
            <Dialog.Content>
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleDialogDismiss}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ThemedView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20, // Adjusted font size to be smaller
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000", // Changed to black
    fontFamily: "sans-serif-condensed",
    textAlign: "center", // Centered the text
  },
  subtitle: {
    fontSize: 18,
    color: "#000", // Changed to black
    marginBottom: 30,
    fontFamily: "sans-serif-light",
    textAlign: "center", // Centered the text
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#000", // Changed border color to black
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: "white", // Light beige background for inputs
    shadowColor: "#000", // Black shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#000", // Changed button color to black
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000", // Black shadow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  registerButton: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#000", // Changed border color to black
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  registerButtonText: {
    color: "#000", // Changed text color to black
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
