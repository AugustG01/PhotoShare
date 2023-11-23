import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

//import Home from "../screens/Home";
//import Shared from "../screens/Shared";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8E8E8E",
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{
        tabBarIcon: ({ focused }) => (
          <IonIcons name="home" size={26} color={focused ? "#FFFFFF" : "#8E8E8E"} style={styles.tabIcons} />
        ),
        tabBarLabel: "Home",
        tabBarLabelStyle: styles.tabLabel,
      }} />
      <Tab.Screen name="Shared" component={Shared} options={{
        tabBarIcon: ({ focused }) => (
          <IonIcons name="trophy" size={26} color={focused ? "#FFFFFF" : "#8E8E8E"} style={styles.tabIcons} />
        ),
        tabBarLabel: "Shared",
        tabBarLabelStyle: styles.tabLabel,
      }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: "#555b66",
    borderRadius: 15,
    height: 70,
  },
  tabIcons: {
    alignItems: "center",
    justifyContent: "center",
    top: 10,
  },
  tabLabel: {
    fontSize: 12,
    top: 10,
  },
});

export default Tabs;