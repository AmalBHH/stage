import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Mail: React.FC = () => {
  const [mail, setMail] = useState<any>(null);
  const navigation = useNavigation<any>();
  const route = useRoute();

  useEffect(() => {
    const fetchMail = async () => {
      const { id } = route.params as { id: string };
      const docRef = doc(db, "mail", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMail(docSnap.data());
      } else {
        console.log("No such mail found!");
      }
    };

    fetchMail();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Feather name="chevron-left" size={24} color="black" />
          <Text style={styles.backButton}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {mail && (
          <View style={styles.mailContainer}>
            <View style={styles.senderInfo}>
              <Image source={require("../assets/2.jpg")} style={styles.senderLogo} />
              <Text style={styles.senderName}>{mail.sendername}</Text>
            </View>
            <Text style={styles.mailSubject}>{mail.subject}</Text>
            <Text style={styles.mailContent}>{mail.msg}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  backButton: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mailContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  senderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  senderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mailSubject: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mailContent: {
    fontSize: 16,
  },
});

export default Mail;
