import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

interface RouteParams {
  id: string;
  routeParam: string;
}

const EditRdv = () => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [duree, setDuree] = useState("");
  const [lieu, setLieu] = useState("");
  const [sujet, setSujet] = useState("");

  const navigation = useNavigation();
  const route = useRoute();

  const { id, routeParam }: RouteParams = route.params as RouteParams;

  useEffect(() => {
    if (id) {
      fetchEventById(id);
    }
  }, [id]);

  const fetchEventById = async (eventId: string) => {
    try {
      const docSnap = await getDoc(doc(db, "rdv", eventId));
      if (docSnap.exists()) {
        const eventData = docSnap.data();
        setDateDebut(eventData.dateDebut);
        setDateFin(eventData.dateFin);
        setDuree(eventData.duree);
        setLieu(eventData.lieu);
        setSujet(eventData.sujet);
      } else {
        Alert.alert("Error", "Rendez-vous non trouvé");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      Alert.alert("Error", "Erreur lors du chargement du rendez-vous");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!id) {
        Alert.alert("Error", "ID du rendez-vous non spécifié.");
        return;
      }
  
      let updatedField: any = {};
  
      if (dateDebut) {
        updatedField.dateDebut = dateDebut;
      } else if (dateFin) {
        updatedField.dateFin = dateFin;
      } else if (duree) {
        updatedField.duree = duree;
      } else if (lieu) {
        updatedField.lieu = lieu;
      } else if (sujet) {
        updatedField.sujet = sujet;
      } else {
        Alert.alert("Error", "Aucun champ à mettre à jour spécifié.");
        return;
      }
  
      await updateDoc(doc(db, "rdv", id), updatedField);
  
      Alert.alert("Success", "Champ mis à jour avec succès");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating field:", error);
      Alert.alert("Error", "Erreur lors de la mise à jour du champ");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Modifier Rendez-vous</Text>
        <Text>{routeParam}</Text> 
        <TextInput
          style={styles.input}
          placeholder="Date Debut"
          value={dateDebut}
          onChangeText={setDateDebut}
        />
        <TextInput
          style={styles.input}
          placeholder="Date Fin"
          value={dateFin}
          onChangeText={setDateFin}
        />
        <TextInput
          style={styles.input}
          placeholder="Duree"
          value={duree}
          onChangeText={setDuree}
        />
        <TextInput
          style={styles.input}
          placeholder="Lieu"
          value={lieu}
          onChangeText={setLieu}
        />
        <TextInput
          style={styles.input}
          placeholder="Sujet"
          value={sujet}
          onChangeText={setSujet}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    justifyContent: "center",
  },
  form: {
    width: "80%",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditRdv;
