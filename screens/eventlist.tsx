import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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
        <Text style={styles.sidebarText}>site web</Text>
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
        <Text style={styles.sidebarText}>Profil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};
export default function EventList() {
  const [events, setEvents] = useState<any[]>([]);

  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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
  const handleEdit = (eventId: string) => {
    // Handle edit action here
  };


    
  const handleDelete = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "evenement", eventId));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20}/>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.topButton, styles.inactiveButton]} onPress={() => navigation.navigate('createevent')}>
          <Text style={styles.buttonText}>Créer</Text>
        </TouchableOpacity>
     
      </View>
      <View style={styles.secondaryButtons}>
        <Feather name="align-left" size={24} color="gray" onPress={() => navigation.navigate('evenement')} />
        <Feather name="calendar" size={24} color="gray" onPress={() => navigation.navigate('eventcalandar')} />
        <Feather name="list" size={24} color="black" onPress={() => navigation.navigate('eventlist')} />
       </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {events.length > 0 ? (
       <View style={styles.tableContainer}>
       <View style={styles.tableRow}>
         <Text style={styles.tableHeader}>Titre</Text>
         <Text style={styles.tableHeader}>Date</Text>
         <Text style={styles.tableHeader}>Participants</Text>
         <Text style={styles.tableHeader}>Lieu</Text>
         <Text style={styles.tableHeader}>Actions</Text> 
       </View>
       {events.map(event => (
         <View key={event.id} style={styles.tableRow}>
           <Text style={styles.tableCell}>{event.titre}</Text>
           <Text style={styles.tableCell}>{event.date}</Text>
           <Text style={styles.tableCell}>{event.nbparticipant}</Text>
           <Text style={styles.tableCell}>{event.lieu}</Text>
           <View style={styles.actionIcons}>
             <Feather name="edit" size={20} color="black" onPress={() => navigation.navigate('EditEvent', { id: event.id })} />
             <Feather name="trash" size={20} color="black" onPress={() => handleDelete(event.id)} />
           </View>
         </View>
       ))}
     </View>
     
            
        ) : (
          <View style={styles.emptyState}>
            <Image
              source={require('../assets/11.png')}
              style={{ width: 200, height: 200, marginBottom: 20 }}
            />
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Ajouter un nouvel événement
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 14, marginBottom: 20 }}>
              Planifiez et organisez vos événements efficacement: suivez les inscriptions et les participations, automatisez les emails de confirmation, vendez des billets, etc.
            </Text>
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
  actionIcons: {
    flex: 1,

    flexDirection: 'row',
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
  tableContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,

  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,

  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,

  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
