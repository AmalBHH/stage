import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ScrollView ,FlatList} from "react-native";
import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface User {
  name: string;
}

const CustomDropdown = ({ options, onSelect }: { options: User[], onSelect: (value: string) => void }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowDropdown(!showDropdown)}>
        <Text>Select an option</Text>
      </TouchableOpacity>
      {showDropdown && (
        <FlatList
          style={styles.dropdownList}
          data={options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.dropdownItem} onPress={() => {
              onSelect(item.name);
              setShowDropdown(false);
            }}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const CreateEvenement = () => {
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
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [selectedDateField, setSelectedDateField] = useState<string>("");
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const usersData: User[] = snapshot.docs.map((doc) => ({
        name: doc.data().Name,
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!titre || !description || !date || !horaire || !hashtag || !lieu || !menu || !nbparticipant || !nom || !organisepar || !responseable) {
        Alert.alert("Error", "Veuillez remplir tous les champs.");
        return;
      }

      const newEvenement = {
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

      await addDoc(collection(db, "evenement"), newEvenement);

      Alert.alert("Success", "Evenement créé avec succès");

      navigation.goBack();
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Erreur lors de la création de l'événement");
    }
  };

  const showDatePicker = (field: string) => {
    setSelectedDateField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    console.warn("A date has been picked: ", selectedDate);
    if (selectedDateField === "date") {
      setDate(selectedDate.toISOString().split("T")[0]); // Save date as string
    } else if (selectedDateField === "horaire") {
      setHoraire(selectedDate.toLocaleTimeString()); // Save time as string
    }
    hideDatePicker();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Nouvel Evenement</Text>
        
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
        
        <TouchableOpacity style={styles.input} onPress={() => showDatePicker("date")}>
          <Text>Date: {date}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.input} onPress={() => showDatePicker("horaire")}>
          <Text>Horaire: {horaire}</Text>
        </TouchableOpacity>

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
        
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Responsable :</Text>
          <CustomDropdown
            options={users}
            onSelect={setResponseable}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Organisé par :</Text>
          <CustomDropdown
            options={users}
            onSelect={setOrganisepar}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Créer</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={selectedDateField === "horaire" ? "time" : "date"}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: "white",
    padding: 5,
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
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
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
  dropdownContainer: {
    position: 'relative',
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 150,
    zIndex: 9999,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CreateEvenement;
