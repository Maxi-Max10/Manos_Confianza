import type { WorkerProfile } from "@/types";

export const exampleWorker: WorkerProfile = {
  id: "ejemplo",
  userId: "",
  firstName: "Ana",
  lastName: "Ejemplo",
  photoUrl: "/images/hero-care.webp",
  phone: "",
  email: "",
  age: 0,
  city: "Mendoza",
  serviceTypes: ["Empleadas domésticas", "Limpieza por hora"],
  experienceYears: 5,
  availability: "Lunes a viernes por la mañana",
  workMode: ["Por hora"],
  description:
    "Este es un perfil de muestra para conocer cómo se presenta la experiencia, la disponibilidad y los servicios de una trabajadora.",
  references: [],
  expectedSalary: "A convenir",
  verificationStatus: "incomplete",
  rating: 0,
  reviewsCount: 0
};
