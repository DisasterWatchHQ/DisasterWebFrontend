"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header/>
            <main className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold text-center mb-4">Create Your Account</h2>
                    <RegisterForm />
                </div>
            </main>
           <Footer/>
        </div>
    );
}
