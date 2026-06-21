import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  tagline: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/recommendations`, {
        strategy: "trending",
        limit: 10,
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity className="p-4 bg-white mb-4 rounded-2xl border border-sand">
      <Image
        source={{ uri: item.image }}
        className="w-full h-40 rounded-lg mb-3 bg-cream"
        resizeMode="cover"
      />
      <Text className="font-playfair text-lg font-semibold text-espresso">{item.name}</Text>
      <Text className="text-sand text-xs mt-1">{item.tagline}</Text>
      <Text className="text-gold font-semibold text-lg mt-2">S/ {item.price.toFixed(2)}</Text>
      <TouchableOpacity className="mt-3 bg-gold py-2 rounded-lg">
        <Text className="text-center text-espresso font-semibold">Agregar al carrito</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="px-4 pt-4">
        <Text className="font-playfair text-2xl font-semibold text-espresso">Catálogo</Text>
      </View>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sand">Cargando...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          scrollEnabled
        />
      )}
    </SafeAreaView>
  );
}
