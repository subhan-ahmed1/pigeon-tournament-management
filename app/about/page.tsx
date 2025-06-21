import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Clock, Target, Heart, Shield, Globe, Award } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"

export default function AboutPage() {
  const heroImages = ["/images/united-pigeon-club-logo.jpg"]

  const guideImages = ["/images/united-pigeon-club-logo.jpg"]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <AnimatedBackground images={heroImages} className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">About High Flyer Pigeons</h1>
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed drop-shadow-md">
            Discover the ancient Pakistani tradition that combines endurance, altitude mastery, and the incredible bond
            between fanciers and their magnificent high flying pigeons
          </p>
        </div>
      </AnimatedBackground>

      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {/* Introduction */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Heart className="w-6 h-6 mr-3" />
                Welcome to United Pigeon Club Bewal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                High flyer pigeon keeping is one of the most cherished traditions in Pakistan, dating back centuries.
                Our United Pigeon Club Bewal brings together passionate fanciers from across the region to compete in
                thrilling high altitude competitions. Each flight tests the endurance, altitude capability, and
                remarkable aerial skills of these extraordinary Pakistani high flyer pigeons, showcasing the incredible
                bond between fanciers and their prized birds that can soar to breathtaking heights and stay airborne for
                hours.
              </p>
            </CardContent>
          </Card>

          {/* How It Works Section with Animated Background */}
          <div className="relative rounded-2xl overflow-hidden">
            <AnimatedBackground images={guideImages} className="min-h-[600px]">
              <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-none m-8">
                <CardHeader>
                  <CardTitle className="text-3xl text-center text-gray-900 mb-8">
                    How Our High Flyer Tournaments Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">Fancier Registration</h3>
                          <p className="text-gray-600">
                            Each fancier can register up to 11 of their finest high flyer pigeons for competition,
                            ensuring fair participation across all experience levels.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">Flight Release</h3>
                          <p className="text-gray-600">
                            All high flyer pigeons are released simultaneously from the designated point, beginning
                            their spectacular ascent to incredible altitudes with precision timing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">Endurance Tracking</h3>
                          <p className="text-gray-600">
                            Advanced timing systems record flight duration and altitude performance, tracking each
                            pigeon's endurance and aerial mastery with precision.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">Championship Results</h3>
                          <p className="text-gray-600">
                            Winners are determined by the best combined flight duration and altitude performance,
                            celebrating both endurance and aerial excellence.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedBackground>
          </div>

          {/* Rules Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Shield className="w-6 h-6 mr-3" />
                Tournament Rules & Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Each fancier may enter up to 11 high flyer pigeons per tournament
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      All pigeons must be properly registered Pakistani high flyer breeds
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Flight durations typically range from 2 to 8 hours depending on tournament category
                    </span>
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Winners determined by best combined flight time and altitude performance
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Weather conditions may result in flight postponement for pigeon safety
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      All competitions follow traditional Pakistani high flyer standards
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Heritage Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Globe className="w-6 h-6 mr-3" />
                The Heritage of Pakistani High Flyer Pigeons
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Ancient Tradition</h3>
                  <p className="text-gray-600 text-sm">
                    Dating back centuries in Pakistan, high flyer pigeon keeping has been a cherished tradition passed
                    down through generations.
                  </p>
                </div>
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Cultural Heritage</h3>
                  <p className="text-gray-600 text-sm">
                    Deeply rooted in Pakistani culture, especially in Punjab region, with dedicated communities in
                    cities like Bewal.
                  </p>
                </div>
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Passionate Bond</h3>
                  <p className="text-gray-600 text-sm">
                    The unique relationship between fancier and high flyer creates an unbreakable bond of dedication and
                    pride.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">Tournament Director</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Email: director@unitepigeonclub.com
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Phone: +92-300-1234567
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Available: Monday - Friday, 9 AM - 5 PM
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">Registration Office</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Email: registration@unitepigeonclub.com
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Phone: +92-300-1234568
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Available: Tuesday - Saturday, 8 AM - 6 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
