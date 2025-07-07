import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, ...projectData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    form: {
      data: {
        name: ''
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
      state.form.data = { name: '' };
      state.form.errors = {};
      state.form.isSubmitting = false;
    },
    initializeForm: (state, action) => {
      state.form.data = action.payload || { name: '' };
      state.form.errors = {};
      state.form.isSubmitting = false;
    },
    setFormSubmitting: (state, action) => {
      state.form.isSubmitting = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        const project = action.payload.data || action.payload;
        const existingIndex = state.items.findIndex(item => item.id === project.id);
        if (existingIndex !== -1) {
          state.items[existingIndex] = project;
        } else {
          state.items.push(project);
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.form.isSubmitting = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.creating = false;
        state.form.isSubmitting = false;
        state.items.push(action.payload.data || action.payload);
        state.form.data = { name: '' };
        state.form.errors = {};
      })
      .addCase(createProject.rejected, (state, action) => {
        state.creating = false;
        state.form.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.form.isSubmitting = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.updating = false;
        state.form.isSubmitting = false;
        const project = action.payload.data || action.payload;
        const index = state.items.findIndex(item => item.id === project.id);
        if (index !== -1) {
          state.items[index] = project;
        }
        state.form.data = { name: '' };
        state.form.errors = {};
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updating = false;
        state.form.isSubmitting = false;
        state.error = action.payload;
      })
      .addCase(deleteProject.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setFormData, 
  setFormErrors, 
  clearFormErrors, 
  resetForm, 
  initializeForm, 
  setFormSubmitting 
} = projectsSlice.actions;
export default projectsSlice.reducer;
