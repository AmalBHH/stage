
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
import { doc, getDoc } from "firebase/firestore";
import { Calendar } from 'react-native-calendars';
import {  Linking } from 'react-native';

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



export default function siteweb() {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getData = async () => {
    const docRef = doc(db, "users", "info");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20}/>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
            <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.topButton, styles.inactiveButton]}>
            <Text style={styles.buttonText}>WA9TI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.topButton, styles.activeButton]}>
            <Text style={styles.buttonText}>La semaine derniére </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.topButton, styles.activeButton]}>
            <Text style={styles.buttonText}>Le moin dernier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.topButton, styles.activeButton]}>
            <Text style={styles.buttonText}>L'année derniére</Text>
            </TouchableOpacity>
        </View>
        
      <Text style={styles.analyticsText}>Analytics</Text>
  <TouchableOpacity style={styles.container2} onPress={() => Linking.openURL('https://wa9ti.tn/')}>
    <Text style={styles.button}>Visiter wa9ti.tn</Text>
  </TouchableOpacity>
</View>


      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    left: 5,
    right:5,
  },
  container2: {
    flex: 0.2,
    top: 30,

    backgroundColor: 'white',
    left: 10,
    right:10,
  },
  analyticsText: {
    top: 10,

    fontSize: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  button: {
    backgroundColor:  Colors.primary,
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: 150, 
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
    top: 10,

    left: 0,
  },
  closedSidebar: {
    left: -100,
  },
  buttonRow: {
    top: 20,
    width: 350, 
    left: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  topButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: 50, 

  },
  activeButton: {
    padding: 5,
    width: 50, 

    backgroundColor: 'gray', 
  },
  inactiveButton: {
    padding: 5,

    backgroundColor: '#ccc', 
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
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
    marginTop: 50, 
  },
});
