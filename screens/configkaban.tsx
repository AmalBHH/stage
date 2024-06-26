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
import { collection, getDocs, query, where } from "firebase/firestore";

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
    <View
      style={[
        styles.sidebar,
        isOpen ? styles.openSidebar : styles.closedSidebar,
      ]}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.sidebarText}>Messages</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("CalendarPage")}
      >
        <Text style={styles.sidebarText}>Calendrier</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("siteweb")}
      >
        <Text style={styles.sidebarText}>site web</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("evenement")}
      >
        <Text style={styles.sidebarText}>Envenements</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("emp")}
      >
        <Text style={styles.sidebarText}>Employés</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("presence")}
      >
        <Text style={styles.sidebarText}>Présence</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("congead")}
      >
        <Text style={styles.sidebarText}>Congé</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("config")}
      >
        <Text style={styles.sidebarText}>Configuration</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.sidebarText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function configkaban() {
  const [userInfo, setUserInfo] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getData = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("role", "==", "employe")); // Filtrer par role === "employe"
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserInfo(userData);
      console.log(userData)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  
  };
  useEffect(() => {
    getData();
  }, []);

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
        <Feather name="grid" size={24} color="gray" onPress={() => navigation.navigate('config')}/>
        <Feather name="list" size={24} color="black"  onPress={() => navigation.navigate('configkaban')}/>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
  {userInfo.map((user, index) => (
    <View key={index} style={styles.userCard}>
      <Image
        source={require("../assets/2.jpg")}
        style={styles.userLogo}
      />
      <View style={styles.userInfo}>
        <Text>Name: {user.Name}</Text>
        <Text>Email: {user.Email}</Text>
      </View>
    </View>
  ))}
</ScrollView>


      {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    top: 20,

  },
  menuIcon: {
    padding: 10,
  },
  inactiveButton: {
    backgroundColor: Colors.primary,
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    width: 100,
  },
  activeButton: {
    backgroundColor: "white",
    borderColor: Colors.primary,
    borderWidth: 1,
    color: Colors.primary,
    width: 100,
  },
  topButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
});
