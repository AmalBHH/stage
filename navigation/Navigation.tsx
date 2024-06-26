import React, { useState, useEffect } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { InitialScreenOnStart } from "./InitialScreenOnStart";
import AuthStack from "./AuthStack";

import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import CalendarPage from "../screens/CalendarPage";
import CalendarPageEmp from "../screens/CalendarPageEmp";
import siteweb from "../screens/siteweb";
import sitewebEmp from "../screens/sitewebEmp";
import evenement from "../screens/evenement";
import evenementEmp from "../screens/evenementEmp";
import congeEmp from "../screens/congeEmp";
import congead from "../screens/congead";
import postconge from "../screens/postconge";
import createevent from "../screens/createevent";
import importevent from "../screens/importevent";
import eventcalandar from "../screens/eventcalander";
import eventlist from "../screens/eventlist";
import pivoteevent from "../screens/pivoteevent";
import emp from "../screens/emp";
import creeemp from "../screens/creeemp";
import importemp from "../screens/importemp";
import listemp from "../screens/listemp";
import empact from "../screens/empact";
import presence from "../screens/presence";
import newpres from "../screens/newpres";
import importpres from "../screens/importpres";
import preskaban from "../screens/preskaban";
import config from "../screens/config";
import configkaban from "../screens/configkaban";
import calendarlist from "../screens/calendarlist";
import calendarlistEmp from "../screens/calendarlistEmp";
import createrdv from "../screens/createrdv";
import EditRdv from "../screens/EditRdv";
import EditEvent from "../screens/EditEvent";
import addactivity from "../screens/addactivity";
import Editactivity from "../screens/Editactivity";
import postallocation from "../screens/postallocation";
import consconj from "../screens/consconj";
import allocEmp from "../screens/allocEmp";
import allocad from "../screens/allocad";
import mail from "../screens/mail";
import addemail from "../screens/addemail";
import DashboardEmp from "../screens/DashboardEmp";
import vidconf from "../screens/vidconf";
import actEmp from "../screens/actEmp";
import vidconfEmp from "../screens/vidconfEmp";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InitialScreenOnStart">
        {user ? (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="InitialScreenOnStart"
            component={InitialScreenOnStart}
            options={{ headerShown: false }}
          />
        )}
    <Stack.Screen
        name='CalendarPage'
        component={CalendarPage} 
        options={{
          headerShown: false, 
        }}
      />
          <Stack.Screen
        name='CalendarPageEmp'
        component={CalendarPageEmp} 
        options={{
          headerShown: false, 
        }}
      />
          <Stack.Screen
        name='siteweb'
        component={siteweb} 
        options={{
          headerShown: false, 
        }}
      />
                <Stack.Screen
        name='sitewebEmp'
        component={sitewebEmp} 
        options={{
          headerShown: false, 
        }}
      />
        <Stack.Screen
        name='evenement'
        component={evenement} 
        options={{
          headerShown: false, 
        }}
      /> 
           <Stack.Screen
        name='evenementEmp'
        component={evenementEmp} 
        options={{
          headerShown: false, 
        }}
      />
            <Stack.Screen
        name='congeEmp'
        component={congeEmp} 
        options={{
          headerShown: false, 
        }}
      />
                  <Stack.Screen
        name='postconge'
        component={postconge} 
        options={{
          headerShown: false, 
        }}
      />
      <Stack.Screen
        name='createevent'
        component={createevent} 
        options={{
          headerShown: false, 
        }}
      />
         <Stack.Screen
        name='importevent'
        component={importevent} 
        options={{
          headerShown: false, 
        }}
      />
          <Stack.Screen
        name='eventcalandar'
        component={eventcalandar} 
        options={{
          headerShown: false, 
        }}
      />
          <Stack.Screen
        name='eventlist'
        component={eventlist} 
        options={{
          headerShown: false, 
        }}
      />
             <Stack.Screen
        name='pivoteevent'
        component={pivoteevent} 
        options={{
          headerShown: false, 
        }}
      />
                 <Stack.Screen
        name='emp'
        component={emp} 
        options={{
          headerShown: false, 
        }}
      />
                    <Stack.Screen
        name='creeemp'
        component={creeemp} 
        options={{
          headerShown: false, 
        }}
      />
      
      <Stack.Screen
        name='importemp'
        component={importemp} 
        options={{
          headerShown: false, 
        }}
      />
         <Stack.Screen
        name='listemp'
        component={listemp} 
        options={{
          headerShown: false, 
        }}
      />
           <Stack.Screen
        name='empact'
        component={empact} 
        options={{
          headerShown: false, 
        }}
      />
            <Stack.Screen
        name='presence'
        component={presence} 
        options={{
          headerShown: false, 
        }}
      />
             <Stack.Screen
        name='newpres'
        component={newpres} 
        options={{
          headerShown: false, 
        }}
      />
          <Stack.Screen
      name='importpres'
      component={importpres} 
      options={{
        headerShown: false, 
      }}
    />
            <Stack.Screen
      name='preskaban'
      component={preskaban} 
      options={{
        headerShown: false, 
      }}
    />
              <Stack.Screen
      name='config'
      component={config} 
      options={{
        headerShown: false, 
      }}
    />
              <Stack.Screen
      name='configkaban'
      component={configkaban} 
      options={{
        headerShown: false, 
      }}
    />
      <Stack.Screen
      name='calendarlist'
      component={calendarlist} 
      options={{
        headerShown: false, 
      }}
    />
          <Stack.Screen
      name='calendarlistEmp'
      component={calendarlistEmp} 
      options={{
        headerShown: false, 
      }}
    />
        <Stack.Screen
      name='createrdv'
      component={createrdv} 
      options={{
        headerShown: false, 
      }}
    /> 
      <Stack.Screen
      name='EditRdv'
      component={EditRdv}
      options={{ headerShown: false }}
    />
      <Stack.Screen
      name='EditEvent'
      component={EditEvent}
      options={{ headerShown: false }}
    />
        <Stack.Screen
      name='addactivity'
      component={addactivity}
      options={{ headerShown: false }}
    />
            <Stack.Screen
      name='editactivity'
      component={Editactivity}
      options={{ headerShown: false }}
    />
          
     <Stack.Screen
      name='postallocation'
      component={postallocation}
      options={{ headerShown: false }}
    />
    
    <Stack.Screen
      name='consconj'
      component={consconj}
      options={{ headerShown: false }}
    />
        <Stack.Screen
      name='allocEmp'
      component={allocEmp}
      options={{ headerShown: false }}
    />
        <Stack.Screen
      name='mail'
      component={mail}
      options={{ headerShown: false }}
    />
       <Stack.Screen
      name='addemail'
      component={addemail}
      options={{ headerShown: false }}
    />
        <Stack.Screen
      name='DashboardEmp'
      component={DashboardEmp}
      options={{ headerShown: false }}
    />
          <Stack.Screen
        name='congead'
        component={congead} 
        options={{
          headerShown: false, 
        }}
      />
       <Stack.Screen
        name='vidconfEmp'
        component={vidconfEmp} 
        options={{
          headerShown: false, 
        }}
      />
<Stack.Screen
        name='allocad'
        component={allocad} 
        options={{
          headerShown: false, 
        }}
      />
      <Stack.Screen
        name='vidconf'
        component={vidconf} 
        options={{
          headerShown: false, 
        }}
      />
 <Stack.Screen
        name='actEmp'
        component={actEmp} 
        options={{
          headerShown: false, 
        }}
      />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}
