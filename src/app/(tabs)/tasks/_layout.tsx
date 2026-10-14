
import { Stack } from 'expo-router';

export default function TaskStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Minhas tarefas',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="new"
        options={{
          title: 'Nova tarefa',
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalhes da tarefa',
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          title: 'Editar tarefa',
        }}
      />
    </Stack>
  );
}
