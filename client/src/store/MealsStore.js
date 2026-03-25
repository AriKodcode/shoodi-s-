import {create} from 'zustand'


const useMeals = create((set)=>({
    meals:[],
    getMeals:(mealsFromFetch) => set({meals:mealsFromFetch})
}))


export {useMeals}