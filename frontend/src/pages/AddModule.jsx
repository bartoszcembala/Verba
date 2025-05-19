import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AccountCtx } from "../lib/AccountContext";

function AddModule() {
  const { register, handleSubmit } = useForm();
  const { account, setAccount } = useContext(AccountCtx);
  const [ai, setAi] = useState(false);

  function onSubmit(data) {
    const formatedData = JSON.parse(data.data);
    setAccount((prev) => ({
      ...prev,
      notLearned: {
        ...prev.notLearned,
        [data.name]: formatedData,
      },
      modulesPercent: {
        ...prev.modulesPercent,
        [data.name]: [],
      },
    }));
  }

  useEffect(() => console.log(account), [account]);

  return (
    <div className="insideContainerAcc">
      <h2>Add Own Module</h2>
      <button onClick={() => setAi((prev) => !prev)} className="btn">
        Use with AI
      </button>

      {ai ? (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <label>Name</label>
          <input {...register("name")} />

          <label>Display name</label>
          <input {...register("displayName")} />

          <label>How many words do you want</label>
          <input {...register("number")} />

          <label>What do you want to learn about</label>
          <textarea className="data" {...register("data")} />

          <input type="submit" className="formSubmit" />
        </form>
      ) : (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <label>Object</label>
          <input {...register("object")} />

          <label>Name</label>
          <input {...register("name")} />

          <label>Display name</label>
          <input {...register("displayName")} />

          <label>Data</label>
          <textarea className="data" {...register("data")} />

          <input type="submit" className="formSubmit" />
        </form>
      )}
    </div>
  );
}

export default AddModule;
