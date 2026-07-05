// import { useContext, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { AccountCtx } from "../lib/AccountContext";

// type FormDataAI = {
//   name: string;
//   displayName: string;
//   number: string;
//   data: string; // stringified JSON
// };

// type FormDataManual = {
//   object: string;
//   name: string;
//   displayName: string;
//   data: string; // stringified JSON
// };

// function AddModule() {
//   const { register, handleSubmit } = useForm<FormDataAI | FormDataManual>();
//   const { account, setAccount } = useContext(AccountCtx);
//   const [ai, setAi] = useState(false);

//   function onSubmit(data: FormDataAI | FormDataManual) {
//     try {
//       const formatedData = JSON.parse(data.data);

//       setAccount((prev: any) => ({
//         ...prev,
//         notLearned: {
//           ...prev?.notLearned,
//           [data.name]: formatedData,
//         },
//         modulesPercent: {
//           ...prev?.modulesPercent,
//           [data.name]: [],
//         },
//       }));
//     } catch (err) {
//       console.error("Invalid JSON in data field", err);
//     }
//   }

//   useEffect(() => {
//     console.log(account);
//   }, [account]);

//   return (
//     <div className="insideContainerAcc">
//       <h2>Add Own Module</h2>
//       <button onClick={() => setAi((prev) => !prev)} className="btn">
//         Use with AI
//       </button>

//       <form className="form" onSubmit={handleSubmit(onSubmit)}>
//         <label>Name</label>
//         <input {...register("name")} />

//         <label>Display name</label>
//         <input {...register("displayName")} />

//         {ai && (
//           <>
//             <label>How many words do you want</label>
//             <input {...register("number")} />
//             <label>What do you want to learn about</label>
//           </>
//         )}

//         {!ai && <label>Words: </label>}
//         <textarea className="data" {...register("data")} />

//         <input type="submit" className="formSubmit" />
//       </form>
//     </div>
//   );
// }

// export default AddModule;

function AddModule() {
  return <div className="text-white text-center text-6xl pt-12">In work 🚧</div>;
}
export default AddModule;
