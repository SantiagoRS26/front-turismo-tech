export function detectCategoriesFromUserInterest(message: string): string[] {
    const lower = message.toLowerCase();
    const categories: string[] = [];

    const restauranteKeywords = [
        "gastronomía",
		"gastronomia",
        "comida",
        "restaurante",
        "menú",
        "cocina",
        "plato",
        "cena",
        "almuerzo",
        "desayuno",
        "chef",
        "bebida",
        "postre",
        "bar",
        "buffet",
        "parrilla",
        "mariscos",
        "vegetariano",
        "vegano",
        "sushi",
        "pizzeria",
        "catering",
        "brunch",
        "bistró",
        "vino",
        "tragos",
    ];
    if (restauranteKeywords.some((keyword) => lower.includes(keyword))) {
        categories.push("Restaurante");
    }

    const hotelKeywords = [
        "hotel",
        "alojamiento",
        "hospedaje",
        "habitación",
        "reserva",
        "check-in",
        "check-out",
        "suite",
        "servicios",
        "recepción",
        "habitaciones dobles",
        "habitaciones sencillas",
        "hostería",
        "apartamento",
        "villa",
        "resort",
        "bed and breakfast",
        "spa",
        "piscina",
        "wifi",
        "tour",
        "gym",
        "ubicación céntrica",
        "balcón",
        "limpieza diaria",
        "seguridad",
        "pet-friendly",
        "servicio de habitaciones",
        "bar del hotel",
        "salón de eventos",
        "conference room",
        "suite presidencial",
        "habitaciones familiares",
    ];
    if (hotelKeywords.some((keyword) => lower.includes(keyword))) {
        categories.push("Hotel");
    }

    return categories;
}
