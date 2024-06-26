import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
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
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('DashboardEmp')}>
        <Text style={styles.sidebarText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('vidconfEmp')}>
        <Text style={styles.sidebarText}>Meet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('actEmp')}>
        <Text style={styles.sidebarText}>Activités</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('sitewebEmp')}>
        <Text style={styles.sidebarText}>Site web</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('evenementEmp')}>
        <Text style={styles.sidebarText}>Événements</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('allocEmp')}>
        <Text style={styles.sidebarText}>Allocations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('congeEmp')}>
        <Text style={styles.sidebarText}>Congés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('CalendarPageEmp')}>
        <Text style={styles.sidebarText}>Rendez-vous</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('ProfileEmp')}>
        <Text style={styles.sidebarText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const VidConfEmp: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meetUrl, setMeetUrl] = useState('');
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
    try {
      const docRef = doc(db, "meet", "71niipzODJNdfRsyxL9T");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const url = docSnap.data().url;
        if (url) {
          const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
          Linking.openURL(formattedUrl);
        } else {
          Alert.alert("Error", "No URL found in the document.");
        }
      } else {
        Alert.alert("Error", "No such document.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to join the meeting.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20} />
        </TouchableOpacity>
      </View>

      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}

      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.button} onPress={handleJoinMeet}>
          <Text style={styles.buttonText}>Rejoindre Meet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    width: 200,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    padding: 10,
  },
  sidebar: {
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: 200,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  openSidebar: {
    left: 0,
  },
  closedSidebar: {
    left: -200,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sidebarItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VidConfEmp;
