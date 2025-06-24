import { useState } from "react";
import { useEditUser, useUsers } from "../lib/queries/userQueries";
import { User } from "../types";

function Modal({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const { users } = useUsers();
  const { editUser } = useEditUser();
  const [input, setInput] = useState("");
  const userStr = localStorage.getItem("user");
  const user: User | null = userStr ? JSON.parse(userStr) : null;

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(input.toLowerCase())
  );

  function addFriend({
    _id,
    name,
    avatar,
  }: {
    _id: string;
    name: string;
    avatar: string;
  }) {
    editUser({
      id: user!._id,
      data: {
        friends: [
          ...user!.friends,
          { name: name, friendId: _id, avatar: avatar },
        ],
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-xl  w-[40%] h-[50%] relative text-5xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-4 text-6xl font-bold text-gray-600 dark:text-gray-300 cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-5xl font-bold mb-2">Find a Friend: </h2>
        <input
          type="text"
          placeholder="Search by name..."
          className="bg-neutral-700 rounded-lg w-[100%] px-4 py-2"
          onChange={(e) => setInput(e.target.value)}
        />
        {input.length < 3 && (
          <p className="text-neutral-500 mt-2">
            Type at least 3 characters to search for friends.
          </p>
        )}
        {input.length > 3 && filteredUsers?.length === 0 && (
          <p className="text-neutral-500 mt-2">
            No Users Found.
          </p>
        )}
        {input.length >= 3 &&
          filteredUsers?.map((user) => (
            <div className="flex gap-5">
              <p>{user.name}</p>
              <button
                className="cursor-pointer"
                onClick={() =>
                  addFriend({ _id: user._id, name: user.name, avatar: "30" })
                }
              >
                ➕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Modal;
