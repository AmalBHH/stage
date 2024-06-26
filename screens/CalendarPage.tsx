
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { doc, getDocs,collection, query } from "firebase/firestore";
import { Calendar } from 'react-native-calendars';
import { CheckBox } from 'react-native-elements';

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
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function CalendarPage() {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation<any>();
  const [appointments, setAppointments] = useState<any[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
        const rdvCollectionRef = collection(db, "rdv");
        const snapshot = await getDocs(rdvCollectionRef);
        const rdvDataArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(rdvDataArray);
      };
    fetchAppointments();
  }, []);

  const renderMarkedDates = () => {
    const markedDates: { [date: string]: { marked: boolean; dotColor?: string } } = {};
    appointments.forEach((appointment) => {
      const { dateDebut, dateFin } = appointment;
      console.log(dateDebut)
      console.log(dateFin)
      const currentDate = new Date(dateDebut);
      while (currentDate <= new Date(dateFin)) {
        markedDates[currentDate.toISOString().slice(0, 10)] = { marked: true, dotColor: 'blue' };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return markedDates;
  };
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
        <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20}/>
        </TouchableOpacity>
      </View>
      <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('CalendarPage')} style={styles.iconButton}>
            <Feather name="calendar" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('calendarlist')} style={styles.iconButton}>
            <Feather name="list" size={30} color="black" />
          </TouchableOpacity>
  
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => console.log('Selected day', day)}
          monthFormat={'MMMM yyyy'}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={1}
          enableSwipeMonths={true}
          markedDates={renderMarkedDates()}
        />
      </View>
      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  participantsContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  participantText: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonLabel: {
    color: 'white',
    textAlign: 'center',
  },
  
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  
  iconButton: {
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
  calendarContainer: {
    flex: 1,
    marginTop: 20, 
  },
});
