import { create } from 'zustand';

const useStore = create((set) => ({
  // 查询参数
  query: {
    origin: 'SHA',
    destination: 'PEK',
    date: '',
    dailySalary: 500,
    leaveHours: 8,
    workSchedule: {
      hoursPerDay: 8
    },
    platforms: ['ctrip', 'qunar', 'fliggy']
  },

  // 加载状态
  loading: false,

  // 查询结果
  result: null,

  // 错误信息
  error: null,

  // 更新查询参数
  setQuery: (key, value) => set((state) => ({
    query: { ...state.query, [key]: value }
  })),

  // 批量更新查询参数
  setQueryBatch: (updates) => set((state) => ({
    query: { ...state.query, ...updates }
  })),

  // 设置加载状态
  setLoading: (loading) => set({ loading }),

  // 设置结果
  setResult: (result) => set({ result }),

  // 设置错误
  setError: (error) => set({ error }),

  // 重置
  reset: () => set({
    result: null,
    error: null,
    loading: false
  })
}));

export default useStore;
