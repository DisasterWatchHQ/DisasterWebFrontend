import { useForm } from "react-hook-form";
import FormInput from "../components/FormInput";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <FormInput label="Email" type="email" register={register} required />
        <FormInput label="Password" type="password" register={register} required />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
