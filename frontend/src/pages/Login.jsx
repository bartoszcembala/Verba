import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { SettingsContext } from "../lib/contexts";
import { useContext } from "react";

// eslint-disable-next-line react/prop-types
function Login({ setDbAccount }) {
  const { setAuthorized, setMode } = useContext(SettingsContext);
  const { register, handleSubmit, reset } = useForm();

  async function onSubmit(data) {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("bad credentials");
      }

      const responseReady = await res.json();
      const user = responseReady.data.user;

      toast.success("Loged in successfully!");
      setDbAccount(user);
      setMode("user");
      setAuthorized(true);
    } catch (error) {
      toast.error("Logging went wrong!");
    } finally {
      reset();
    }
  }

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
              type="text"
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
