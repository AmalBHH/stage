import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { where, collection, query, getDocs } from "firebase/firestore";

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
        <Text style={styles.sidebarText}>site web</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('evenementEmp')}>
        <Text style={styles.sidebarText}> Evenement</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('allocEmp')}>
        <Text style={styles.sidebarText}>Allocations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('congeEmp')}>
        <Text style={styles.sidebarText}>Congés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('CalendarPageEmp')}>
        <Text style={styles.sidebarText}>Rendez-vous</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem}  onPress={() => navigation.navigate('ProfileEmp')}>
        <Text style={styles.sidebarText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};


export default function Conge() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userConges, setUserConges] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const fetchUserConges = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const q = query(collection(db, "conge"), where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          const congesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserConges(congesData);
        }
      } catch (error) {
        console.error("Error fetching user's congés:", error);
      }
    };

    fetchUserConges();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} top={20} size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.inlineItems}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => navigation.navigate('postconge')}>Nouvelle demande de congé</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.secondaryButtons}>
        <Feather name="calendar" size={24} color="black" onPress={() => navigation.navigate('congeEmp')} />
        <Feather name="align-left" size={24} color="gray" onPress={() => navigation.navigate('consconj')} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Type</Text>
            <Text style={styles.tableHeader}>Durée</Text>
            <Text style={styles.tableHeader}>Date de début</Text>
            <Text style={styles.tableHeader}>Date de Fin</Text>
            <Text style={styles.tableHeader}>Etat</Text> 
          </View>
          {userConges.map(event => (
            <View key={event.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{event.type}</Text>
              <Text style={styles.tableCell}>{event.Duree}</Text>
              <Text style={styles.tableCell}>{event.startDate}</Text>
              <Text style={styles.tableCell}>{event.endDate}</Text>
              <Text style={styles.tableCell}>{event.state}</Text> 
            </View>
          ))}
        </View>
      </ScrollView>

      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 10,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 25,
  },
  inlineItems: {
    flexDirection: "row",
    alignItems: "center",
    left: 120,
    top: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  menuIcon: {
    padding: 10,
  },
  sidebar: {
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 10,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: 120,
    paddingTop: 50,
  },
  openSidebar: {
    left: 0,
  },
  closedSidebar: {
    left: -100,
  },
  sidebarItem: {
    padding: 10,
    borderRadius: 8,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarText: {
    color: Colors.white,
    fontSize: 15,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
});
