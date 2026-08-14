import { useEffect, useRef, useState } from "react";
import { useCurrentUser, useEditUser, useUsers } from "../lib/queries/userQueries";
import toast from "react-hot-toast";
import { FiSearch, FiUserPlus, FiX } from "react-icons/fi";

function Modal({ setIsOpen, isOpen }: { setIsOpen: (isOpen: boolean) => void; isOpen: boolean }) {
  const { users } = useUsers();
  const { user } = useCurrentUser();
  const { editUser } = useEditUser();
  const [input, setInput] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const query = input.trim().toLowerCase();
  const filteredUsers = users?.filter((candidate) =>
    candidate._id !== user?._id && candidate.name.toLowerCase().includes(query),
  ).slice(0, 6);

  async function addFriend({ _id, name, avatar }: { _id: string; name: string; avatar: string }) {
    if (!user) return;
    await editUser({ data: { friends: [...user.friends, { name, friendId: _id, avatar }] } });
    setIsOpen(false);
    toast.success(`${name} added to your friends.`);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px] sm:p-6">
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="friend-dialog-title" className="relative w-full max-w-[54rem] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 px-6 py-5 pr-16 dark:border-neutral-800 sm:px-8 sm:py-6">
          <h2 id="friend-dialog-title" className="text-[2.2rem] font-semibold">Add a friend</h2>
          <p className="mt-1 text-[1.35rem] text-neutral-500">Search for another learner by their display name.</p>
          <button className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white" onClick={() => setIsOpen(false)} aria-label="Close dialog"><FiX className="h-8 w-8" /></button>
        </div>

        <div className="p-6 sm:p-8">
          <label className="relative block">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input autoFocus type="search" value={input} placeholder="Search by name" className="h-20 w-full rounded-lg border border-neutral-300 bg-transparent pl-14 pr-4 text-[1.45rem] focus:border-indigo-600 dark:border-neutral-700" onChange={(e) => setInput(e.target.value)} />
          </label>

          <div className="mt-5 min-h-28">
            {query.length < 3 && <div className="rounded-lg bg-neutral-50 px-4 py-5 text-center text-[1.3rem] text-neutral-500 dark:bg-neutral-950">Enter at least 3 characters to search.</div>}
            {query.length >= 3 && filteredUsers?.length === 0 && <div className="rounded-lg bg-neutral-50 px-4 py-5 text-center text-[1.3rem] text-neutral-500 dark:bg-neutral-950">No learners found for “{input.trim()}”.</div>}
            {query.length >= 3 && filteredUsers && filteredUsers.length > 0 && <div className="divide-y divide-neutral-100 dark:divide-neutral-800">{filteredUsers.map((candidate) => {
              const alreadyAdded = user?.friends.some((friend) => friend.friendId === candidate._id);
              return <div key={candidate._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"><img src={`/avatars/AV${candidate.avatar}.png`} className="h-16 w-16 rounded-full object-cover" alt=""/><div className="min-w-0 flex-1"><p className="truncate text-[1.45rem] font-semibold">{candidate.name}</p><p className="text-[1.2rem] text-neutral-500">Verba learner</p></div><button disabled={alreadyAdded} onClick={() => addFriend({ _id: candidate._id, name: candidate.name, avatar: candidate.avatar })} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-[1.25rem] font-semibold text-white hover:bg-indigo-700 disabled:cursor-default disabled:bg-neutral-200 disabled:text-neutral-500 dark:disabled:bg-neutral-800"><FiUserPlus />{alreadyAdded ? "Added" : "Add"}</button></div>;
            })}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
