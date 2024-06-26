import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from "react-native";

import Colors from "../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface Event {
  id: string;
  titre: string;
  description: string;
  date: string;
  horaire: string;
  hashtag: string;
  lieu: string;
  menu: string;
  nbparticipant: string;
  nom: string;
  organisepar: string;
  responseable: string;
}

const EditEvenement = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [horaire, setHoraire] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [lieu, setLieu] = useState("");
  const [menu, setMenu] = useState("");
  const [nbparticipant, setNbParticipant] = useState("");
  const [nom, setNom] = useState("");
  const [organisepar, setOrganisepar] = useState("");
  const [responseable, setResponseable] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  const { id }: { id: string } = route.params as { id: string };

  useEffect(() => {
    fetchEventById(id);
  }, [id]);

  const fetchEventById = async (eventId: string) => {
    try {
      const docSnap = await getDoc(doc(db, "evenement", eventId));
      if (docSnap.exists()) {
        const eventData = docSnap.data() as Event;
        setTitre(eventData.titre);
        setDescription(eventData.description);
        setDate(eventData.date);
        setHoraire(eventData.horaire);
        setHashtag(eventData.hashtag);
        setLieu(eventData.lieu);
        setMenu(eventData.menu);
        setNbParticipant(eventData.nbparticipant);
        setNom(eventData.nom);
        setOrganisepar(eventData.organisepar);
        setResponseable(eventData.responseable);
      } else {
        Alert.alert("Error", "Événement non trouvé");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      Alert.alert("Error", "Erreur lors du chargement de l'événement");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedEvent: { [key: string]: any } = {
        titre,
        description,
        date,
        horaire,
        hashtag,
        lieu,
        menu,
        nbparticipant,
        nom,
        organisepar,
        responseable,
      };
  
      await updateDoc(doc(db, "evenement", id), updatedEvent);
  
      Alert.alert("Success", "Événement mis à jour avec succès");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Erreur lors de la mise à jour de l'événement");
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Modifier Événement</Text>

        <TextInput
          style={styles.input}
          placeholder="Titre"
          value={titre}
          onChangeText={setTitre}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Horaire"
          value={horaire}
          onChangeText={setHoraire}
        />
        <TextInput
          style={styles.input}
          placeholder="Hashtag"
          value={hashtag}
          onChangeText={setHashtag}
        />
        <TextInput
          style={styles.input}
          placeholder="Lieu"
          value={lieu}
          onChangeText={setLieu}
        />
        <TextInput
          style={styles.input}
          placeholder="Menu"
          value={menu}
          onChangeText={setMenu}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre de participants"
          value={nbparticipant}
          onChangeText={setNbParticipant}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={styles.input}
          placeholder="Responsable"
          value={responseable}
          onChangeText={setResponseable}
        />
        <TextInput
          style={styles.input}
          placeholder="Organisé par"
          value={organisepar}
          onChangeText={setOrganisepar}
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
    top:50
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

export default EditEvenement;
