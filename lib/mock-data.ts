import type {
  Application,
  DashboardMetric,
  JobPost,
  WorkerProfile
} from "@/types";

export const mockWorkers: WorkerProfile[] = [
  {
    id: "worker-1",
    userId: "user-1",
    firstName: "María",
    lastName: "Gómez",
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    phone: "+54 9 11 2456 7788",
    email: "maria.gomez@example.com",
    age: 42,
    city: "Ciudad de Mendoza - Quinta Seccion",
    serviceTypes: ["Cuidadoras de adultos mayores", "Acompañantes terapéuticos"],
    experienceYears: 12,
    availability: "Lunes a viernes, mañana y tarde",
    workMode: ["Jornada completa", "Fines de semana"],
    description:
      "Cuidadora con experiencia en acompañamiento de adultos mayores, administración de rutinas y trato cercano con familias.",
    references: [
      {
        id: "ref-1",
        referenceName: "Laura Benítez",
        referencePhone: "+54 9 11 6677 8899",
        relationship: "Familia empleadora",
        comment: "Muy responsable, cálida y puntual."
      }
    ],
    expectedSalary: "$3.800 por hora",
    verificationStatus: "verified",
    rating: 4.9,
    reviewsCount: 18
  },
  {
    id: "worker-2",
    userId: "user-2",
    firstName: "Silvina",
    lastName: "Roldán",
    photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    phone: "+54 9 11 3988 1200",
    email: "silvina.roldan@example.com",
    age: 35,
    city: "Godoy Cruz - Bombal",
    serviceTypes: ["Empleadas domésticas", "Limpieza por hora"],
    experienceYears: 8,
    availability: "Martes, jueves y sabados",
    workMode: ["Por hora"],
    description:
      "Especialista en limpieza general, organización del hogar y mantenimiento semanal.",
    references: [
      {
        id: "ref-2",
        referenceName: "Marta Núñez",
        referencePhone: "+54 9 11 5533 1122",
        relationship: "Casa particular",
        comment: "Excelente nivel de detalle y muy buen trato."
      }
    ],
    expectedSalary: "$3.200 por hora",
    verificationStatus: "verified",
    rating: 4.8,
    reviewsCount: 11
  },
  {
    id: "worker-3",
    userId: "user-3",
    firstName: "Daniela",
    lastName: "Pérez",
    photoUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    phone: "+54 9 11 7210 5512",
    email: "daniela.perez@example.com",
    age: 29,
    city: "Guaymallen - Dorrego",
    serviceTypes: ["Niñeras"],
    experienceYears: 6,
    availability: "Tardes y noches",
    workMode: ["Por hora", "Fines de semana"],
    description:
      "Niñera con experiencia en primera infancia, apoyo escolar y rutinas de sueño.",
    references: [
      {
        id: "ref-3",
        referenceName: "Sofía Arias",
        referencePhone: "+54 9 11 6188 4433",
        relationship: "Familia empleadora",
        comment: "Los chicos la quieren mucho y siempre llega a horario."
      }
    ],
    expectedSalary: "$3.500 por hora",
    verificationStatus: "pending",
    rating: 4.7,
    reviewsCount: 7
  },
  {
    id: "worker-4",
    userId: "user-4",
    firstName: "Rosa",
    lastName: "Fernández",
    photoUrl: "https://randomuser.me/api/portraits/women/52.jpg",
    phone: "+54 9 11 5022 9811",
    email: "rosa.fernandez@example.com",
    age: 50,
    city: "Lujan de Cuyo - Chacras de Coria",
    serviceTypes: ["Cuidado de personas con dependencia", "Cuidadoras de adultos mayores"],
    experienceYears: 15,
    availability: "Disponibilidad nocturna",
    workMode: ["Cama adentro", "Jornada completa"],
    description:
      "Acompañamiento responsable para personas con movilidad reducida y apoyo en higiene y alimentación.",
    references: [
      {
        id: "ref-4",
        referenceName: "Patricio Lima",
        referencePhone: "+54 9 11 3122 6600",
        relationship: "Familia empleadora",
        comment: "Tiene mucha paciencia y gran experiencia."
      }
    ],
    expectedSalary: "$980.000 mensual",
    verificationStatus: "verified",
    rating: 5,
    reviewsCount: 24
  },
  {
    id: "worker-5",
    userId: "user-5",
    firstName: "Claudia",
    lastName: "Mansilla",
    photoUrl: "https://randomuser.me/api/portraits/women/36.jpg",
    phone: "+54 9 11 4442 1189",
    email: "claudia.mansilla@example.com",
    age: 39,
    city: "Maipu - Luzuriaga",
    serviceTypes: ["Empleadas domésticas", "Niñeras"],
    experienceYears: 10,
    availability: "Lunes, miercoles y viernes",
    workMode: ["Jornada completa"],
    description:
      "Trabajo en casas de familia con tareas domésticas, cocina simple y cuidado ocasional de niños.",
    references: [
      {
        id: "ref-5",
        referenceName: "Ana Dell'Oro",
        referencePhone: "+54 9 221 555 8712",
        relationship: "Familia empleadora",
        comment: "Muy confiable y cuidadosa con la casa."
      }
    ],
    expectedSalary: "$760.000 mensual",
    verificationStatus: "incomplete",
    rating: 4.6,
    reviewsCount: 5
  },
  {
    id: "worker-6",
    userId: "user-6",
    firstName: "Noelia",
    lastName: "Acosta",
    photoUrl: "https://randomuser.me/api/portraits/women/23.jpg",
    phone: "+54 9 11 2901 7622",
    email: "noelia.acosta@example.com",
    age: 33,
    city: "San Rafael - Centro",
    serviceTypes: ["Limpieza por hora", "Acompañantes terapéuticos"],
    experienceYears: 7,
    availability: "Mañanas y fines de semana",
    workMode: ["Por hora", "Fines de semana"],
    description:
      "Perfil flexible para limpiezas por hora y acompañamiento liviano con excelente comunicación.",
    references: [
      {
        id: "ref-6",
        referenceName: "Carolina Ruiz",
        referencePhone: "+54 9 11 7432 1211",
        relationship: "Casa particular",
        comment: "Siempre clara, amable y prolija."
      }
    ],
    expectedSalary: "$3.400 por hora",
    verificationStatus: "verified",
    rating: 4.9,
    reviewsCount: 13
  }
];

