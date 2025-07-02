import { useEffect, useRef, useState } from "react";
import { useEditUser, useUsers } from "../lib/queries/userQueries";
import { User } from "../types";
import { CiCirclePlus } from "react-icons/ci";
import toast from "react-hot-toast";

function Modal({
  setIsOpen,
  isOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  const { users } = useUsers();
  const { editUser } = useEditUser();
  const [input, setInput] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
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
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        friends: [
          ...user!.friends,
          { name: name, friendId: _id, avatar: avatar },
        ],
      })
    );
    setIsOpen(false);
    toast.success("Friend followed successfully!");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-xl  w-[40%] h-[50%] relative text-5xl"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-6xl font-bold text-neutral-500 dark:text-gray-300 cursor-pointer bg-neutral-200 dark:bg-neutral-600 rounded-full w-16 h-16 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200 "
        >
          &times;
        </button>
        <h2 className="text-5xl font-bold mb-14">Find a Friend: </h2>
        <input
          type="text"
          placeholder="Search by name..."
          className="bg-neutral-200 dark:bg-neutral-700 rounded-lg w-[100%] px-4 py-2 mb-10"
          onChange={(e) => setInput(e.target.value)}
        />
        {input.length < 3 && (
          <p className="text-neutral-500 mt-2">
            Type at least 3 characters to search for friends.
          </p>
        )}
        {input.length >= 3 && filteredUsers?.length === 0 && (
          <p className="text-neutral-500 mt-2">No Users Found.</p>
        )}
        {input.length >= 3 &&
          filteredUsers?.map((userFil) => (
            <div key={userFil._id} className="flex items-center gap-7 mx-10">
              <img
                src={`/avatars/AV${userFil.avatar}.png`}
                className="w-22 h-22 rounded-full border-2 border-indigo-500"
              />
              <p className="font-semibold text-6xl">{userFil.name}</p>
              <CiCirclePlus
                className="cursor-pointer w-16 h-16"
                onClick={() =>
                  user?.friends.some(
                    (friend) => friend.friendId === userFil._id
                  )
                    ? toast.error("You already follow this user.")
                    : addFriend({
                        _id: userFil._id,
                        name: userFil.name,
                        avatar: userFil.avatar,
                      })
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Modal;
