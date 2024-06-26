import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { launchImageLibrary } from 'react-native-image-picker';
import Colors from "../constants/Colors";
import { auth, db } from "../firebase/firebase";
import { ImagePickerResponse } from 'react-native-image-picker';

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



export default function ProfileEmp() {
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const getData = async () => {
    try {
      const docRef = doc(db, "users", "info");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserInfo(userData);
        setNewUsername(userData.Name);
        setNewEmail(userData.Email);
        setNewPassword(userData.Password || "");
        setProfileImage(userData.PhotoURL || null);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
          setImageUri(response.assets[0].uri);
        } else {
          console.log('Failed to get image uri');
        }
      }
    );
  };
  const uploadImage = async (uri: string, userId: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(getStorage(), `profileImages/${userId}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const updateProfileData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not logged in.");
        return;
      }

      let photoURL = profileImage;
      if (imageUri) {
        photoURL = await uploadImage(imageUri, currentUser.uid);
        setProfileImage(photoURL);
      }

      await updateProfile(currentUser, {
        displayName: newUsername,
        photoURL: photoURL,
      });

      if (newEmail !== currentUser.email) {
        await updateEmail(currentUser, newEmail);
      }

      if (newPassword) {
        await updatePassword(currentUser, newPassword);
      }

      const docRef = doc(db, "users", currentUser.uid);
      const userData = {
        Name: newUsername,
        Email: newEmail,
        Password: newPassword,
        PhotoURL: photoURL,
      };

      await setDoc(docRef, userData);

      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Error updating profile.");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuIcon}>
          <Feather name={isSidebarOpen ? "x" : "menu"} size={30} color="black" top={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.loginHeader}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        ) : (
          <Image source={require("../assets/2.jpg")} style={{ width: 100, height: 100, borderRadius: 50 }} />
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        <TextInput
          style={styles.input}
          placeholder="New Username"
          value={newUsername}
          onChangeText={setNewUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="New Email"
          value={newEmail}
          onChangeText={setNewEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity style={styles.updateButton} onPress={updateProfileData}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  menuIcon: {
    padding: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginHeader: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    color: Colors.primary,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
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
    color: "white",
    fontSize: 15,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
});
