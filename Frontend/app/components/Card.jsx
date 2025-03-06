const { Image, View, Text, Pressable } = require("react-native");

export default function Card({
  title,
  subTitle,
  price,
  imageUrl,
  onPress,
  thumbnailUrl,
}) {
  return (
    <Pressable onPress={onPress}>
      <View className="rounded-md mt-2  bg-slate-50 mb-5  shadow-md">
        <Image
          className="w-full h-64"
          tint="light"
          source={{ uri: imageUrl }}
        />
        <View className="p-5 ">
          <Text
            className="mb-2  font-bold text-violet-800 text-xl"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text>{price}</Text>
          <Text className="font-bold text-violet-700" numberOfLines={2}>
            {subTitle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
