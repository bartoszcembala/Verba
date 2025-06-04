type User = {
  _id: string;
  __v: number;
  name: string;
  email: string;
  password: string;
  latestActivity: string[];
  streak: string[];
};

function Home() {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.name?.split(" ")[0] || "...";

  return (
    <div className="flex items-center justify-center">
      <div>
        <div className="flex w-[90rem] h-[30rem]">
          <div className="w-[70%]">
            Hi, {firstName}
            <p>Welcome back!</p>
          </div>
          <div>[PICK UP WHERE YOU LEFT OFF]</div>
        </div>
        <div className="flex w-[90rem] h-[30rem]">
          <div>[IMIE I NAZWISKO]</div>
          <div className="w-[70%]">[STREAK]</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
