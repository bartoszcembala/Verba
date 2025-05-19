import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

// eslint-disable-next-line react/prop-types
function Login({ setAuthorized, setLogged, setDbAccount, setMode }) {
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
      setLogged(true);
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
      <div className="insideContainerAcc">
        <h2>Log in</h2>
        <div onSubmit={handleSubmit(onSubmit)}>
          <form className="form">
            <label>email</label>
            <input type="text" {...register("email")} />
            <label>password</label>
            <input type="text" {...register("password")} />
            <input type="submit" className="formSubmit" />
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
