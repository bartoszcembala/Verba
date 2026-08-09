export default function AvatarSelector({
  selectedAvatar,
  setSelectedAvatar,
}: {
  selectedAvatar: number | null;
  setSelectedAvatar: (num: number | null) => void;
}) {
  return (
    <div className="mb-8 grid grid-cols-5 gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
      {[1, 2, 3, 4, 5].map((num) => (
        <img
          key={num}
          className={`aspect-square w-full cursor-pointer rounded-lg border-2 object-cover transition ${
            selectedAvatar === num
              ? "border-indigo-600 opacity-100"
              : "border-transparent opacity-50 hover:opacity-80"
          }`}
          src={`/avatars/AV${num}.png`}
          onClick={() => setSelectedAvatar(num)}
        />
      ))}
    </div>
  );
}
