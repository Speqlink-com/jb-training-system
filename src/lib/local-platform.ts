import { Role } from "@/config/permissions";
import type { User } from "@/types";

const KEYS = {
  session: "jubilee.session.v1",
  trainers: "jubilee.trainers.v1",
  trainings: "jubilee.trainings.v1",
  attendance: "jubilee.attendance.v1",
} as const;

export const PLATFORM_CHANGE_EVENT = "jubilee:platform-change";

export interface DemoAccount {
  email: string;
  password: string;
  user: User;
}

export interface LocalTrainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  specializations: string[];
  status: "ACTIVE" | "INACTIVE";
  joinedAt: string;
}

export interface LocalTraining {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  scheduledAt: string;
  durationHours: number;
  location: string;
  audienceRoles: Role[];
  capacity: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
}

export interface AttendanceRecord {
  id: string;
  trainingId: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  role: Role;
  checkedInAt: string;
  source: "QR";
}

const now = new Date().toISOString();

export const DEMO_ACCOUNTS: DemoAccount[] = [
  ["admin@trainsyt.com", "Admin123!@#", "admin-1", "Super", "Admin", Role.ADMIN],
  ["hoa@trainsyt.com", "HOA123!@#", "hoa-1", "John", "Doe", Role.HOA],
  ["manager@trainsyt.com", "Manager123!@#", "manager-1", "Sarah", "Wilson", Role.SALES_MANAGER],
  ["trainer@trainsyt.com", "Trainer123!@#", "trainer-1", "Michael", "Brown", Role.TRAINER],
  ["agent@trainsyt.com", "Agent123!@#", "agent-1", "Emma", "Johnson", Role.AGENT],
].map(([email, password, id, firstName, lastName, role]) => ({
  email: email as string,
  password: password as string,
  user: {
    id: id as string,
    email: email as string,
    firstName: firstName as string,
    lastName: lastName as string,
    role: role as Role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
}));

const SEED_TRAINERS: LocalTrainer[] = [
  {
    id: "trainer-1",
    firstName: "Michael",
    lastName: "Brown",
    email: "trainer@trainsyt.com",
    phone: "+254 700 100 200",
    employeeId: "TRN-001",
    specializations: ["Compliance", "Product knowledge"],
    status: "ACTIVE",
    joinedAt: "2024-04-08T08:00:00.000Z",
  },
  {
    id: "trainer-2",
    firstName: "Amina",
    lastName: "Wanjiku",
    email: "amina.wanjiku@jubilee.co.ke",
    phone: "+254 711 340 120",
    employeeId: "TRN-014",
    specializations: ["Agency induction", "Customer experience"],
    status: "ACTIVE",
    joinedAt: "2025-02-17T08:00:00.000Z",
  },
  {
    id: "trainer-3",
    firstName: "Daniel",
    lastName: "Otieno",
    email: "daniel.otieno@jubilee.co.ke",
    phone: "+254 722 900 311",
    employeeId: "TRN-021",
    specializations: ["Digital sales", "Leadership"],
    status: "INACTIVE",
    joinedAt: "2025-08-04T08:00:00.000Z",
  },
];

const SEED_TRAININGS: LocalTraining[] = [
  {
    id: "tr-aml-101",
    title: "AML & Compliance Essentials",
    description: "Required annual compliance, customer due diligence, and escalation training.",
    trainerId: "trainer-1",
    scheduledAt: "2026-10-02T06:30:00.000Z",
    durationHours: 3,
    location: "Nairobi Learning Centre · Room 4",
    audienceRoles: [Role.AGENT, Role.SALES_MANAGER, Role.HOA],
    capacity: 120,
    status: "SCHEDULED",
  },
  {
    id: "tr-product-204",
    title: "Product Mix Masterclass",
    description: "Practical product positioning for protection, health, and investment conversations.",
    trainerId: "trainer-2",
    scheduledAt: "2026-10-08T11:00:00.000Z",
    durationHours: 4,
    location: "Westlands Branch · Auditorium",
    audienceRoles: [Role.AGENT, Role.SALES_MANAGER],
    capacity: 80,
    status: "SCHEDULED",
  },
  {
    id: "tr-lead-309",
    title: "Agency Leadership Lab",
    description: "Coaching routines, field performance reviews, and responsible leadership.",
    trainerId: "trainer-1",
    scheduledAt: "2026-09-29T07:00:00.000Z",
    durationHours: 2,
    location: "Jubilee Centre · Executive Room",
    audienceRoles: [Role.SALES_MANAGER, Role.HOA],
    capacity: 35,
    status: "IN_PROGRESS",
  },
];

function browserAvailable() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!browserAvailable()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!browserAvailable()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(PLATFORM_CHANGE_EVENT, { detail: { key } }));
}

export function initializeLocalPlatform() {
  if (!browserAvailable()) return;
  if (!window.localStorage.getItem(KEYS.trainers)) write(KEYS.trainers, SEED_TRAINERS);
  if (!window.localStorage.getItem(KEYS.trainings)) write(KEYS.trainings, SEED_TRAININGS);
  if (!window.localStorage.getItem(KEYS.attendance)) write(KEYS.attendance, []);
}

export function getStoredSession(): User | null {
  return read<User | null>(KEYS.session, null);
}

export function storeSession(user: User) {
  write(KEYS.session, user);
}

export function clearStoredSession() {
  if (!browserAvailable()) return;
  window.localStorage.removeItem(KEYS.session);
  window.dispatchEvent(new CustomEvent(PLATFORM_CHANGE_EVENT, { detail: { key: KEYS.session } }));
}

export function getTrainers(): LocalTrainer[] {
  initializeLocalPlatform();
  return read(KEYS.trainers, SEED_TRAINERS);
}

export function saveTrainers(trainers: LocalTrainer[]) {
  write(KEYS.trainers, trainers);
}

export function getTrainings(): LocalTraining[] {
  initializeLocalPlatform();
  return read(KEYS.trainings, SEED_TRAININGS);
}

export function saveTrainings(trainings: LocalTraining[]) {
  write(KEYS.trainings, trainings);
}

export function getAttendance(): AttendanceRecord[] {
  initializeLocalPlatform();
  return read<AttendanceRecord[]>(KEYS.attendance, []);
}

export function checkInToTraining(training: LocalTraining, user: User): AttendanceRecord {
  const attendance = getAttendance();
  const existing = attendance.find((item) => item.trainingId === training.id && item.userId === user.id);
  if (existing) return existing;
  const record: AttendanceRecord = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${user.id}`,
    trainingId: training.id,
    userId: user.id,
    attendeeName: `${user.firstName} ${user.lastName}`,
    attendeeEmail: user.email,
    role: user.role,
    checkedInAt: new Date().toISOString(),
    source: "QR",
  };
  write(KEYS.attendance, [...attendance, record]);
  return record;
}

export function attendanceForTraining(trainingId: string) {
  return getAttendance().filter((item) => item.trainingId === trainingId);
}

export function trainerName(trainerId: string, trainers = getTrainers()) {
  const trainer = trainers.find((item) => item.id === trainerId);
  return trainer ? `${trainer.firstName} ${trainer.lastName}` : "Unassigned";
}

export function canAttend(training: LocalTraining, user: User) {
  return training.audienceRoles.includes(user.role);
}

export function getCheckInPath(trainingId: string) {
  return `/attendance/check-in?training=${encodeURIComponent(trainingId)}`;
}
