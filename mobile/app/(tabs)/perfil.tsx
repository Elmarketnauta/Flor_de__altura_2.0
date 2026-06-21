import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/auth-store";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/signin");
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <Text className="text-sand mb-4">No estás autenticado</Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/signin")}
          className="bg-gold px-6 py-2 rounded-lg"
        >
          <Text className="text-espresso font-semibold">Iniciar Sesión</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream px-4 pt-4">
      <Text className="font-playfair text-2xl font-semibold text-espresso">Mi Perfil</Text>

      <View className="mt-6 bg-white p-4 rounded-2xl border border-sand">
        <Text className="text-sand text-xs font-semibold">EMAIL</Text>
        <Text className="text-espresso font-semibold mt-1">{user.email}</Text>

        <Text className="text-sand text-xs font-semibold mt-4">NOMBRE</Text>
        <Text className="text-espresso font-semibold mt-1">{user.fullName || "No especificado"}</Text>

        <Text className="text-sand text-xs font-semibold mt-4">PAÍS</Text>
        <Text className="text-espresso font-semibold mt-1">{user.country || "No especificado"}</Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="mt-6 bg-red-100 py-3 rounded-lg"
      >
        <Text className="text-red-800 font-semibold text-center">Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
