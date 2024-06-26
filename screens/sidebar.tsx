import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebase';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarScreen: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const handleSignout = async () => {
    await auth.signOut();
  };

  const Modal = () => {
    Alert.alert('Auth App', 'Do you really want to logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      { text: 'Logout', onPress: handleSignout },
    ]);
  };

  const navigation = useNavigation<any>();

  const handleClose = () => {
    onClose && onClose();
  };
  

  return (
    <View style={[styles.sidebar, isOpen ? styles.openSidebar : styles.closedSidebar]}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('CalendarPage')}>
        <Text style={styles.sidebarText}>Calendrier</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>site web</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Evenements</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Employés</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Configuration</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('presence')}>
        <Text style={styles.sidebarText}>Présence</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('congead')}>
        <Text style={styles.sidebarText}>Congé</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarItem} onPress={Modal}>
        <Text style={styles.sidebarText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#333',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: 200,
    paddingTop: 50,
  },
  openSidebar: {
    left: 0,
  },
  closedSidebar: {
    left: -100,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
  sidebarItem: {
    padding: 10,
    borderRadius: 8,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarText: {
    color: 'white',
    fontSize: 15,
  },
});

export default SidebarScreen;
