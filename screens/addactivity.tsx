import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from "react-native";

import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

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


const CreateActivity = () => {
  const [empName, setEmpName] = useState("");
  const [task, setTask] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation();

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
  
  
  const handleSubmit = async () => {
    try {
      if (!empName || !task) {
        Alert.alert("Error", "Veuillez remplir tous les champs.");
        return;
      }

      const newActivity = {
        empname: empName,
        task: task,
      };

      await addDoc(collection(db, "activity"), newActivity);

      Alert.alert("Success", "Activité créée avec succès");

      navigation.goBack();
    } catch (error) {
      console.error("Error creating activity:", error);
      Alert.alert("Error", "Erreur lors de la création de l'activité");
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Nouvelle Activité</Text>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Employé :</Text>
          <CustomDropdown
            options={users}
            onSelect={setEmpName}
          />
        </View>

        <TextInput
          style={styles.textArea}
          placeholder="Tâche"
          value={task}
          onChangeText={setTask}
          multiline={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Créer</Text>
        </TouchableOpacity>
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
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 100,
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

export default CreateActivity;
