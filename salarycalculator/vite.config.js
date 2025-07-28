import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        salary: 'salary-to-hourly.html',
        tax: 'tax-estimator.html',
        budget: 'budget-planner.html'
      }
    }
  }
})
