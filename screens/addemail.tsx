import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from "react-native";
import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

interface User {
  name: string;
  id: string;
}

const CustomDropdown = ({ options, onSelect, selectedValue }: { options: User[], onSelect: (value: string) => void, selectedValue: string }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowDropdown(!showDropdown)}>
        <Text>{selectedValue ? selectedValue : "Select an option"}</Text>
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

const AddEmail = () => {
  const [empName, setEmpName] = useState("");
  const [subject, setSubject] = useState("");
  const [mail, setMail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const usersData: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().Name,
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const selectedUser = users.find(user => user.name === empName);
        if (selectedUser) {
          await addDoc(collection(db, "mail"), {
            msg: mail,
            sendername: currentUser.displayName,
            subject: subject,
            userid: selectedUser.id,
            receivername: empName, // Add receiver name here
          });
          Alert.alert("Success", "Email envoyé avec succès");
          navigation.goBack();
        } else {
          console.error("Utilisateur sélectionné non trouvé.");
        }
      } else {
        console.error("Utilisateur actuel non trouvé.");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'e-mail :", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Nouveau Email</Text>
        
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Responsable :</Text>
          <CustomDropdown
            options={users}
            onSelect={setEmpName}
            selectedValue={empName}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Objet"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Contenu"
          value={mail}
          onChangeText={setMail}
          multiline={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Annuler</Text>
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
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
  cancelButton: {
    backgroundColor: '#ccc',
    marginTop: 10,
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

export default AddEmail;
