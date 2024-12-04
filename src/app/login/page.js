import LoginForm from "../components/LoginForm";

export default function Login(){
    return(
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-1 flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white p-6 rounded shadow">
                    <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
                    <LoginForm />
                </div>
            </main>
            <Footer/>
        </div>
    );
}