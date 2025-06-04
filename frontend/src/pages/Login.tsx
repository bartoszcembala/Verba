import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { SettingsContext } from "../lib/contexts";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../lib/queries/userQueries";

interface LoginFormInputs {
  email: string;
  password: string;
}

function Login() {
  const { setAuthorized, setMode } = useContext(SettingsContext)!;

  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();
  const { login } = useLogin();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data, {
      onSuccess(user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Logged in successfully!");
        setMode("user");
        setAuthorized(true);
        navigate("/");
        reset();
      },
      onError() {
        toast.error("Logging went wrong!");
        reset();
      },
    });
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center">
        <div className="mt-10 py-16 px-12 w-[52rem] h-[55rem] rounded-4xl border-1 border-solid border-neutral-400">
          <h2 className="text-6xl mb-6 ">Login</h2>
          <p className="text-neutral-400 mb-10">
            Enter your email below to login to your account
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Email</label>
            <input
              className="mt-2 mb-8 border-1 border-solid border-neutral-400 rounded-xl w-full h-16 px-6 "
              type="text"
              {...register("email")}
            />
            <label>Password</label>
            <input
              className="mt-2 mb-8 border-1 border-solid border-neutral-400 rounded-xl w-full h-16 px-6"
              type="password"
              {...register("password")}
            />
            <input
              type="submit"
              className="mt-10 h-14 bg-neutral-100 text-neutral-900 w-full cursor-pointer rounded-xl hover:bg-neutral-300 transition"
            />
          </form>
          <p className="text-center mt-6 text-neutral-200">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="cursor-pointer underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
