import React, { useState } from "react";
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const createrdv = () => {
  const [dateDebut, setDateDebut] = useState<Date | null>(null);
  const [dateFin, setDateFin] = useState<Date | null>(null);
  const [duree, setDuree] = useState<string>("");
  const [lieu, setLieu] = useState<string>("");
  const [sujet, setSujet] = useState<string>("");
  const [selectedDateField, setSelectedDateField] = useState<string>("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      if (!dateDebut || !dateFin || !duree || !lieu || !sujet) {
        Alert.alert("Error", "Veuillez remplir tous les champs.");
        return;
      }

      const newAppointment = {
        dateDebut: dateDebut?.toISOString().split("T")[0], // Convert Date to string
        dateFin: dateFin?.toISOString().split("T")[0], // Convert Date to string
        duree,
        lieu,
        sujet,
      };

      await addDoc(collection(db, "rdv"), newAppointment);

      Alert.alert("Success", "Rendez-vous créé avec succès ");

      navigation.goBack();
    } catch (error) {
      console.error("Error ", error);
      Alert.alert("Error", "Erreur");
    }
  };

  const showDatePicker = (field: string) => {
    setSelectedDateField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    if (selectedDateField === "dateDebut") {
      setDateDebut(date);
    } else if (selectedDateField === "dateFin") {
      setDateFin(date);
    }
    hideDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Nouveau Rendez-vous</Text>
        <TextInput
          style={styles.input}
          placeholder="Date Debut"
          value={dateDebut ? dateDebut.toLocaleDateString() : ""}
          onFocus={() => showDatePicker("dateDebut")}
        />
        <TextInput
          style={styles.input}
          placeholder="Date Fin"
          value={dateFin ? dateFin.toLocaleDateString() : ""}
          onFocus={() => showDatePicker("dateFin")}
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
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Ajouter</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()} // Set minimum date to current date
          date={selectedDateField === "dateDebut" ? dateDebut || new Date() : dateFin || new Date()}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
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

export default createrdv;
