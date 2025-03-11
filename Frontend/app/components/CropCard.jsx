import React from 'react'
import { Image, Text, View } from 'react-native'

export default function CropCard({image,name}) {
  return (
     <View className="items-center p-3 bg-white rounded-lg shadow-md">
    <Image source={{ uri: image }} className="w-20 h-20 rounded-lg" />
    <Text className="mt-2 font-semibold">{name}</Text>
  </View>
  )
}
