import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ParkingMeter } from "lucide-react";
import usfLogo from "@/assets/usf-logo.svg";

const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const user = {
    name: "John Doe"
  };
  
  const routes = [
    { path: "/", label: "Home" },
    { path: "/reservations", label: "My Reservations" },
    { path: "/favorites", label: "Favorites" },
    { path: "/about", label: "About Us" }
  ];
  
  const isCurrentPath = (path: string) => location === path;
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="bg-secondary py-1">
        <div className="container mx-auto px-4 flex justify-end">
          <span className="text-xs font-medium text-primary">University of South Florida - Parking Management System</span>
        </div>
      </div>
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={usfLogo} alt="USF Logo" className="h-10 w-auto hidden sm:block" />
          <ParkingMeter className="h-6 w-6" />
          <Link href="/" className="text-xl font-medium">
            ParkEase
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6">
          {routes.map((route) => (
            <Link 
              key={route.path} 
              href={route.path}
              className={`py-2 border-b-2 ${
                isCurrentPath(route.path) 
                  ? "border-white" 
                  : "border-transparent hover:border-white transition-colors duration-200"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="hidden md:flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white"
          >
            <span className="text-sm">Account</span>
            <span className="ml-1">{user.name}</span>
          </Button>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-6">
                {routes.map((route) => (
                  <Link 
                    key={route.path} 
                    href={route.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`py-2 text-lg ${
                      isCurrentPath(route.path) 
                        ? "text-primary font-medium" 
                        : "text-gray-600"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <div className="flex items-center">
                  <div className="font-medium">{user.name}</div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;