export const mockJobs: JobPost[] = [
  {
    id: "job-1",
    employerId: "family-1",
    employerName: "Familia Suárez",
    serviceType: "Cuidadoras de adultos mayores",
    description:
      "Buscamos cuidadora para acompañar a una adulta mayor autoválida, con apoyo en comidas y medicación.",
    city: "Ciudad de Mendoza - Quinta Seccion",
    requiredDays: "Lunes, Martes, Miercoles, Jueves, Viernes",
    requiredHours: "Manana 8 a 12 h",
    startDate: "2026-10-20",
    requiresExperience: true,
    requiresReferences: true,
    estimatedBudget: "$850.000 mensual",
    observations: "Se valora experiencia previa con adultos mayores.",
    status: "active",
    modality: "Jornada completa",
    createdAt: "2026-10-09",
    applicantsCount: 8
  },
  {
    id: "job-2",
    employerId: "family-2",
    employerName: "Casa Martínez",
    serviceType: "Limpieza por hora",
    description:
      "Necesitamos ayuda de limpieza general dos veces por semana en departamento familiar.",
    city: "Godoy Cruz - Bombal",
    requiredDays: "Martes, Viernes",
    requiredHours: "Tarde 16 a 20 h",
    startDate: "2026-10-23",
    requiresExperience: true,
    requiresReferences: false,
    estimatedBudget: "$3.300 por hora",
    status: "active",
    modality: "Por hora",
    createdAt: "2026-10-08",
    applicantsCount: 12
  },
  {
    id: "job-3",
    employerId: "family-3",
    employerName: "Familia Ortega",
    serviceType: "Niñeras",
    description:
      "Cuidado de dos niños por la tarde, retiro del colegio y merienda en casa.",
    city: "Guaymallen - Dorrego",
    requiredDays: "Lunes, Martes, Miercoles, Jueves",
    requiredHours: "Tarde 16 a 20 h",
    startDate: "2026-10-26",
    requiresExperience: true,
    requiresReferences: true,
    estimatedBudget: "$3.700 por hora",
    status: "active",
    modality: "Por hora",
    createdAt: "2026-10-07",
    applicantsCount: 6
  },
  {
    id: "job-4",
    employerId: "family-4",
    employerName: "Familia Sosa",
    serviceType: "Empleadas domésticas",
    description:
      "Tareas generales del hogar, cocina simple y organizacion semanal para casa en Chacras de Coria.",
    city: "Lujan de Cuyo - Chacras de Coria",
    requiredDays: "Lunes, Miercoles, Viernes",
    requiredHours: "Manana 8 a 12 h",
    startDate: "2026-10-29",
    requiresExperience: true,
    requiresReferences: true,
    estimatedBudget: "$620.000 mensual",
    status: "paused",
    modality: "Jornada completa",
    createdAt: "2026-10-06",
    applicantsCount: 4
  },
  {
    id: "job-5",
    employerId: "family-5",
    employerName: "Hogar Núñez",
    serviceType: "Cuidado de personas con dependencia",
    description:
      "Acompañamiento nocturno para persona con movilidad reducida. Se requiere experiencia comprobable.",
    city: "Maipu - Coquimbito",
    requiredDays: "Sabado, Domingo",
    requiredHours: "Noche 20 a 8 h",
    startDate: "2026-11-02",
    requiresExperience: true,
    requiresReferences: true,
    estimatedBudget: "$45.000 por noche",
    status: "active",
    modality: "Fines de semana",
    createdAt: "2026-10-05",
    applicantsCount: 3
  },
  {
    id: "job-6",
    employerId: "family-6",
    employerName: "Familia Prieto",
    serviceType: "Acompañantes terapéuticos",
    description:
      "Acompañante para actividades semanales, traslados cercanos y soporte en rutinas.",
    city: "San Rafael - Centro",
    requiredDays: "Lunes, Miercoles, Viernes",
    requiredHours: "Mediodia 12 a 16 h",
    startDate: "2026-11-04",
    requiresExperience: false,
    requiresReferences: true,
    estimatedBudget: "$4.000 por hora",
    status: "active",
    modality: "Por hora",
    createdAt: "2026-10-04",
    applicantsCount: 5
  }
];

