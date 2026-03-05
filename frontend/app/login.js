// ============================
// frontend/app/login.js
// ============================

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import api from "./api"; // ✅ USE SHARED AXIOS INSTANCE

export default function LoginScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 🔐 Basic validation
    if (!phone || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Error", "Phone number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        phone,
        password,
      });

      if (response.data.success) {
        router.push({
          pathname: "/home",
          params: {
            farmerId: response.data.farmer_id,
            farmerName: response.data.name,
          },
        });
      } else {
        Alert.alert("Login Failed", response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.log("❌ LOGIN ERROR:", error?.response || error);

      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Network / server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>🌾 Kisan AI Assistant</Text>
        <Text style={styles.subtitle}>किसान एआई सहायक</Text>
        <Text style={styles.description}>
          Get instant farming advice powered by AI
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Phone Number (फोन नंबर)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (पासवर्ड)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login (लॉगिन करें)"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.linkText}>
            New Farmer? Register Here{"\n"}
            (नए किसान? यहाँ रजिस्टर करें)
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "#444",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
    color: "#888",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#269431",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#0d662f",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#444",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
  },
});