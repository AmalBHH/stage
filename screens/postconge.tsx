import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DropdownProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onValueChange,
}) => {
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
      <TouchableOpacity
        onPress={handleToggleDropdown}
        style={styles.dropdownButton}
      >
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

const PostConge = () => {
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [Duree, setDuree] = useState<string>("");
  const [isDatePickerStartVisible, setDatePickerStartVisibility] =
    useState<boolean>(false);
  const [isDatePickerEndVisible, setDatePickerEndVisibility] =
    useState<boolean>(false);

  const navigation = useNavigation();

  const handlePostConge = async () => {
    if (!type || !startDate || !endDate || !description || !Duree) {
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
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      description,
      Duree,
      state:"en cours",
      userId, // Include the user ID in the data
    };

    try {
      await addDoc(collection(db, "conge"), congeData);
      Alert.alert("Congé ajouté avec succès");
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'ajout du congé :", error);
      Alert.alert("Erreur lors de l'ajout du congé. Veuillez réessayer.");
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";

    const formattedDate = new Date(date).toLocaleDateString("fr-FR");
    return formattedDate;
  };

  const showDatePickerStart = () => {
    setDatePickerStartVisibility(true);
  };

  const hideDatePickerStart = () => {
    setDatePickerStartVisibility(false);
  };

  const handleConfirmStart = (selectedDate: Date) => {
    setStartDate(selectedDate);
    hideDatePickerStart();
    calculateDuration(selectedDate, endDate);
  };

  const showDatePickerEnd = () => {
    setDatePickerEndVisibility(true);
  };

  const hideDatePickerEnd = () => {
    setDatePickerEndVisibility(false);
  };

  const handleConfirmEnd = (selectedDate: Date) => {
    setEndDate(selectedDate);
    hideDatePickerEnd();
    calculateDuration(startDate, selectedDate);
  };

  const calculateDuration = (start: Date | null, end: Date | null) => {
    if (start && end) {
      const differenceMs = end.getTime() - start.getTime();
      const days = differenceMs / (1000 * 60 * 60 * 24);
      setDuree(days.toFixed(0));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demandes de congés</Text>
      <View style={styles.inputContainer}>
        <Text>Type de congé:</Text>
        <Dropdown
          options={["", "Congé impayé", "Congé de maladie", "Congé payé"]}
          selectedValue={type}
          onValueChange={setType}
        />
        <Text>Date de début:</Text>
        <TouchableOpacity style={styles.input} onPress={showDatePickerStart}>
          <Text>{startDate ? startDate.toLocaleDateString() : "Date de début"}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerStartVisible}
          mode="date"
          onConfirm={handleConfirmStart}
          onCancel={hideDatePickerStart}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Date de fin:</Text>
        <TouchableOpacity style={styles.input} onPress={showDatePickerEnd}>
          <Text>{endDate ? endDate.toLocaleDateString() : "Date de fin"}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerEndVisible}
          mode="date"
          onConfirm={handleConfirmEnd}
          onCancel={hideDatePickerEnd}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Durée (jours):</Text>
        <TextInput
          style={styles.input}
          value={Duree}
          onChangeText={setDuree}
          placeholder="Durée"
          editable={false} // Disable editing
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
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
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

export default PostConge;
