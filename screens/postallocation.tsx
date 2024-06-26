import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

interface DropdownProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={handleToggleDropdown} style={styles.dropdownButton}>
        <Text>{selectedValue || "Type de congés"}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleSelectOption(option)}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const postallocation = () => {
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [Duree, setDuree] = useState("");

  const navigation = useNavigation();

  const handlePostConge = async () => {
    if (!type  || !description || !Duree) {
      Alert.alert("Veuillez remplir tous les champs");
      return;
    }
  
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Utilisateur non authentifié");
      return;
    }
  
    const userId = currentUser.uid;

    const congeData = {
      type,
      description,
      Duree,
      state:"en cours",
      userId, // Include the user ID in the data
    };
  
    try {
      const docRef = await addDoc(collection(db, "allocation"), congeData);
      console.log("Document ajouté avec l'ID :", docRef.id);
      Alert.alert("allocation ajouté avec succès");
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'ajout du allocation :", error);
      Alert.alert("Erreur lors de l'ajout du allocation. Veuillez réessayer.");
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demandes d'allocation</Text>
     
   
      <View style={styles.inputContainer}>
        <Text>Durée:</Text>
        <TextInput
          style={styles.input}
          value={Duree}
          onChangeText={setDuree}
          placeholder="Durée"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Type de congé:</Text>
        <Dropdown
          options={["", "Congé impayé", "Congé de maladie", "Congé payé"]}
          selectedValue={type}
          onValueChange={setType}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePostConge}>
        <Text style={styles.buttonText}>Soumettre</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 5,
    top: 20
  },
  title: {
    top: 80,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    top: 80,
    backgroundColor: "#3864b4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    top: 80,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3864b4",
    borderRadius: 5,
    padding: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#3864b4",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: "#3864b4",
    borderRadius: 5,
    marginTop: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3864b4",
  },
});

export default postallocation;
