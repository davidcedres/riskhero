import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Contact from './Contact'
import Landing from './Landing'
import Layout from '../components/PublicLayout'
import Pricing from './Pricing'
import Start from './Start'

const Public = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/start" element={<Start />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Public
