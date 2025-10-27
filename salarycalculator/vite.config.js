import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        salary: 'salary-to-hourly.html',
        hourly: 'hourly-to-salary.html',
        tax: 'take-home-pay.html',
        budget: 'budget-planner.html',
        terms: 'terms.html',
        contact: 'contact.html'
      }
    }
  }
})
