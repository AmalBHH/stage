import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import { auth } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const handlePassword = async () => {
    await sendPasswordResetEmail(auth, email)
      .then(() => alert("Email envoyé avec succées 🚀"))
      .catch((error: any) => console.log(error.message));
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
      source={require('../assets/1.png')} 
      style={{ width: 400, height: 220 }}
      />
      </View>
      <View>
          <Text style={styles.text}></Text>
        </View>
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.text}>Votre Email?</Text>
        </View>
        <View style={styles.emailContainer}>
          <Feather
            name="mail"
            size={20}
            color="gray"
            style={{ marginLeft: 15 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter votre email ici"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handlePassword}
        >
          <View>
            <Text style={styles.send}>Confirmer</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.spam}>
          <Text style={{ fontSize: 12, color: "#000", fontWeight: "400" }}>
          Vérifiez spam pour trouver le lien de réinitialisation du mot de passe
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',

    flex: 1,
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: "8%",
  },
  imageContainer: {
    marginTop: 55,
  },
  emailContainer: {
    marginTop: 15,
    width: "100%",
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: Colors.dark,
    fontSize: 16,
    paddingHorizontal: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: "5%",
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    color: Colors.white,
    fontSize: 18,
  },
  send: {
    color: Colors.white,
    fontSize: 18,
  },
  spam: {
    marginTop: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
});
// behavior={Platform.OS === "ios" ? "padding" : "height"}
//       // keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
