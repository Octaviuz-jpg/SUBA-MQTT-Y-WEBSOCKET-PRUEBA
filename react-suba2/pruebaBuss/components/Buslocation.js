import React, { useEffect } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";
import mqtt from "mqtt";

export default function BusLocation() {
  useEffect(() => {
    const connectMQTT = async () => {
      // Conexión al broker HiveMQ vía WebSocket seguro
      const client = mqtt.connect(
        "wss://bca4339cf0314993aab9fd498bb84ec1.s1.eu.hivemq.cloud:8884/mqtt" /** direccion dada por el broker para conectarse por WebSocket seguro */,
        {
          username: "USER_OCTAVIO", // tu usuario HiveMQ
          password: "octavioPASSWORD1", // tu contraseña HiveMQ
        }
      );

      client.on("connect", () => {
        console.log("✅ Conectado al broker MQTT desde Expo");
      });

      // Pedir permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Permiso de ubicación denegado");
        return;
      }

      // Escuchar cambios de posición
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000 /** variable que publica la distancia por tanto tiempo en milisegundos para actualizar */,
          distanceInterval: 1 /** variable que publica la distancia por tanta distancia en metros para actualizar */,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const mensaje = {
            busId: "123",
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toISOString(),
          };

          // Publicar al broker
          client.publish("buses/123/posicion", JSON.stringify(mensaje));
          console.log("📡 Posición enviada:", mensaje);
        }
      );
    };

    connectMQTT();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>App de Buses con Expo 🚍</Text>
    </View>
  );
}
