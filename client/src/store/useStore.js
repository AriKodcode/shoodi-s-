import { create } from 'zustand'

export const useMeals = create((set) => ({
    mealsData: [],
    recieveMeals: (meals) => set({ mealsData: meals })
}))