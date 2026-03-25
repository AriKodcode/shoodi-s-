import {create} from 'zustand'


const useMeals = create((set)=>({
    mealsData:[],
    getMeals:(mealsFromFetch) => set({meals:mealsFromFetch})
}))


export {useMeals}