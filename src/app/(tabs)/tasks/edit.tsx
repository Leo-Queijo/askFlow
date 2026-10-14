import { useLocalSearchParams } from "expo-router";

import TaskFormScreen from "@/screens/tasks/TaskFormScreen";

export default function EditTaskPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TaskFormScreen key={id} />;
}
