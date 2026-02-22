import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Eye, MapPin, Plus, Share2, Trash2 } from 'lucide-react';

export default function SavedPlansPage () {
  const savedTrips = [
    {
      id: 1,
      destination: 'Jaipur',
      state: 'Rajasthan',
      image: 'https://images.unsplash.com/photo-1687372985044-a68b5fe7bd06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWlwdXIlMjBwaW5rJTIwY2l0eSUyMEluZGlhfGVufDF8fHx8MTc3MTQ4NzMxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      days: 3,
      adults: 2,
      tier: 'Standard',
      status: 'upcoming',
      plannedDate: 'April 2026',
      budget: '₹8,500',
    },
    {
      id: 2,
      destination: 'Goa',
      state: 'Goa',
      image: 'https://images.unsplash.com/photo-1725990075468-6af40634e012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHb2ElMjBiZWFjaCUyMEluZGlhJTIwcGFsbXxlbnwxfHx8fDE3NzE0ODczMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      days: 5,
      adults: 2,
      tier: 'Luxury',
      status: 'draft',
      plannedDate: 'Not scheduled',
      budget: '₹18,000',
    },
    {
      id: 3,
      destination: 'Kerala',
      state: 'Kerala',
      image: 'https://images.unsplash.com/photo-1694783079572-eaeff4bee78b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBiYWNrd2F0ZXJzJTIwSW5kaWF8ZW58MXx8fHwxNzcxNDg3MzE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      days: 7,
      adults: 4,
      tier: 'Standard',
      status: 'upcoming',
      plannedDate: 'June 2026',
      budget: '₹12,500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Navbar/>

      <div className="pt-[72px] min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB] py-8 px-8">
          <div className="max-w-[1440px] mx-auto flex justify-between items-start">
            <div>
              <h1
                className="text-[#111111] text-[32px] mb-2"
                style={{ fontFamily: '\'Playfair Display\', serif', fontWeight: 700 }}
              >
                My Saved Trips
              </h1>
              <p
                className="text-[#6B7280] text-[16px]"
                style={{ fontFamily: '\'DM Sans\', sans-serif' }}
              >
                {savedTrips.length} trips saved
              </p>
            </div>
            <Link to="/planner">
              <button
                className="bg-[#E8650A] text-white px-6 py-3 hover:bg-[#d45a09] transition-colors flex items-center gap-2"
                style={{
                  borderRadius: '999px',
                  fontFamily: '\'DM Sans\', sans-serif',
                  fontWeight: 600,
                }}
              >
                <Plus size={18}/>
                Plan New Trip
              </button>
            </Link>
          </div>
        </div>

        {/* Trips Grid */}
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white overflow-hidden transition-all hover:shadow-xl group"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0px 2px 20px rgba(0,0,0,0.06)',
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1.5 backdrop-blur-sm ${
                      trip.status === 'upcoming'
                        ? 'bg-[#DCFCE7]/90 text-[#16A34A]'
                        : 'bg-white/90 text-[#6B7280]'
                    }`}
                    style={{
                      borderRadius: '999px',
                      fontFamily: '\'DM Sans\', sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {trip.status}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h2
                    className="text-[#111111] text-[20px] mb-2"
                    style={{ fontFamily: '\'Playfair Display\', serif', fontWeight: 600 }}
                  >
                    {trip.destination}
                  </h2>
                  <p
                    className="text-[#6B7280] text-[14px] mb-4 flex items-center gap-1"
                    style={{ fontFamily: '\'DM Sans\', sans-serif' }}
                  >
                    <MapPin size={14}/>
                    {trip.state} · {trip.days} Days · {trip.adults} Adults · {trip.tier}
                  </p>
                  <p
                    className="text-[#9CA3AF] text-[13px] mb-3"
                    style={{ fontFamily: '\'DM Sans\', sans-serif' }}
                  >
                    Planned for: {trip.plannedDate}
                  </p>
                  <p
                    className="text-[#E8650A] text-[16px] mb-4"
                    style={{ fontFamily: '\'DM Mono\', monospace', fontWeight: 600 }}
                  >
                    Est. {trip.budget}/person
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link to="/results" className="flex-1">
                      <button
                        className="w-full bg-[#E8650A] text-white py-2.5 hover:bg-[#d45a09] transition-colors flex items-center justify-center gap-2"
                        style={{
                          borderRadius: '999px',
                          fontFamily: '\'DM Sans\', sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                        }}
                      >
                        <Eye size={16}/>
                        View Plan
                      </button>
                    </Link>
                    <button
                      className="w-10 h-10 flex items-center justify-center border border-[#E5E7EB] hover:border-[#E8650A] hover:bg-[#FDF0E6] transition-colors"
                      style={{ borderRadius: '999px' }}
                      title="Share"
                    >
                      <Share2 size={16} className="text-[#6B7280]"/>
                    </button>
                    <button
                      className="w-10 h-10 flex items-center justify-center border border-[#E5E7EB] hover:border-red-500 hover:bg-red-50 transition-colors"
                      style={{ borderRadius: '999px' }}
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-[#6B7280]"/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
