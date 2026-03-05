// frontend/app/signup.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import api from "./api";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !phone || !password) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Error", "Phone number must be 10 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/signup", {
        name,
        phone,
        password,
        village,
      });

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Registration successful! Please login.",
          [{ text: "OK", onPress: () => router.push("/login") }]
        );
      } else {
        Alert.alert("Error", response.data.message || "Signup failed");
      }
    } catch (error) {
      console.log("❌ SIGNUP ERROR:", error?.response || error);
      Alert.alert(
        "Signup Failed",
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Farmer Registration</Text>
        <Text style={styles.subtitle}>किसान पंजीकरण</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Village Name"
          value={village}
          onChangeText={setVillage}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#27993c",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#aaa" },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: { textAlign: "center", marginTop: 20, color: "#444" },
});