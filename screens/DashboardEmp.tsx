import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
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

export default function DashboardEmp() {
 const [userInfo, setUserInfo] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };


  useEffect(() => {
    const getData = async () => {
      try {
        const userId = auth.currentUser?.uid; 
        if (userId) {
          const q = query(collection(db, "mail"), where("userid", "==", userId)); 
          const querySnapshot = await getDocs(q);
          const congesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserInfo(congesData);
        }
      } catch (error) {
        console.error("Error fetching user's congés:", error);
      }
    };

    getData();
  }, []);


  return (
    <View style={styles.container}>
          <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20}/>
          <Feather style={styles.icon} name="plus" size={24} color="black" onPress={() => navigation.navigate('addemail')}/>

        </TouchableOpacity>

      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} >
  {userInfo.map((user, index) => (
    <TouchableOpacity 
          key={index} 
          style={styles.userCard} 
          onPress={() => navigation.navigate('mail', { id: user.id })}
        >
        <Image
        source={require("../assets/2.jpg")}
        style={styles.userLogo}
      />
      <View style={styles.userInfo}>
        <Text> {user.sendername}</Text>
        <Text>{user.subject}</Text>
      </View>
    </TouchableOpacity>
  ))}
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
  icon:{
    left: 320,

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
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  userLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
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
    alignItems: 'center', // Align the table content horizontally
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tableColumn: {
    flex: 1,
    alignItems: 'center', // Align the text horizontally within each column
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
})