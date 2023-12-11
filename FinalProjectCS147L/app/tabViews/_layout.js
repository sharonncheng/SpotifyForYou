import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "green",
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="songs"
        options={{
          tabBarLabel: "For You",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="albums"
        options={{
          tabBarLabel: "AI Song Genie",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="color-wand" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
