import { Link } from "react-router-dom";

function NotFound() {
  return <div className="mx-auto max-w-[60rem] py-32 text-center"><p className="text-[1.3rem] font-semibold text-indigo-600">404</p><h1 className="mt-2 text-[3.4rem] font-bold">Page not found</h1><p className="mt-3 text-[1.5rem] text-neutral-500">The page you&apos;re looking for doesn&apos;t exist.</p><Link to="/" className="mt-7 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-[1.4rem] font-semibold text-white">Back home</Link></div>;
}

export default NotFound;
