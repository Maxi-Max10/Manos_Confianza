import {
  Baby,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  HandHeart,
  HeartHandshake,
  Home,
  LucideIcon,
  MapPin,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
  UsersRound
} from "lucide-react";
import type { ServiceType, WorkMode } from "@/types";

export const serviceTypes: ServiceType[] = [
  "Empleadas domésticas",
  "Cuidadoras de adultos mayores",
  "Niñeras",
  "Acompañantes terapéuticos",
  "Limpieza por hora",
  "Cuidado de personas con dependencia"
];

export const workModes: WorkMode[] = [
  "Por hora",
  "Jornada completa",
  "Cama adentro",
  "Fines de semana"
];

export const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Perfiles", href: "/perfiles" },
  { label: "Búsquedas", href: "/busquedas" },
  { label: "Demo", href: "/demo" }
];

export const services: Array<{
  title: ServiceType;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Empleadas domésticas",
    description: "Ayuda confiable para limpieza, orden, cocina y tareas diarias del hogar.",
    icon: Home
  },
  {
    title: "Cuidadoras de adultos mayores",
    description: "Acompañamiento cercano para rutinas, cuidados diarios y contención familiar.",
    icon: HandHeart
  },
  {
    title: "Niñeras",
    description: "Personas con experiencia para cuidar, acompañar y asistir a niñas y niños.",
    icon: Baby
  },
  {
    title: "Acompañantes terapéuticos",
    description: "Perfiles preparados para acompañar procesos de salud y bienestar.",
    icon: Stethoscope
  },
  {
    title: "Limpieza por hora",
    description: "Soluciones flexibles para tareas puntuales, limpiezas profundas o mantenimiento.",
    icon: Sparkles
  },
  {
    title: "Cuidado de personas con dependencia",
    description: "Apoyo responsable para personas que requieren asistencia especial.",
    icon: UsersRound
  }
];

export const familySteps = [
  {
    title: "Publicá tu necesidad",
    description: "Contanos qué servicio necesitás, horarios, zona y requisitos clave.",
    icon: ClipboardList
  },
  {
    title: "Recibí postulantes de confianza",
    description: "Revisá perfiles organizados, referencias y disponibilidad.",
    icon: SearchCheck
  },
  {
    title: "Elegí y contactá a la persona ideal",
    description: "Compará opciones y avanzá por WhatsApp con quien mejor encaje.",
    icon: HeartHandshake
  }
];

export const workerSteps = [
  {
    title: "Creá tu perfil",
    description: "Cargá tus datos, experiencia, servicios y zona de trabajo.",
    icon: UserCheck
  },
  {
    title: "Mostrá tu experiencia y disponibilidad",
    description: "Sumá referencias, certificados y modalidades que podés cubrir.",
    icon: BadgeCheck
  },
  {
    title: "Recibí oportunidades cerca tuyo",
    description: "Postulate a búsquedas activas y conectá con familias de tu zona.",
    icon: MapPin
  }
];

export const familyBenefits = [
  { title: "Perfiles organizados", icon: UsersRound },
  { title: "Referencias visibles", icon: BadgeCheck },
  { title: "Disponibilidad por zona", icon: MapPin },
  { title: "Contacto rápido", icon: MessageCircle },
  { title: "Mayor seguridad al elegir", icon: ShieldCheck }
];

export const workerBenefits = [
  { title: "Perfil laboral digital", icon: BriefcaseBusiness },
  { title: "Más oportunidades", icon: CalendarCheck },
  { title: "Visibilidad profesional", icon: BadgeCheck },
  { title: "Postulación simple", icon: SearchCheck },
  { title: "Experiencia y referencias visibles", icon: ShieldCheck }
];
