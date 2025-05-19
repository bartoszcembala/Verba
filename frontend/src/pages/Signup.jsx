import { useForm } from "react-hook-form";

function Signup() {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    try {
      console.log("DATA: " + data);
      await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      console.log("Signed up");
    } catch (error) {
      console.log("not loged" + error);
    }
  }

  return (
    <div onSubmit={handleSubmit(onSubmit)}>
      <form>
        <label>name</label>
        <input type="text" {...register("name")} />
        <label>email</label>
        <input type="text" {...register("email")} />
        <label>password</label>
        <input type="text" {...register("password")} />
        <label>confirm password</label>
        <input type="text" {...register("passwordConfirm")} />
        <input type="submit" />
      </form>
    </div>
  );
}

export default Signup;
