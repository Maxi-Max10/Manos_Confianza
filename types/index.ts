export type UserRole = "family" | "worker" | "admin";
export type PublicUserRole = Exclude<UserRole, "admin">;

export type VerificationStatus =
  | "incomplete"
  | "pending"
  | "verified"
  | "rejected";

export type JobStatus = "active" | "paused" | "closed";

export type ApplicationStatus = "sent" | "seen" | "accepted" | "rejected";

export type ServiceType =
  | "Empleadas domésticas"
  | "Cuidadoras de adultos mayores"
  | "Niñeras"
  | "Acompañantes terapéuticos"
  | "Limpieza por hora"
  | "Cuidado de personas con dependencia";

export type WorkMode =
  | "Por hora"
  | "Jornada completa"
  | "Cama adentro"
  | "Fines de semana";

export type WorkerReference = {
  id: string;
  referenceName: string;
  referencePhone: string;
  relationship: string;
  comment: string;
};

export type WorkerProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  phone: string;
  email: string;
  age: number;
  city: string;
  serviceTypes: ServiceType[];
  experienceYears: number;
  availability: string;
  workMode: WorkMode[];
  description: string;
  references: WorkerReference[];
  expectedSalary: string;
  verificationStatus: VerificationStatus;
  rating: number;
  reviewsCount: number;
};

export type JobPost = {
  id: string;
  employerId: string;
  employerName: string;
  serviceType: ServiceType;
  description: string;
  city: string;
  requiredDays: string;
  requiredHours: string;
  startDate: string;
  requiresExperience: boolean;
  requiresReferences: boolean;
  estimatedBudget: string;
  observations?: string;
  status: JobStatus;
  modality: WorkMode;
  createdAt: string;
  applicantsCount: number;
};

export type Application = {
  id: string;
  jobPostId: string;
  workerId: string;
  status: ApplicationStatus;
  message: string;
  createdAt: string;
  jobTitle: string;
  city: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
};
