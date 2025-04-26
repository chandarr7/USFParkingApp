import { Link } from "wouter";
import { ParkingMeter, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ParkingMeter className="h-6 w-6" />
              <span className="text-xl font-medium">ParkEase</span>
            </div>
            <p className="text-secondary/80 text-sm">
              Find and reserve parking spots easily with our comprehensive parking management solution.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-secondary/80">
              <li><Link href="/" className="hover:text-secondary transition-colors duration-200">Home</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors duration-200">About Us</Link></li>
              <li><Link href="/reservations" className="hover:text-secondary transition-colors duration-200">My Reservations</Link></li>
              <li><Link href="/favorites" className="hover:text-secondary transition-colors duration-200">Favorites</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-secondary/80">
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">ParkingMeter Tips</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">API Documentation</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>
            <ul className="space-y-2 text-secondary/80">
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-1" />
                <span>chandarrathala@usf.edu</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-1" />
                <span>(813) 418-9804</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1" />
                <span>4202 E Fowler Ave, Tampa, FL 33620</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-secondary/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary/80 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} University of South Florida. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-secondary/80 hover:text-secondary transition-colors duration-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-secondary/80 hover:text-secondary transition-colors duration-200">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-secondary/80 hover:text-secondary transition-colors duration-200">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-secondary/80 hover:text-secondary transition-colors duration-200">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;