import { useContext } from "react";
import { AccountCtx } from "../lib/AccountContext";

function Dashboard() {
  const { logged } = useContext(AccountCtx);

  return (
    <div>{logged ? <div>logged</div> : <div>route protected 🔐</div>}</div>
  );
}

export default Dashboard;
