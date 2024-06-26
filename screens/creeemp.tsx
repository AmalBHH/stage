import React, { useState } from "react";
import { StyleSheet,  Alert,
    Text, View, TextInput, TouchableOpacity,ScrollView  } from "react-native";
import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import {auth, db } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const handleSignout = async () => {
      await auth.signOut();
    };
  
    const Modal = () => {
      Alert.alert("Auth App", "Do you really want to logout", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        { text: "Logout", onPress: handleSignout },
      ]);
    };
  
    const navigation = useNavigation<any>();
    return (
      <View style={[styles.sidebar, isOpen ? styles.openSidebar : styles.closedSidebar]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.sidebarText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('CalendarPage')}>
          <Text style={styles.sidebarText}>Calendrier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('siteweb')}>
          <Text style={styles.sidebarText}>site web</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('evenement')}>
          <Text style={styles.sidebarText}>Envenements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('emp')}>
          <Text style={styles.sidebarText}>Employés</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('presence')}>
          <Text style={styles.sidebarText}>Présence</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('congead')}>
          <Text style={styles.sidebarText}>Congé</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('config')}>
          <Text style={styles.sidebarText}>Configuration</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.sidebarText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
          <Text style={styles.sidebarText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const CreateEmployee = () => {
    const [Name, setEmployeeName] = useState("");
    const [Email, setEmail] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [role, setrole] = useState("employe");

    const navigation = useNavigation<any>();


    const handleSubmit = async () => {
      try {
        if (!Name || !Email || !PhoneNumber) {
          Alert.alert("Error", "Veuliiez Remplir tous les champs.");
          return;
        }
  
        const newemp = {
          Name,
          Email,
          PhoneNumber,
          role
         
        };
        setrole("employe");
        await addDoc(collection(db, "users"), newemp);
  
        Alert.alert("Success", "Employé crée avec succées ");
  
        navigation.goBack();
      } catch (error) {
        console.error("Error ", error);
        Alert.alert("Error", "erreur");
      }
    };

  return (
    <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Nouveau Employé</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'employé"
            value={Name}
            onChangeText={(text) => setEmployeeName(text)}
          />
         
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={Email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro de Téléphone"
            value={PhoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
       </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Créer l'employé</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 5,
        top: 50
      },
  content: {
    flex: 1, 
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    width: "80%",
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor:  Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 40,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 0,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    top:-20,
  },
  inlineItems: {
    flexDirection: "row",
    alignItems: "center",
    left: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  menuIcon: {
    padding: 10,
  },
  sidebar: {
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 10,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: 120,
    paddingTop: 50,
  },
  openSidebar: {
    left: 0,
  },
  closedSidebar: {
    left: -100,
  },
  sidebarItem: {
    padding: 10,
    borderRadius: 8,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  sidebarText: {
    color: Colors.white,
    fontSize: 15,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
});

export default CreateEmployee;
