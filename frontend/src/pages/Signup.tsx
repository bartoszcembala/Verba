import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignupFormInputs>();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      toast("Signing up...");
      const res = await fetch(
        `https://verba-ywgu.onrender.com/api/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Signup failed");
        return;
      }

      toast.success("Signed up successfully! Please log in.");
      navigate("/login"); 
    } catch (error) {
      toast.error("Something went wrong");
      console.log("not logged in: ", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-12">
      <div className="flex items-center gap-3 text-[2.4rem] font-bold tracking-tight">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-600 text-[1.8rem] text-white">V</span>
        verba
      </div>
      <div className="w-full max-w-[44rem] rounded-xl border border-neutral-200 bg-white p-10 dark:border-neutral-800 dark:bg-neutral-900 sm:p-12">
        <p className="text-[1.3rem] font-semibold text-indigo-600 dark:text-indigo-400">Start learning</p>
        <h2 className="mt-2 text-[3.2rem] font-bold tracking-tight">Create your account</h2>
        <p className="mb-8 mt-2 text-[1.45rem] text-neutral-500">
          Enter your data below to create an account
        </p>
        <form className="grid" onSubmit={handleSubmit(onSubmit)}>
          <label className="mb-2 text-[1.35rem] font-semibold">Name</label>
          <input
            type="text"
            {...register("name")}
            className="mb-5 h-20 rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.5rem] focus:border-indigo-600 dark:border-neutral-700"
          />
          <label className="mb-2 text-[1.35rem] font-semibold">Email</label>
          <input
            type="text"
            {...register("email")}
            className="mb-5 h-20 rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.5rem] focus:border-indigo-600 dark:border-neutral-700"
          />
          <label className="mb-2 text-[1.35rem] font-semibold">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mb-5 h-20 rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.5rem] focus:border-indigo-600 dark:border-neutral-700"
          />
          <label className="mb-2 text-[1.35rem] font-semibold">Confirm password</label>
          <input
            type="password"
            {...register("passwordConfirm")}
            className="mb-5 h-20 rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.5rem] focus:border-indigo-600 dark:border-neutral-700"
          />
          <input
            type="submit"
            value="Create account"
            className="mt-2 h-20 cursor-pointer rounded-lg bg-indigo-600 text-[1.5rem] font-semibold text-white hover:bg-indigo-700"
          />
        </form>
        <p className="mt-7 text-center text-[1.35rem] text-neutral-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
