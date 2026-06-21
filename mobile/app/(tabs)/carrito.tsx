import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { useCartStore } from "../../store/cart-store";

export default function CartScreen() {
  const { items, totalAmount, removeItem } = useCartStore();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-4 pt-4">
        <Text className="font-playfair text-2xl font-semibold text-espresso">Carrito</Text>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sand">Tu carrito está vacío</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-white m-4 p-4 rounded-2xl border border-sand">
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-espresso">{item.name}</Text>
                    <Text className="text-sand text-xs">{item.quantity}x S/ {item.price.toFixed(2)}</Text>
                  </View>
                  <Text className="font-semibold text-gold">S/ {(item.quantity * item.price).toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  className="mt-2 bg-red-100 py-1 rounded"
                >
                  <Text className="text-red-800 text-xs text-center">Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ padding: 8 }}
          />

          <View className="bg-white border-t border-sand p-4">
            <View className="flex-row justify-between mb-4">
              <Text className="text-espresso font-semibold">Total:</Text>
              <Text className="text-gold font-bold text-lg">S/ {totalAmount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity className="bg-gold py-3 rounded-lg">
              <Text className="text-center text-espresso font-semibold">Proceder al Pago</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
