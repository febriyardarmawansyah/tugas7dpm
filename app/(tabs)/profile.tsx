import React, { useEffect, useState } from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  ActivityIndicator,
  Button,
  Dialog,
  PaperProvider,
  Portal,
  Text,
} from "react-native-paper";
import API_URL from "@/config/config";

type UserProfile = {
  username: string;
  email: string;
};

const backgroundImageUrl =
  "https://halobengkel.com/wp-content/uploads/2024/05/sparepart-mobil-magetan.jpg";

const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get<{ data: UserProfile }>(
        `${API_URL}/api/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setDialogVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/auth/LoginScreen");
  };

  if (loading) {
    return (
      <PaperProvider>
        <ThemedView style={styles.container}>
          <ActivityIndicator animating={true} />
        </ThemedView>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.container}
      >
        <ThemedView style={styles.overlay}>
          {profile ? (
            <ThemedView style={styles.profileBox}>
              <ThemedText style={styles.title}>Profile</ThemedText>
              <ThemedText style={styles.label}>Username:</ThemedText>
              <ThemedText style={styles.value}>{profile.username}</ThemedText>
              <ThemedText style={styles.label}>Email:</ThemedText>
              <ThemedText style={styles.value}>{profile.email}</ThemedText>
              <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                Log Out
              </Button>
            </ThemedView>
          ) : (
            <ThemedText>No profile data available</ThemedText>
          )}
          <Portal>
            <Dialog
              visible={dialogVisible}
              onDismiss={() => setDialogVisible(false)}
            >
              <Dialog.Title>Logout</Dialog.Title>
              <Dialog.Content>
                <Text>Are you sure you want to logout?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                <Button onPress={confirmLogout}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ThemedView>
      </ImageBackground>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  profileBox: {
    backgroundColor: "transparent", // Set the profile box to be fully transparent
    borderRadius: 8,
    padding: 16,
    width: "100%", // Adjust width as needed
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    fontFamily: "Times New Roman", // Set font to Times New Roman
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
    fontFamily: "Times New Roman", // Set font to Times New Roman
  },
  value: {
    fontSize: 18,
    color: "#666",
    fontFamily: "Times New Roman", // Set font to Times New Roman
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: "black", // Set background color to black
    color: "white", // Ensure text color is white
  },
});

export default ProfileScreen;
