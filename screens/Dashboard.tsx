import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { where, collection, query, onSnapshot } from "firebase/firestore";

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
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('vidconf')}>
        <Text style={styles.sidebarText}>Meet</Text>
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

export default function Dashboard() {
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
    const userId = auth.currentUser?.uid;
    if (userId) {
      const q = query(collection(db, "mail"), where("userid", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const congesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserInfo(congesData);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20} />
        </TouchableOpacity>
        <Feather style={styles.icon} name="plus" size={24} color="black" onPress={() => navigation.navigate('addemail')} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              <Text style={styles.senderName}>{user.sendername}</Text>
              <Text style={styles.subject}>{user.subject}</Text>
              <Text style={styles.receiverName}>Respnsable : {user.receivername}</Text>  
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: Colors.primary,
  },
  menuIcon: {
    padding: 10,
  },
  icon: {
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subject: {
    fontSize: 14,
    color: '#555',
  },
  receiverName: {  
    fontSize: 14,
    color: '#777',
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: 250,
    backgroundColor: Colors.primary,
    paddingVertical: 50,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
  },
  openSidebar: {
    transform: [{ translateX: 0 }],
  },
  closedSidebar: {
    transform: [{ translateX: -250 }],
  },
  sidebarItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  sidebarText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 15,
  },
});
