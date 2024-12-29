import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username,
        password,
        email,
      });
      router.replace("/auth/LoginScreen");
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || "An error occurred";
      setDialogMessage(errorMessage);
      setDialogVisible(true);
    }
  };

  return (
    <PaperProvider>
      <ThemedView style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Join us and get started</Text>

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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth/LoginScreen")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>Registration Failed</Dialog.Title>
            <Dialog.Content>
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>OK</Button>
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
    // Adding a gradient background effect
    background: "linear-gradient(to top right, #6D4C41, #8D6E63)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3E2723", // Dark brown for the title
    fontFamily: "sans-serif-condensed", // Modern font for title
  },
  subtitle: {
    fontSize: 18,
    color: "#8D6E63", // Lighter brown for the subtitle
    marginBottom: 30,
    fontFamily: "sans-serif-light", // Modern font for subtitle
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#8D6E63", // Brown border
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: "white", // Light beige background for inputs
    shadowColor: "#3E2723", // Dark brown shadow for input fields
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "black", // Brown button
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#6D4C41", // Darker brown shadow for the button
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    transition: "background-color 0.3s", // Smooth hover transition
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#6D4C41", // Brown border for login button
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#6D4C41", // Brown text for login button
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
