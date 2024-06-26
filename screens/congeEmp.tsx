import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Alert, Text } from "react-native"; // Add Text import
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { where, collection, query, getDocs } from "firebase/firestore";
import Colors from "../constants/Colors";
import { Calendar } from 'react-native-calendars';

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


export default function congeEmp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [congeData, setCongeData] = useState<any[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchUserConges = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const q = query(collection(db, "conge"), where("userId", "==", userId));
          const querySnapshot = await getDocs(q);
          const congesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setCongeData(congesData);
        }
      } catch (error) {
        console.error("Error fetching user's congés:", error);
      }
    };

    fetchUserConges();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderMarkedDates = () => {
    const markedDates: { [date: string]: { marked: boolean; dotColor?: string } } = {};
    congeData.forEach((conge) => {
      const { startDate, endDate } = conge;
      const startISODate = startDate.split('/').reverse().join('-');
      const endISODate = endDate.split('/').reverse().join('-');
  
      const currentDate = new Date(startISODate);
      while (currentDate <= new Date(endISODate)) {
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
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20} />
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
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => console.log('Selected day', day)}
          monthFormat={'MMMM yyyy'}
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={1}
          enableSwipeMonths={true}
          markedDates={renderMarkedDates()} // Pass marked dates to the Calendar component
          theme={{
            selectedDayBackgroundColor: 'blue',
            selectedDayTextColor: 'white',
            todayTextColor: 'blue',
            dayTextColor: 'black',
          }}
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
  calendarContainer: {
    flex: 1,
    marginTop: 20,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 25,

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
  inlineItems: {
    flexDirection: "row",
    alignItems: "center",
    left: 100,
    top: 15,
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
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
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
