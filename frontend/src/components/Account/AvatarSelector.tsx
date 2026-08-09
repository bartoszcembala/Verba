export default function AvatarSelector({
  selectedAvatar,
  setSelectedAvatar,
}: {
  selectedAvatar: number | null;
  setSelectedAvatar: (num: number | null) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5].map((num) => (
        <button key={num} type="button" onClick={() => setSelectedAvatar(num)} className="rounded-full" aria-label={`Select avatar ${num}`} aria-pressed={selectedAvatar === num}>
          <img
            className={`aspect-square w-full cursor-pointer rounded-full border-2 object-cover p-0.5 transition ${
              selectedAvatar === num
                ? "border-indigo-600 opacity-100 ring-2 ring-indigo-100 dark:ring-indigo-950"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            src={`/avatars/AV${num}.png`}
            alt=""
          />
        </button>
      ))}
    </div>
  );
}
