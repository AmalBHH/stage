import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList
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
        <Text style={styles.sidebarText}>Envenements</Text>
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

export default function empact() {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation<any>();
  const [events, setEvents] = useState<any[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "activity");
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
      await deleteDoc(doc(db, "activity", eventId));
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
  
      <View style={styles.secondaryButtons}>
      <Feather name="grid" size={24} color="gray" onPress={() => navigation.navigate('emp')}/>

        <Feather name="list" size={24} color="gray"  onPress={() => navigation.navigate('listemp')}/>
        <Feather name="clock" size={24} color="black" onPress={() => navigation.navigate('empact')}/>

      </View>
      <TouchableOpacity style={styles.tableButton} onPress={() => console.log('creeemp')}>
      <Text style={styles.tableButtonText} onPress={() => navigation.navigate('addactivity')}>
      Planifier une activité
       </Text>
            </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
       <View style={styles.tableContainer}>
       <View style={styles.tableRow}>
         <Text style={styles.tableHeader}>Nom Employé</Text>
         <Text style={styles.tableHeader}>Tache</Text>
         <Text style={styles.tableHeader}>Actions</Text> 
       </View>
       {events.map(event => (
         <View key={event.id} style={styles.tableRow}>
           <Text style={styles.tableCell}>{event.empname}</Text>
           <Text style={styles.tableCell}>{event.task}</Text>
   
           <View style={styles.actionIcons}>
             <Feather name="edit" size={20} color="black" onPress={() => navigation.navigate('editactivity', { id: event.id })} />
             <Feather name="trash" size={20} color="black" onPress={() => handleDelete(event.id)} />
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
  actionIcons: {
    flex: 1,

    flexDirection: 'row',
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
    top:10,

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
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center', 
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,

  },
  tableColumn: {
    flex: 1,
    alignItems: 'center', 
    paddingHorizontal: 30,
  },
  tableText: {
    marginTop: 5,
    textAlign: 'center', // Center the text horizontally within each column
  },
  tableButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  tableButtonText: {
    color: 'white',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 30,

  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 30,

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
