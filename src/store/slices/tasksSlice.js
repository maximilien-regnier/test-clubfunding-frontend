import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api';

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      if (params.title) queryParams.append('title', params.title);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params.status) queryParams.append('status', params.status);

      
      const url = `${API_BASE_URL}/projects/${projectId}/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1
    },
    filters: {
      title: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      status: ''
    },
    form: {
      data: {
        title: '',
        status: 'pending',
        project_id: null
      },
      errors: {},
      isSubmitting: false
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFormData: (state, action) => {
      state.form.data = { ...state.form.data, ...action.payload };
    },
    setFormErrors: (state, action) => {
      state.form.errors = action.payload;
    },
    clearFormErrors: (state) => {
      state.form.errors = {};
    },
    resetForm: (state) => {
      state.form.data = { title: '', status: 'pending', project_id: null };
      state.form.errors = {};
      state.form.isSubmitting = false;
    },
    initializeForm: (state, action) => {
      state.form.data = action.payload || { title: '', status: 'pending', project_id: null };
      state.form.errors = {};
      state.form.isSubmitting = false;
    },
    setFormSubmitting: (state, action) => {
      state.form.isSubmitting = action.payload;
    },
    clearTasks: (state) => {
      state.items = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        sort_by: 'created_at',
        sort_direction: 'desc',
        status: '',
        overdue: false
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && action.payload.meta) {
          state.items = action.payload.data;
          state.pagination = {
            current_page: action.payload.meta.current_page,
            per_page: action.payload.meta.per_page,
            total: action.payload.meta.total,
            last_page: action.payload.meta.last_page
          };
        } else {
          state.items = action.payload.data || action.payload;
        }
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.form.isSubmitting = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.creating = false;
        state.form.isSubmitting = false;
        state.items.push(action.payload.data || action.payload);
        state.form.data = { title: '', status: 'pending', project_id: null };
        state.form.errors = {};
      })
      .addCase(createTask.rejected, (state, action) => {
        state.creating = false;
        state.form.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(updateTask.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.form.isSubmitting = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updating = false;
        state.form.isSubmitting = false;
        const task = action.payload.data || action.payload;
        const index = state.items.findIndex(item => item.id === task.id);
        if (index !== -1) {
          state.items[index] = task;
        }
        state.form.data = { title: '', status: 'pending', project_id: null };
        state.form.errors = {};
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.updating = false;
        state.form.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(deleteTask.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearTasks,
  setFormData, 
  setFormErrors, 
  clearFormErrors, 
  resetForm, 
  initializeForm, 
  setFormSubmitting,
  setFilters,
  resetFilters,
  setPagination
} = tasksSlice.actions;
export default tasksSlice.reducer;
