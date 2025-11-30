const mqtt = require("mqtt");

const backend = mqtt.connect(
  "mqtts://bca4339cf0314993aab9fd498bb84ec1.s1.eu.hivemq.cloud:8883", /** direccion dada por el broker para conectarse por MQTT seguro */
  {
    username: "USER_OCTAVIO",
    password: "octavioPASSWORD1",
    rejectUnauthorized: false,
  }
);


backend.on("connect", () => {
  console.log("✅ Backend conectado al broker HiveMQ Cloud");
  backend.subscribe("buses/+/posicion"); // escucha todos los buses
});

backend.on("message", (topic, message) => {
  const datos = JSON.parse(message.toString());
  console.log(`📥 Mensaje recibido en ${topic}:`, datos);

  // Aquí puedes guardar en DB o reenviar por WebSocket a pasajeros
});
