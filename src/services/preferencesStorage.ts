import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Treatment } from "../types/preferences";
import type { ThemeMode } from "../types/theme";

const THEME_STORAGE_KEY = "@askflow:theme";
const TREATMENT_STORAGE_PREFIX = "@askflow:treatment:";

const validThemes: ThemeMode[] = ["light", "dark"];
const validTreatments: Treatment[] = ["Sr.", "Sra.", "Srta."];

function getTreatmentKey(userId: number): string {
  return `${TREATMENT_STORAGE_PREFIX}${userId}`;
}

export async function getThemeMode(): Promise<ThemeMode | null> {
  const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);

  return validThemes.includes(stored as ThemeMode)
    ? (stored as ThemeMode)
    : null;
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
}

export async function getTreatment(userId: number): Promise<Treatment | null> {
  const stored = await AsyncStorage.getItem(getTreatmentKey(userId));

  return validTreatments.includes(stored as Treatment)
    ? (stored as Treatment)
    : null;
}

export async function saveTreatment(
  userId: number,
  treatment: Treatment | null,
): Promise<void> {
  if (treatment === null) {
    await AsyncStorage.removeItem(getTreatmentKey(userId));
    return;
  }

  await AsyncStorage.setItem(getTreatmentKey(userId), treatment);
}
