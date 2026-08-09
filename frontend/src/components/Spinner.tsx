function Spinner() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-200 border-t-indigo-600 dark:border-neutral-800 dark:border-t-indigo-400"></div>
    </div>
  );
}

export default Spinner;
