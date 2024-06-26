import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Linking } from 'react-native';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const handleSignout = async () => {
    await auth.signOut();
  };

  const Modal = () => {
    Alert.alert("Auth App", "Do you really want to logout", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      { text: "Logout", onPress: handleSignout },
    ]);
  };

  const navigation = useNavigation<any>();
  return (
    <View style={[styles.sidebar, isOpen ? styles.openSidebar : styles.closedSidebar]}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.sidebarText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('CalendarPage')}>
        <Text style={styles.sidebarText}>Calendrier</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('siteweb')}>
        <Text style={styles.sidebarText}>Site web</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('evenement')}>
        <Text style={styles.sidebarText}>Événements</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('emp')}>
        <Text style={styles.sidebarText}>Employés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('presence')}>
        <Text style={styles.sidebarText}>Présence</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('congead')}>
        <Text style={styles.sidebarText}>Congé</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('config')}>
        <Text style={styles.sidebarText}>Configuration</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.sidebarText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const VidConf: React.FC = () => {
  const [meetUrl, setMeetUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleCreateMeet = () => {
    Linking.openURL('https://meet.google.com/');
  };

  const handleJoinMeet = async () => {
    if (meetUrl) {
      const formattedUrl = meetUrl.startsWith('http://') || meetUrl.startsWith('https://') ? meetUrl : `https://${meetUrl}`;
      try {
        const docRef = doc(db, "meet", "71niipzODJNdfRsyxL9T");
        await updateDoc(docRef, { url: formattedUrl });
        Linking.openURL(formattedUrl);
      } catch (error) {
        Alert.alert("Error", "Failed to join the meeting.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid URL.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20}/>
        </TouchableOpacity>
      </View>

      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}

      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.button} onPress={handleCreateMeet}>
          <Text style={styles.buttonText}>Créer Meet</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Entrer l'URL de Google Meet"
          value={meetUrl}
          onChangeText={setMeetUrl}
        />

        <TouchableOpacity style={styles.button} onPress={handleJoinMeet}>
          <Text style={styles.buttonText}>Rejoindre le Meet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    backgroundColor: Colors.primary,
  },
  menuIcon: {
    padding: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    width: 200,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    marginVertical: 10,
  },
  sidebar: {
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: 250,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  openSidebar: {
    transform: [{ translateX: 0 }],
  },
  closedSidebar: {
    transform: [{ translateX: -250 }],
  },
  sidebarItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  sidebarText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 15,
  },
});

export default VidConf;
