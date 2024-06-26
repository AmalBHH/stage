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
import { collection, query, where, getDocs, deleteDoc, getDoc, doc } from "firebase/firestore";


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
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('allocEmp')}>
        <Text style={styles.sidebarText}>Allocations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('congeEmp')}>
        <Text style={styles.sidebarText}>Congés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('CalendarPageEmp')}>
        <Text style={styles.sidebarText}>Rendez-vous</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('ProfileEmp')}>
        <Text style={styles.sidebarText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function actEmp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activityData, setActivityData] = useState<any[]>([]);

  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const fetchUserActivities = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        const userName = userDoc.data()?.name;
        if (userName) {
          const q = query(collection(db, "activity"), where("empname", "==", userName));
          const querySnapshot = await getDocs(q);
          const activitiesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log("Fetched activities:", activitiesData); // Debug log
          setActivityData(activitiesData);
        }
      }
    } catch (error) {
      console.error("Error fetching user's activities:", error);
    }
  };

  useEffect(() => {
    fetchUserActivities();
  }, []);

  const handleDelete = async (activityId: string) => {
    try {
      await deleteDoc(doc(db, "activity", activityId));
      fetchUserActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} top={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Activités</Text>
          </View> 
          {activityData.length > 0 ? (
            activityData.map((activity) => (
              <View key={activity.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{activity.task}</Text>
                <TouchableOpacity onPress={() => handleDelete(activity.id)} style={styles.deleteIcon}>
                  <Feather name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyStateText}>No activities found</Text>
          )}
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
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  menuIcon: {
    padding: 10,
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
  },
  deleteIcon: {
    marginLeft: 10,
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
    color: 'white',
    fontSize: 15,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
