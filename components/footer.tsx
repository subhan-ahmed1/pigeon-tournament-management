import { Trophy, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold">Pigeon Racing Tournament</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              The premier platform for pigeon racing tournaments and competitions. Join our community of passionate
              racers and experience the thrill of competitive pigeon racing.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">y</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/tournaments"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                  Tournaments
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                  About
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">info@pigeonracing.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm">Racing Center, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Pigeon Racing Tournament. All rights reserved. |
            <span className="text-blue-400 ml-1">Designed for Champions</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
