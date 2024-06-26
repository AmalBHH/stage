import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  
} from "react-native";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/firebase";
import { Table, Row } from "react-native-table-component";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";

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
}
export default function calendarlist() {
  const [rdvData, setRdvData] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getRdvData = async () => {
    const rdvCollectionRef = collection(db, "rdv");
    const snapshot = await getDocs(rdvCollectionRef);
    const rdvDataArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRdvData(rdvDataArray);
  };
  const handleDeleteAppointment = async (id: string) => {
    try {
      // Delete the appointment document from Firestore
      await deleteDoc(doc(db, "rdv", id));
      
      // Update the rdvData state to reflect the deletion
      setRdvData(prevRdvData => prevRdvData.filter(item => item.id !== id));
      
      // Show success alert
      Alert.alert("Success", "Appointment deleted successfully.");
    } catch (error) {
      // Show error alert
      console.error("Error deleting appointment:", error);
      Alert.alert("Error", "An error occurred while deleting the appointment.");
    }
  };
  useEffect(() => {
    getRdvData();
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


      <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('CalendarPage')} style={styles.iconButton}>
            <Feather name="calendar" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('calendarlist')} style={styles.iconButton}>
            <Feather name="list" size={30} color="black" />
          </TouchableOpacity>
  
      </View>
      <View style={styles.mainContent}>
        {rdvData.length > 0 ? (

  <Table borderStyle={{ borderWidth: 0.5, borderColor: Colors.primary }}>
    <Row
      data={["Sujet", "Date Début", "Date Fin", "Lieu", "Durée"]}
      style={styles.head}
      textStyle={styles.text}
    />
    {rdvData.map((rowData) => (
      <Row
        key={rowData.id}
        data={[
          rowData.sujet,
          rowData.dateDebut,
          rowData.dateFin,
          rowData.lieu,
          rowData.duree,
         
        ]}
        style={styles.row}
        textStyle={styles.text}
      />
    ))}
  </Table>
  
        ) : (
          <View style={styles.noDataContainer}>
            <Image
              source={require("../assets/11.png")}
              style={{ width: 200, height: 200, marginBottom: 20 }}
            />
            <Text style={styles.noDataText}>
              Ajouter un nouvel Rendez-vous
            </Text>
            <Text style={styles.noDataText}>
              Planifiez et organisez vos rendez-vous efficacement : suivez les
              inscriptions et les participations, automatisez les emails de
              confirmation, vendez des billets, etc.
            </Text>
          </View>
        )}
      </View>
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
  actionCell: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconContainer: {
    padding: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  secondaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
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
  iconButton: {
    padding: 10,
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
    top:-150,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  head: { height: 50,},
  text: { margin: 1 },
  row: { width: 350, flexDirection: "row" },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
});