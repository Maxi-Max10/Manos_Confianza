import { getSupabaseServerClient } from "@/lib/supabase-server";
import { exampleWorker } from "@/lib/example-worker";
import { isDemoMode } from "@/lib/demo";
import { mockJobs, mockWorkers } from "@/lib/mock-data";
import type { JobPost, JobStatus, ServiceType, UserRole, VerificationStatus, WorkMode, WorkerProfile } from "@/types";

type Row = Record<string, unknown>;

const fallbackPhoto = "/images/hero-care.webp";

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function mapPublicWorker(row: Row): WorkerProfile {
  return {
    id: asString(row.id),
    userId: "",
    firstName: asString(row.first_name, "Trabajadora"),
    lastName: asString(row.last_name),
    photoUrl: asString(row.profile_photo_url, fallbackPhoto),
    phone: asString(row.phone),
    email: asString(row.email),
    age: Number(row.age ?? 0),
    city: asString(row.city, "Mendoza"),
    serviceTypes: [asString(row.service_type) as ServiceType],
    experienceYears: Number(row.experience_years ?? 0),
    availability: asString(row.availability),
    workMode: asStringArray(row.work_mode) as WorkMode[],
    description: asString(row.description),
    references: [],
    expectedSalary: asString(row.expected_salary, "A convenir"),
    verificationStatus: asString(row.verification_status, "verified") as VerificationStatus,
    rating: Number(row.rating ?? 0),
    reviewsCount: Number(row.reviews_count ?? row.references_count ?? 0)
  };
}

export function mapPublicJob(row: Row): JobPost {
  return {
    id: asString(row.id),
    employerId: asString(row.employer_id),
    employerName: "Familia de Mendoza",
    serviceType: asString(row.service_type) as ServiceType,
    description: asString(row.description),
    city: asString(row.city),
    requiredDays: asString(row.required_days),
    requiredHours: asString(row.required_hours),
    startDate: asString(row.start_date),
    requiresExperience: Boolean(row.requires_experience),
    requiresReferences: Boolean(row.requires_references),
    estimatedBudget: asString(row.estimated_budget, "A convenir"),
    observations: asString(row.observations),
    status: asString(row.status, "active") as JobStatus,
    modality: asString(row.modality, "Por hora") as WorkMode,
    createdAt: asString(row.created_at),
    applicantsCount: Number(row.applicants_count ?? 0)
  };
}

export async function getPublicWorkers(service?: string) {
  if (isDemoMode) return mockWorkers.filter((worker) => !service || worker.serviceTypes.includes(service as ServiceType));
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  let query = supabase.from("public_worker_profiles").select("*").order("created_at", { ascending: false });
  if (service) query = query.eq("service_type", service);
  const { data, error } = await query;
  if (error) return [];
  return (data as Row[]).map(mapPublicWorker);
}

export async function getPublicWorker(id: string) {
  if (id === exampleWorker.id) return exampleWorker;
  if (isDemoMode) return mockWorkers.find((worker) => worker.id === id) ?? null;
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("public_worker_profiles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;

  const worker = mapPublicWorker(data as Row);
  const { data: contact } = await supabase.rpc("get_worker_contact", { target_worker_id: id }).maybeSingle();
  if (contact) {
    worker.phone = asString((contact as Row).phone);
    worker.email = asString((contact as Row).email);
  }
  return worker;
}

export async function getPublicJobs() {
  if (isDemoMode) return mockJobs.filter((job) => job.status === "active");
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("public_job_posts").select("*").order("created_at", { ascending: false });
  if (error) return [];
  return (data as Row[]).map(mapPublicJob);
}

export async function getPublicJob(id: string) {
  if (isDemoMode) return mockJobs.find((job) => job.id === id) ?? null;
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("public_job_posts").select("*").eq("id", id).maybeSingle();
  return error || !data ? null : mapPublicJob(data as Row);
}

export async function getCurrentAccount() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("users_profiles")
    .select("id, auth_user_id, role, first_name, last_name, phone, email, city")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  return profile ? { ...profile, role: profile.role as UserRole } : null;
}
