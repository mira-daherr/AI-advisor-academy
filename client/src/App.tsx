import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageToggle } from './components/LanguageToggle';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage from './pages/ResultsPage';
import ChatPage from './pages/ChatPage';
import DashboardHome from './pages/DashboardHome';
import SavedUniversitiesPage from './pages/SavedUniversitiesPage';
import SettingsPage from './pages/SettingsPage';
import { Spinner } from './components/ui/Spinner';

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-soft-warm">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
};

// Placeholder Components

function AppRoutes() {
    return (
        <Routes>
            {/* Main Website Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardHome />} />
                <Route path="saved" element={<SavedUniversitiesPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="reports" element={<ResultsPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Questionnaire Route */}
            <Route
                path="/questionnaire"
                element={
                    <ProtectedRoute>
                        <QuestionnairePage />
                    </ProtectedRoute>
                }
            />

            {/* Results Route */}
            <Route
                path="/results"
                element={
                    <ProtectedRoute>
                        <ResultsPage />
                    </ProtectedRoute>
                }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;
