import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Heart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-600 text-xl font-bold">HealthBridge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link to="/find-help" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Find Help
            </Link>
            <Link to="/give-help" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              Give Help
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
              About Us
            </Link>
            <Button variant="outline" className="ml-4">
              <Heart className="mr-2 h-4 w-4" /> Donate
            </Button>
            <Button>
              <User className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/find-help"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Find Help
            </Link>
            <Link
              to="/give-help"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Give Help
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              About Us
            </Link>
            <div className="px-3 py-2">
              <Button variant="outline" className="w-full mb-2">
                <Heart className="mr-2 h-4 w-4" /> Donate
              </Button>
              <Button className="w-full">
                <User className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};