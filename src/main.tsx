import { BrowserRouter as Router } from 'react-router-dom'
import ThemeProvider from './utils/ThemeContext'
import App from './App'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <Router>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Router>
)
