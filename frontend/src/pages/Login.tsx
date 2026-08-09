import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { SettingsContext } from "../lib/contexts";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../lib/queries/userQueries";

interface LoginFormInputs {
  email: string;
  password: string;
}

function Login() {
  const { setAuthorized, setMode } = useContext(SettingsContext)!;
  const { setId } = useContext(SettingsContext)!;
  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();
  const { login } = useLogin();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    toast.promise(login(data), {
      loading: "Logging in...",
      success: "Logged in successfully!",
      error: "Logging went wrong!",
    });

    login(data)
      .then((user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setMode("user");
        setAuthorized(true);
        navigate("/");
        reset();
        setId(user._id);
      })
      .catch(() => {
        reset();
      });
  };

  return (
    <>
      <Toaster />
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12">
        <div className="flex items-center gap-3 text-[2.4rem] font-bold tracking-tight">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-600 text-[1.8rem] text-white">V</span>
          verba
        </div>
        <div className="w-full max-w-[44rem] rounded-xl border border-neutral-200 bg-white p-10 dark:border-neutral-800 dark:bg-neutral-900 sm:p-12">
          <p className="text-[1.3rem] font-semibold text-indigo-600 dark:text-indigo-400">Welcome back</p>
          <h2 className="mt-2 text-[3.2rem] font-bold tracking-tight">Log in to Verba</h2>
          <p className="mb-8 mt-2 text-[1.45rem] text-neutral-500">
            Enter your email below to login to your account
          </p>
          <form className="grid" onSubmit={handleSubmit(onSubmit)}>
            <label className="mb-2 text-[1.35rem] font-semibold">Email</label>
            <input
              className="mb-6 h-20 rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.5rem] focus:border-indigo-600 dark:border-neutral-700"
              type="text"
              {...register("email")}
            />
            <label className="mb-2 text-[1.35rem] font-semibold">Password</label>
            <input
              className="mb-6 h-20 rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.5rem] focus:border-indigo-600 dark:border-neutral-700"
              type="password"
              {...register("password")}
            />
            <input
              type="submit"
              value="Log in"
              className="mt-2 h-20 cursor-pointer rounded-lg bg-indigo-600 text-[1.5rem] font-semibold text-white hover:bg-indigo-700"
            />
          </form>
          <p className="mt-7 text-center text-[1.35rem] text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              Sign up
            </Link>
          </p>
          <button
            className="mt-8 w-full cursor-pointer rounded-lg border border-neutral-300 py-3 text-[1.4rem] font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            onClick={() => {
              toast.promise(
                login({ email: "acc@demo.pl", password: "12345678" }),
                {
                  loading: "Logging in...",
                  success: "Logged in successfully!",
                  error: "Logging went wrong!",
                },
              );

              login({ email: "acc@demo.pl", password: "12345678" })
                .then((user) => {
                  localStorage.setItem("user", JSON.stringify(user));
                  setMode("user");
                  setAuthorized(true);
                  navigate("/");
                  reset();
                  setId(user._id);
                })
                .catch(() => {
                  reset();
                });
            }}
          >
            Log in into demo account
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
