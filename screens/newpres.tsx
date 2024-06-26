import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface User {
  id?: string;
  name: string;
}

const NewPres = () => {
  const [empName, setEmpName] = useState<User | null>(null);
  const [arrive, setArrive] = useState<Date | null>(null);
  const [sortie, setSortie] = useState<Date | null>(null);
  const [hdetravail, setHdetravail] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);
  const [isDatePickerArriveVisible, setDatePickerArriveVisibility] =
    useState<boolean>(false);
  const [isDatePickerSortieVisible, setDatePickerSortieVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("role", "==", "employe")));
  
      const usersData: User[] = querySnapshot.docs.map((doc) => ({
        name: doc.data().Name,
      }));
  
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  const navigation = useNavigation<any>();

  const handleSubmit = async () => {
    try {
      if (!empName || !arrive || !sortie || !hdetravail) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return;
      }
  
      const heuresTravail = parseFloat(hdetravail); 
  
      if (isNaN(heuresTravail)) {
        Alert.alert("Erreur", "Veuillez entrer un nombre valide pour les heures de travail");
        return;
      }
  
      const newPres = {
        empname: empName.name,
        arrive: arrive ? arrive.toISOString().substr(11, 8) : "", 
        sortie: sortie ? sortie.toISOString().substr(11, 8) : "", 
        hdetravail: heuresTravail.toFixed(0), 
      };
  
      await addDoc(collection(db, "pres"), newPres);
  
      Alert.alert("Succès", "Présence créée avec succès");
  
      navigation.goBack();
    } catch (error) {
      console.error("Error creating présence:", error);
      Alert.alert("Erreur", "Erreur lors de la création de la présence");
    }
  };
  

  const showDatePickerArrive = () => {
    setDatePickerArriveVisibility(true);
  };

  const hideDatePickerArrive = () => {
    setDatePickerArriveVisibility(false);
  };

  const handleConfirmArrive = (selectedDate: Date) => {
    setArrive(selectedDate);
    hideDatePickerArrive();
  };

  const showDatePickerSortie = () => {
    setDatePickerSortieVisibility(true);
  };

  const hideDatePickerSortie = () => {
    setDatePickerSortieVisibility(false);
  };

  const handleConfirmSortie = (selectedDate: Date) => {
    setSortie(selectedDate);
    hideDatePickerSortie();
  };

  const calculateHoursOfWork = () => {
    if (arrive && sortie) {
      const differenceMs = sortie.getTime() - arrive.getTime();
      const hoursWorked = differenceMs / (1000 * 60 * 60); // Millisecondes à heures
      setHdetravail(hoursWorked.toFixed(2)); // Arrondi à 2 décimales
    }
  };

  useEffect(() => {
    calculateHoursOfWork();
  }, [arrive, sortie]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enregistrer présence</Text>
        <View style={styles.form}>
          <View style={styles.pickerContainer}>
            <CustomDropdown
              options={users}
              onSelect={(user) => setEmpName(user)}
            />
          </View>
          <TouchableOpacity style={styles.input} onPress={showDatePickerArrive}>
            <Text>
              Heure d'arrivée : {arrive ? arrive.toLocaleTimeString() : ""}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerArriveVisible}
            mode="time"
            onConfirm={handleConfirmArrive}
            onCancel={hideDatePickerArrive}
          />

          <TouchableOpacity style={styles.input} onPress={showDatePickerSortie}>
            <Text>
              Heure de Sortie : {sortie ? sortie.toLocaleTimeString() : ""}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerSortieVisible}
            mode="time"
            onConfirm={handleConfirmSortie}
            onCancel={hideDatePickerSortie}
          />

          <TextInput
            style={styles.input}
            placeholder="Heures de travail"
            value={hdetravail}
            onChangeText={(text) => setHdetravail(text)}
            editable={false}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const CustomDropdown = ({
  options,
  onSelect,
}: {
  options: User[];
  onSelect: (user: User) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text>Sélectionner un employé</Text>
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdownList}>
          {options.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(item);
                setShowDropdown(false);
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 5,
    top: 50,
  },
  content: {
    top: 100,
    flex: 1,
    backgroundColor: "white",
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
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  pickerContainer: {
    marginBottom: 10,
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    maxHeight: 150,
    zIndex: 9999,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedEmployee: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default NewPres;
