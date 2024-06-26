import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const EditActivity = () => {
  const [empName, setEmpName] = useState("");
  const [task, setTask] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  const { id }: { id: string } = route.params as { id: string };

  useEffect(() => {
    fetchActivityById(id);
  }, [id]);

  const fetchActivityById = async (activityId: string) => {
    try {
      const docSnap = await getDoc(doc(db, "activity", activityId));
      if (docSnap.exists()) {
        const activityData = docSnap.data();
        setEmpName(activityData.empname);
        setTask(activityData.task);
      } else {
        Alert.alert("Error", "Activité non trouvée");
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      Alert.alert("Error", "Erreur lors du chargement de l'activité");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!empName || !task) {
        Alert.alert("Error", "Veuillez remplir tous les champs.");
        return;
      }

      const updatedActivity = {
        empname: empName,
        task: task,
      };

      await updateDoc(doc(db, "activity", id), updatedActivity);

      Alert.alert("Success", "Activité mise à jour avec succès");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating activity:", error);
      Alert.alert("Error", "Erreur lors de la mise à jour de l'activité");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Modifier Activité</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom de l'employé"
          value={empName}
          onChangeText={setEmpName}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Tâche"
          value={task}
          onChangeText={setTask}
          multiline={true}
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
    top:70,

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
    marginBottom: 20,
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
});

export default EditActivity;
