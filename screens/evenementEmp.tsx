import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";

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
        <Text style={styles.sidebarText}>Evenement</Text>
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


export default function Evenement() {
  const [events, setEvents] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "evenement", eventId));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "evenement");
      const snapshot = await getDocs(eventsRef);
      const eventData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20}/>
        </TouchableOpacity>
      </View>
     
  
      <ScrollView style={styles.mainContent}>
        {events.length > 0 ? (
          events.map((event, index) => (
            <View key={index} style={styles.eventCard}>
        
              <Text style={styles.eventTitle}>{event.titre}</Text>
              <Text style={styles.eventInfo}>Date: {event.date}</Text>
              <Text style={styles.eventInfo}>Participants: {event.nbparticipant}</Text>
              <Text style={styles.eventInfo}>Lieu: {event.lieu}</Text>
            </View>
          ))
        ) : (
          <View>
          
          </View>
        )}
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
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: 200, 
    left: 100,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuIcon: {
    padding: 10,
  },
  inactiveButton: {
    backgroundColor:  Colors.primary,
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: 100, 
  },
  activeButton: {
    backgroundColor: 'white',
    borderColor: Colors.primary,
    borderWidth: 1,
    color: Colors.primary,
    width: 100, 
  },
  topButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: 50, 
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
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  mainContent: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
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
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButtonText: {
    color: Colors.primary,
    fontSize: 15,
  },
});
