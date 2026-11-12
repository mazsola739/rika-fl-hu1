import { HashRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { HomeworkPage } from './pages/HomeworkPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="hw/:slug/*" element={<HomeworkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

// Hash routing keeps the static build working on any host and sub-path without server rewrites.
export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
