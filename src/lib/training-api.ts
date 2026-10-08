import { apiClient } from "@/lib/api/client";

export type ParticipantRole =
  | "AGENT"
  | "SALES_MANAGER"
  | "HOA"
  | "TRAINER"
  | "ADMIN"
  | "STAFF"
  | "GUEST";

export type TrainingStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  AGENT: "Agent",
  SALES_MANAGER: "Sales manager",
  HOA: "Head of agency",
  TRAINER: "Trainer",
  ADMIN: "Administrator",
  STAFF: "Staff",
  GUEST: "Guest",
};

export interface TrainingProgram {
  id: string;
  publicCode: string;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  scheduledAt: string;
  durationHours: number;
  location: string;
  audienceRoles: ParticipantRole[];
  capacity: number;
  status: TrainingStatus;
  attendanceOpen: boolean;
  registrationCount: number;
  attendanceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTraining {
  publicCode: string;
  title: string;
  description: string;
  trainerName: string;
  scheduledAt: string;
  durationHours: number;
  location: string;
  audienceRoles: ParticipantRole[];
  capacity: number;
  status: TrainingStatus;
  attendanceOpen: boolean;
  registrationCount: number;
}

export interface TrainerOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TrainingMutationInput {
  title: string;
  description: string;
  trainerId?: string;
  scheduledAt: string;
  durationHours: number;
  location: string;
  audienceRoles: ParticipantRole[];
  capacity: number;
  status?: TrainingStatus;
  attendanceOpen?: boolean;
  expectedUpdatedAt?: string;
}

export interface TrainingRegistration {
  id: string;
  trainingId: string;
  participantName: string;
  participantCode: string;
  role: ParticipantRole;
  email?: string;
  phone?: string;
  joinedAt: string;
  attendanceMarked: boolean;
  checkedInAt?: string;
  registrationToken: string;
}

export interface AttendanceConfirmation {
  id: string;
  registrationId: string;
  participantName: string;
  participantCode: string;
  role: ParticipantRole;
  status: string;
  checkedInAt: string;
}

export interface AttendanceRow {
  registrationId: string;
  trainingId: string;
  trainingTitle: string;
  trainerName: string;
  scheduledAt: string;
  location: string;
  participantName: string;
  participantCode: string;
  role: ParticipantRole;
  email?: string;
  phone?: string;
  joinedAt: string;
  attendanceStatus: "PRESENT" | "JOINED_NOT_PRESENT";
  checkedInAt?: string;
}

interface BackendTraining {
  id: string;
  public_code: string;
  title: string;
  description: string;
  trainer_id: string;
  trainer_name: string;
  scheduled_at: string;
  duration_hours: number;
  location: string;
  audience_roles: string[];
  capacity: number;
  status: string;
  attendance_open: boolean;
  registration_count: number;
  attendance_count: number;
  created_at: string;
  updated_at: string;
}

type BackendPublicTraining = Omit<BackendTraining, "id" | "trainer_id" | "attendance_count" | "created_at" | "updated_at">;

interface BackendRegistration {
  id: string;
  training_id: string;
  participant_name: string;
  participant_code: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  joined_at: string;
  attendance_marked: boolean;
  checked_in_at?: string | null;
  registration_token: string;
}

interface BackendAttendance {
  id: string;
  registration_id: string;
  participant_name: string;
  participant_code: string;
  role: string;
  status: string;
  checked_in_at: string;
}

interface BackendAttendanceRow {
  registration_id: string;
  training_id: string;
  training_title: string;
  trainer_name: string;
  scheduled_at: string;
  location: string;
  participant_name: string;
  participant_code: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  joined_at: string;
  attendance_status: string;
  checked_in_at?: string | null;
}

const role = (value: string) => value.toUpperCase() as ParticipantRole;
const status = (value: string) => value.toUpperCase() as TrainingStatus;

function mapTraining(source: BackendTraining): TrainingProgram {
  return {
    id: source.id,
    publicCode: source.public_code,
    title: source.title,
    description: source.description,
    trainerId: source.trainer_id,
    trainerName: source.trainer_name,
    scheduledAt: source.scheduled_at,
    durationHours: source.duration_hours,
    location: source.location,
    audienceRoles: source.audience_roles.map(role),
    capacity: source.capacity,
    status: status(source.status),
    attendanceOpen: source.attendance_open,
    registrationCount: source.registration_count,
    attendanceCount: source.attendance_count,
    createdAt: source.created_at,
    updatedAt: source.updated_at,
  };
}

export async function listTrainings() {
  const response = await apiClient.request<{ trainings: BackendTraining[] }>("/api/trainings");
  return response.data.trainings.map(mapTraining);
}

export async function listTrainerOptions() {
  const response = await apiClient.request<{
    trainers: Array<{ id: string; first_name: string; last_name: string; email: string }>;
  }>("/api/trainings/trainers");
  return response.data.trainers.map((trainer) => ({
    id: trainer.id,
    firstName: trainer.first_name,
    lastName: trainer.last_name,
    email: trainer.email,
  }));
}

export async function createTraining(input: TrainingMutationInput) {
  const response = await apiClient.request<{ training: BackendTraining }>("/api/trainings", {
    method: "POST",
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      trainer_id: input.trainerId || null,
      scheduled_at: input.scheduledAt,
      duration_hours: input.durationHours,
      location: input.location,
      audience_roles: input.audienceRoles.map((item) => item.toLowerCase()),
      capacity: input.capacity,
    }),
  });
  return mapTraining(response.data.training);
}

