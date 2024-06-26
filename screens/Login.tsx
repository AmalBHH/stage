import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  Image
} from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { auth, db } from "../firebase/firebase";
import { Entypo } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");
let top;
if (Platform.OS === "ios") {
  top = height * 0.02;
} else {
  top = 0;
}

export default function Login({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        setLoading(false);
        alert("Authentification avec succès :)");

        // Redirect based on role
        if (role === "administrateur") {
          navigation.navigate("Dashboard");
        } else {
          navigation.navigate("DashboardEmp");
        }
      } else {
        setLoading(false);
        alert("Utilisateur non trouvé.");
      }
    } catch (err: any) {
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginHeader}>
        <Image
          source={require('../assets/1.png')}
          style={{ width: 400, height: 220 }}
        />
      </View>
      
      <View style={styles.loginContainer}>
        {/* Email */}
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Email</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        {/* Mot de passe */}
        <View style={styles.passwordContainer}>
          <Text style={styles.passwordText}>Mot de passe</Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mot de passe"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        {/* Forgot Password */}
        <View style={styles.forgotContainer}>
          <TouchableOpacity onPress={() => navigation.push("Forgot")}>
            <Text style={styles.forgotText}>Réinitialiser le mot de passe?</Text>
          </TouchableOpacity>
        </View>
        {/* Login Button */}
        <View style={styles.loginButton}>
          <TouchableOpacity onPress={handleSignin}>
            <Text style={styles.loginButtonText}>
              {loading ? "Loading" : "Connexion"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupGroup}>
          <Text style={styles.new}>Vous n'avez pas de compte?</Text>
          <TouchableOpacity onPress={() => navigation.push("Signup")}>
            <Text style={styles.signup}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>Contactez-nous</Text>
          <Text style={styles.contactInfo}>+216 29224422 / +216 98448070</Text>
          <Text style={styles.contactInfo}>technique@psi-point.fr</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: height * 0.05,
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  loginHeader: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 200, 
    height: 200,
  },
  loginHeaderText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  loginContainer: {
    marginTop: 20,
  },
  emailContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emailInput: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 8,
    paddingLeft: 10,
  },
  passwordContainer: {
    marginTop: 20,
  },
  passwordText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordInput: {
    marginTop: 10,
    width: "100%",
    height: 50,
    backgroundColor: Colors.light,
    borderRadius: 8,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  forgotContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  forgotText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  loginButton: {
    marginTop: 20,
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  signupGroup: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signup: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  new: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 5,
  },
  contactContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  contactText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    fontSize: 14,
    marginTop: 5,
  },
});
