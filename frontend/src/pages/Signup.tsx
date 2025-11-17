import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function Signup() {
  const { register, handleSubmit } = useForm<SignupFormInputs>();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {

      await fetch(`http://localhost:5000/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      console.log("Signed up");
    } catch (error) {
      console.log("not logged in: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mt-10 py-16 px-12 w-[52rem] h-[70rem] rounded-4xl border-1 border-solid border-neutral-400">
        <h2 className="text-6xl mb-6 ">Register</h2>
        <p className="text-neutral-400 mb-10">
          Enter your data below to create an account
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Name</label>
          <input
            type="text"
            {...register("name")}
            className="mt-2 mb-8 border-1 border-solid border-neutral-400 rounded-xl w-full h-16 px-6"
          />
          <label>Email</label>
          <input
            type="text"
            {...register("email")}
            className="mt-2 mb-8 border-1 border-solid border-neutral-400 rounded-xl w-full h-16 px-6"
          />
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-2 mb-8 border-1 border-solid border-neutral-400 rounded-xl w-full h-16 px-6"
          />
          <label>Confirm password</label>
          <input
            type="password"
            {...register("passwordConfirm")}
            className="mt-2 mb-8 border-1 border-solid border-neutral-400 rounded-xl w-full h-16 px-6"
          />
          <input
            type="submit"
            className="mt-10 h-14 bg-neutral-100 text-neutral-900 w-full cursor-pointer rounded-xl hover:bg-neutral-300 transition"
          />
        </form>
        <p className="text-center mt-6 text-neutral-200">
          Already have an account?{" "}
          <Link to="/login" className="cursor-pointer underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
