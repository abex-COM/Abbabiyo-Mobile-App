import { Text, View } from "react-native";
import "../global.css";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="bg-green-600 p-2 text-green-50 rounded-md">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
