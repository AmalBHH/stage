import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { where, collection, query, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

interface Conge {
  id: string;
  type: string;
  Duree: string;
  startDate: string;
  endDate: string;
  state: string;
  userId: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const handleSignout = async () => {
    await auth.signOut();
  };

  const showModal = () => {
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
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('emp')}>
        <Text style={styles.sidebarText}>Employés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('presence')}>
        <Text style={styles.sidebarText}>Présence</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('congead')}>
        <Text style={styles.sidebarText}>Congé</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('config')}>
        <Text style={styles.sidebarText}>Configuration</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.sidebarText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={showModal}>
        <Text style={styles.sidebarText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Congead() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userConges, setUserConges] = useState<Conge[]>([]);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
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
        if (!userId) {
          console.error("No current user found.");
          return;
        }
    
        const q = query(collection(db, "conge"));
        const querySnapshot = await getDocs(q);
        const congesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Conge[];
    
        if (!congesData || !Array.isArray(congesData)) {
          throw new Error("No data returned from Firestore or data is not an array");
        }
    
        console.log("Fetched congé data:", congesData); // Log fetched data
        setUserConges(congesData);
    
        // Fetch user names
        const userIds = congesData.map(conge => conge.userId).filter(Boolean); // Filter out undefined userIds
        console.log("User IDs:", userIds); // Log user IDs
    
        const userNamesData: { [key: string]: string } = {};
        for (const id of userIds) {
          try {
            const userDoc = await getDoc(doc(db, "users", id));
            console.log("User document:", userDoc); // Log user document
    
            if (userDoc.exists()) {
              userNamesData[id] = userDoc.data()?.Name || "Unknown";
            } else {
              console.warn(`User document not found for ID: ${id}`);
            }
          } catch (error) {
            console.error(`Error fetching user document for ID ${id}:`, error);
          }
        }
    
        console.log("Fetched user names:", userNamesData); // Log user names
        setUserNames(userNamesData);
      } catch (error) {
        console.error("Error fetching user's congés:", error);
      }
    };
    
    fetchUserConges();
  }, []);

  const handleStateChange = async (congeId: string) => {
    try {
      const congeRef = doc(db, "conge", congeId);
      await updateDoc(congeRef, {
        state: "accepté",
      });
      // Update the local state immediately
      setUserConges(prevConges =>
        prevConges.map(conge =>
          conge.id === congeId ? { ...conge, state: "accepté" } : conge
        )
      );
    } catch (error) {
      console.error("Error updating congé state:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather
            name={isSidebarOpen ? "x" : "menu"}
            size={30}
            color="black"
            top={20}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.secondaryButtons}>
        <Feather name="calendar" size={24} color="gray" onPress={() => navigation.navigate('congead')} />
        <Feather name="list" size={24} color="gray" onPress={() => navigation.navigate('allocad')} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Nom Employé</Text>
            <Text style={styles.tableHeader}>Type</Text>
            <Text style={styles.tableHeader}>Durée</Text>
            <Text style={styles.tableHeader}>Date de début</Text>
            <Text style={styles.tableHeader}>Date de fin</Text>
            <Text style={styles.tableHeader}>État</Text>
          </View>
          {userConges.map(event => (
            <View key={event.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{userNames[event.userId] || "Unknown"}</Text>
              <Text style={styles.tableCell}>{event.type}</Text>
              <Text style={styles.tableCell}>{event.Duree}</Text>
              <Text style={styles.tableCell}>{event.startDate}</Text>
              <Text style={styles.tableCell}>{event.endDate}</Text>
              <View style={styles.tableCell}>
                {event.state === "en cours" ? (
                  <TouchableOpacity onPress={() => handleStateChange(event.id)}>
                    <Feather name="check-circle" size={20} color="green" />
                  </TouchableOpacity>
                ) : (
                  <Text>Congé acepté</Text>
                )}
              </View>
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  menuIcon: {
    padding: 10,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 25,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  tableContainer: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
  },
  tableHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 5,
    alignItems: 'center', // Center align the content
    justifyContent: 'center', // Center align the content
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
