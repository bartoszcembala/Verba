import { useEffect, useRef, useState } from "react";
import { useEditUser, useUsers } from "../lib/queries/userQueries";
import { User } from "../types";
import { CiCirclePlus } from "react-icons/ci";
import toast from "react-hot-toast";
import { IoCloseCircleOutline } from "react-icons/io5";

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
    user.name.toLowerCase().includes(input.toLowerCase()),
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
      }),
    );
    setIsOpen(false);
    toast.success("Friend followed!");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div
        ref={modalRef}
        className="relative max-h-[70vh] w-full max-w-[52rem] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-7 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <button
          className="absolute right-5 top-5 cursor-pointer text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <IoCloseCircleOutline className="h-10 w-10" />
        </button>
        <h2 className="mb-6 text-[2.3rem] font-semibold">Find a friend</h2>
        <input
          type="text"
          placeholder="Search by name..."
          className="mb-5 h-20 w-full rounded-lg border border-neutral-300 bg-transparent px-4 text-[1.45rem] dark:border-neutral-700"
          onChange={(e) => setInput(e.target.value)}
        />
        {input.length < 3 && (
          <p className="mt-2 text-[1.35rem] text-neutral-500">
            Type at least 3 characters to search for friends.
          </p>
        )}
        {input.length >= 3 && filteredUsers?.length === 0 && (
          <p className="mt-2 text-[1.35rem] text-neutral-500">No users found.</p>
        )}
        {input.length >= 3 &&
          filteredUsers?.map((userFil) => (
            <div key={userFil._id} className="flex items-center gap-4 border-t border-neutral-100 py-4 dark:border-neutral-800">
              <img
                src={`/avatars/AV${userFil.avatar}.png`}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <p className="flex-1 text-[1.5rem] font-semibold">{userFil.name}</p>
              <CiCirclePlus
                className="h-9 w-9 cursor-pointer text-indigo-600"
                onClick={() =>
                  user?.friends.some(
                    (friend) => friend.friendId === userFil._id,
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