export const mockApplications: Application[] = [
  {
    id: "app-1",
    jobPostId: "job-1",
    workerId: "worker-1",
    status: "seen",
    message: "Tengo experiencia en cuidado de adultos mayores y disponibilidad inmediata.",
    createdAt: "2026-05-27",
    jobTitle: "Cuidadora para adulta mayor",
    city: "Ciudad de Mendoza - Quinta Seccion"
  },
  {
    id: "app-2",
    jobPostId: "job-3",
    workerId: "worker-3",
    status: "sent",
    message: "Puedo cubrir tardes y tengo referencias con niños de edad escolar.",
    createdAt: "2026-05-26",
    jobTitle: "Niñera por la tarde",
    city: "Guaymallen - Dorrego"
  },
  {
    id: "app-3",
    jobPostId: "job-5",
    workerId: "worker-4",
    status: "accepted",
    message: "Cuento con experiencia en movilidad reducida y turnos nocturnos.",
    createdAt: "2026-05-25",
    jobTitle: "Acompañamiento nocturno",
    city: "Maipu - Coquimbito"
  }
];

export const familyDashboardMetrics: DashboardMetric[] = [
  { label: "Búsquedas activas", value: "3", helper: "2 con nuevas postulantes" },
  { label: "Postulantes recibidas", value: "24", helper: "8 verificadas" },
  { label: "Contactos iniciados", value: "9", helper: "Últimos 7 días" }
];

export const workerDashboardMetrics: DashboardMetric[] = [
  { label: "Perfil", value: "82%", helper: "Pendiente certificado" },
  { label: "Postulaciones", value: "3", helper: "1 aceptada" },
  { label: "Oportunidades cerca", value: "11", helper: "Gran Mendoza y alrededores" }
];

export const adminMetrics: DashboardMetric[] = [
  { label: "Familias registradas", value: "128", helper: "+14 este mes" },
  { label: "Trabajadoras registradas", value: "312", helper: "43 verificadas" },
  { label: "Búsquedas activas", value: "76", helper: "18 publicadas esta semana" },
  { label: "Postulaciones", value: "486", helper: "92 vistas" },
  { label: "Pendientes de verificación", value: "21", helper: "Requieren revisión" }
];
