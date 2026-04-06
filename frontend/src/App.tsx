import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import Auth from "./Auth"
import PrivateRoute from "./PrivateRoute"
import AIChat from "./AiChat"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Auth mode="login"/>}/>
                <Route path="register" element={<Auth mode="register"/>}/>
                <Route path="/chat" element={
                    <PrivateRoute>
                        <AIChat/>
                    </PrivateRoute>
                }/>
            </Routes>
        </BrowserRouter>
    )
}