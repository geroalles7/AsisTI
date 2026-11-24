
const API_URL = "http://localhost:8000/api";

export async function sendMessage(message) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener una respuesta del servidor.");
  }

  return await response.json();
}

export async function submitContact(contactData) {
  const response = await fetch(`${API_URL}/contactos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(contactData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "No se pudo registrar el inconveniente."
    );
  }

  return data;
}