export async function updateTraining(trainingId: string, input: TrainingMutationInput) {
  const response = await apiClient.request<{ training: BackendTraining }>(
    `/api/trainings/${encodeURIComponent(trainingId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: input.title,
        description: input.description,
        trainer_id: input.trainerId || null,
        scheduled_at: input.scheduledAt,
        duration_hours: input.durationHours,
        location: input.location,
        audience_roles: input.audienceRoles.map((item) => item.toLowerCase()),
        capacity: input.capacity,
        status: input.status?.toLowerCase(),
        attendance_open: input.attendanceOpen,
        expected_updated_at: input.expectedUpdatedAt,
      }),
    },
  );
  return mapTraining(response.data.training);
}

export async function deleteTraining(trainingId: string) {
  await apiClient.request(`/api/trainings/${encodeURIComponent(trainingId)}`, {
    method: "DELETE",
  });
}

export async function getPublicTraining(publicCode: string): Promise<PublicTraining> {
  const response = await apiClient.request<{ training: BackendPublicTraining }>(
    `/api/public/trainings/${encodeURIComponent(publicCode)}`,
    {},
    false,
  );
  const source = response.data.training;
  return {
    publicCode: source.public_code,
    title: source.title,
    description: source.description,
    trainerName: source.trainer_name,
    scheduledAt: source.scheduled_at,
    durationHours: source.duration_hours,
    location: source.location,
    audienceRoles: source.audience_roles.map(role),
    capacity: source.capacity,
    status: status(source.status),
    attendanceOpen: source.attendance_open,
    registrationCount: source.registration_count,
  };
}

export async function joinTraining(
  publicCode: string,
  input: {
    participantName: string;
    participantCode: string;
    role: ParticipantRole;
    email: string;
    phone: string;
  },
): Promise<TrainingRegistration> {
  const response = await apiClient.request<{ registration: BackendRegistration }>(
    `/api/public/trainings/${encodeURIComponent(publicCode)}/registrations`,
    {
      method: "POST",
      body: JSON.stringify({
        participant_name: input.participantName,
        participant_code: input.participantCode,
        role: input.role.toLowerCase(),
        email: input.email,
        phone: input.phone,
      }),
    },
    false,
  );
  const source = response.data.registration;
  return {
    id: source.id,
    trainingId: source.training_id,
    participantName: source.participant_name,
    participantCode: source.participant_code,
    role: role(source.role),
    email: source.email || undefined,
    phone: source.phone || undefined,
    joinedAt: source.joined_at,
    attendanceMarked: source.attendance_marked,
    checkedInAt: source.checked_in_at || undefined,
    registrationToken: source.registration_token,
  };
}

export async function markAttendance(publicCode: string, registrationToken: string): Promise<AttendanceConfirmation> {
  const response = await apiClient.request<{ attendance: BackendAttendance }>(
    `/api/public/trainings/${encodeURIComponent(publicCode)}/attendance`,
    { method: "POST", body: JSON.stringify({ registration_token: registrationToken }) },
    false,
  );
  const source = response.data.attendance;
  return {
    id: source.id,
    registrationId: source.registration_id,
    participantName: source.participant_name,
    participantCode: source.participant_code,
    role: role(source.role),
    status: source.status.toUpperCase(),
    checkedInAt: source.checked_in_at,
  };
}

function attendanceQuery(filters: { trainingId?: string; search?: string } = {}) {
  const query = new URLSearchParams();
  if (filters.trainingId) query.set("training_id", filters.trainingId);
  if (filters.search?.trim()) query.set("search", filters.search.trim());
  return query.size ? `?${query}` : "";
}

export async function listAttendance(filters: { trainingId?: string; search?: string } = {}) {
  const response = await apiClient.request<{ rows: BackendAttendanceRow[]; total: number }>(
    `/api/trainings/attendance${attendanceQuery(filters)}`,
  );
  return response.data.rows.map((source): AttendanceRow => ({
    registrationId: source.registration_id,
    trainingId: source.training_id,
    trainingTitle: source.training_title,
    trainerName: source.trainer_name,
    scheduledAt: source.scheduled_at,
    location: source.location,
    participantName: source.participant_name,
    participantCode: source.participant_code,
    role: role(source.role),
    email: source.email || undefined,
    phone: source.phone || undefined,
    joinedAt: source.joined_at,
    attendanceStatus: source.attendance_status === "present" ? "PRESENT" : "JOINED_NOT_PRESENT",
    checkedInAt: source.checked_in_at || undefined,
  }));
}

export async function downloadAttendanceExport(filters: { trainingId?: string; search?: string } = {}) {
  const response = await apiClient.download(`/api/trainings/attendance/export.xlsx${attendanceQuery(filters)}`);
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") || "";
  const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1] || "jubilee-training-attendance.xlsx";
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function getCheckInPath(publicCode: string) {
  return `/attendance/check-in?training=${encodeURIComponent(publicCode)}`;
}
