function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  return (
    <div className="flex items-center justify-center ">
      <div>
        <div className="flex w-[90rem] h-[30rem]">
          <div className="w-[70%]">
            Hi, {user.name.split(" ")[0]}
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
