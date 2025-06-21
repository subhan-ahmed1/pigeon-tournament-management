import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Clock, MapPin, Star, Award, Target } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"

export default function HomePage() {
  const heroImages = ["/images/united-pigeon-club-logo.jpg"]

  const statsImages = ["/images/united-pigeon-club-logo.jpg"]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <AnimatedBackground images={heroImages} className="py-32 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            United Pigeon Club
            <span className="block text-4xl md:text-5xl text-blue-300 mt-2">Bewal High Flyer Tournaments</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            Experience the ancient art of high flyer pigeon competitions from Pakistan. Watch magnificent birds soar to
            incredible heights, perform breathtaking aerial displays, and demonstrate the timeless bond between fanciers
            and their prized high flying pigeons at United Pigeon Club Bewal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tournaments">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 shadow-xl">
                View Live Tournaments
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl"
              >
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </AnimatedBackground>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tournament Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced timing systems and comprehensive flight management for the ultimate high flyer pigeon experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Live Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Real-time tournament results and rankings updated as flights progress with precision timing and
                  altitude tracking.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Fancier Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Comprehensive fancier profiles with their high flyer pigeons, flight statistics, and performance
                  history.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Flight Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Advanced time recording system tracking flight duration, altitude performance, and endurance
                  capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Flight Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Detailed flight pattern analysis and altitude information for each high flyer tournament event.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Background */}
      <AnimatedBackground images={statsImages} className="py-20 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Tournament Statistics</h2>
            <p className="text-xl text-blue-100">Join our growing community of high flyer pigeon enthusiasts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white mr-2" />
                <h3 className="text-5xl font-bold text-white">50+</h3>
              </div>
              <p className="text-blue-100 text-lg">Active Fanciers</p>
              <p className="text-blue-200 text-sm mt-2">
                Professional high flyer enthusiasts from Bewal and surrounding areas
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white mr-2" />
                <h3 className="text-5xl font-bold text-white">500+</h3>
              </div>
              <p className="text-blue-100 text-lg">High Flyer Pigeons</p>
              <p className="text-blue-200 text-sm mt-2">
                Champion birds with exceptional altitude and endurance records
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-white mr-2" />
                <h3 className="text-5xl font-bold text-white">25+</h3>
              </div>
              <p className="text-blue-100 text-lg">Tournaments Held</p>
              <p className="text-blue-200 text-sm mt-2">Exciting high flyer competitions throughout the year</p>
            </div>
          </div>
        </div>
      </AnimatedBackground>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most advanced and user-friendly high flyer pigeon management system in Pakistan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Precision Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                State-of-the-art timing systems ensure accurate flight duration and altitude tracking with precision for
                fair competition.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Traditional Standards</h3>
              <p className="text-gray-600 leading-relaxed">
                Following authentic Pakistani high flyer traditions with experienced judges and time-honored competition
                protocols.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a passionate community of high flyer enthusiasts sharing knowledge, breeding tips, and celebrating
                victories together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Join the Flight?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the excitement of competitive high flyer pigeon tournaments with our advanced platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tournaments">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                View Current Tournaments
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
