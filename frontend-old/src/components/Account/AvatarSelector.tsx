export default function AvatarSelector({
  selectedAvatar,
  setSelectedAvatar,
}: {
  selectedAvatar: number | null;
  setSelectedAvatar: (num: number | null) => void;
}) {
  return (
    <div className="flex justify-center shadow-[0_0_10px_rgba(93,93,93,0.3)] bg-neutral-700 px-8 py-4 rounded-2xl mb-20  gap-16">
      {[1, 2, 3, 4, 5].map((num) => (
        <img
          key={num}
          className={`hover:scale-102 cursor-pointer transition h-34 border-2 border-indigo-500 rounded-full ${
            selectedAvatar === num
              ? "opacity-100 scale-108 hover:scale-108"
              : "opacity-50"
          }`}
          src={`/avatars/AV${num}.png`}
          onClick={() => setSelectedAvatar(num)}
        />
      ))}
    </div>
  );
}
