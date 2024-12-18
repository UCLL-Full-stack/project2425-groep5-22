import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types";
import { useRouter } from "next/router";
import Button from "./Button";
import { Menu, X } from "lucide-react";
import ConfettiAnimation from "./ConfettiAnimation";

type Props = {
  user: User;
};

const Navbar: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean | null>(true);

  useEffect(() => {
    const storedAnimation = sessionStorage.getItem('animation');
    if (storedAnimation !== null) {
      setAnimation(storedAnimation === 'true');
    }
  }, []);

  useEffect(() => {
    if (animation)
      sessionStorage.setItem('animation', animation.toString());
  }, [animation]);

  const handleLogout = () => {
    console.log("Logging out...");
    sessionStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  return (
    <>
      {animation && (
        <ConfettiAnimation />
      )}
      <nav className="mx-auto text-gray-800 bg-gray-100 rounded-2xl max-w-screen-2xl">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center shrink-0 gap-x-5">
              <Link href="/">
                <img
                  src="https://jeugdwerk.org/images/logo/logo.colorful.png"
                  alt="Logo"
                  className="w-auto h-9"
                />
              </Link>

              {/* Navigation Links */}
              <div className="hidden sm:flex sm:items-center sm:space-x-6">
                <Link href={'/spelletjes'} className="px-3 py-2 text-sm font-semibold transition-all rounded-md hover:bg-gray-200">
                  Spelletjes
                </Link>
              </div>
            </div>

            {/* User Dropdown */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={animation ?? false}
                  onChange={() => setAnimation(!animation)}
                  className="sr-only"
                />
                <div className="w-12 h-6 transition-colors duration-300 ease-in-out bg-gray-200 rounded-full">
                  <div
                    className={`w-6 h-6 flex justify-center items-center  rounded-full transition-transform duration-300 ease-in-out transform ${animation ? 'translate-x-6 bg-primary' : 'translate-x-0 bg-gray-700'
                      }`}

                  ><span className="-mt-1">🎊</span></div>

                </div>
              </label>
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center px-2 py-2 text-sm font-medium transition duration-150 ease-in-out border border-transparent rounded-md"
                >
                  <span className="mr-2">{user.username}</span>
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                      <Link
                        href={`/profiel/${user.username}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mijn Profiel
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        Afmelden
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/aanmaken">
                <Button>
                  Delen
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 text-xl text-gray-400 rounded-md hover:text-gray-500"
              >
                {open ? (
                  <X />
                ) : (
                  <Menu />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Navigation Menu */}
        {open && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 text-center">
              <Link
                href="/spelletjes"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Spelletjes
              </Link>
              <Link
                href={`/profiel/${user.username}`}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Mijn Profiel
              </Link>
              <Link href="/aanmaken" className="block px-3 mt-2">
                <Button className="w-full">
                  Delen
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
              >
                Afmelden
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
