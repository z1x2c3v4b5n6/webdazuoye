import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  tasks: []
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.tasks.unshift(action.payload);
      },
      prepare(task) {
        return {
          payload: {
            id: task.id || nanoid(),
            title: task.title,
            stage: task.stage,
            dueDate: task.dueDate || '',
            done: !!task.done,
            linkedType: task.linkedType || null,
            linkedId: task.linkedId || null,
            createdAt: task.createdAt || new Date().toISOString(),
            completedAt: task.completedAt || null
          }
        };
      }
    },
    updateTask(state, action) {
      const { id, changes } = action.payload;
      state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t));
    },
    toggleTaskDone(state, action) {
      const id = action.payload;
      state.tasks = state.tasks.map((t) => {
        if (t.id !== id) return t;
        const done = !t.done;
        return {
          ...t,
          done,
          completedAt: done ? new Date().toISOString() : null
        };
      });
    },
    removeTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    }
  }
});

export const { addTask, updateTask, toggleTaskDone, removeTask } = planSlice.actions;
export default planSlice.reducer;
