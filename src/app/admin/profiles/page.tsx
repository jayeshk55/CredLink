"use client"
import "./AdminProfile.css"
import { useState } from "react"
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Users } from "lucide-react"

interface Profile {
  id: number
  name: string
  designation: string
  company: string
  city: string
  category: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
  views: number
  isPromoted: boolean
}

const profiles: Profile[] = [
  {
    id: 1,
    name: "John Doe",
    designation: "Full Stack Developer",
    company: "Tech Corp",
    city: "New York",
    category: "Technology",
    status: "pending",
    submittedDate: "2024-01-20",
    views: 0,
    isPromoted: false,
  },
  {
    id: 2,
    name: "Jane Smith",
    designation: "Digital Marketing Expert",
    company: "Marketing Pro",
    city: "Los Angeles",
    category: "Marketing",
    status: "approved",
    submittedDate: "2024-01-18",
    views: 1250,
    isPromoted: true,
  },
  {
    id: 3,
    name: "Mike Johnson",
    designation: "UI/UX Designer",
    company: "Design Studio",
    city: "San Francisco",
    category: "Design",
    status: "rejected",
    submittedDate: "2024-01-15",
    views: 890,
    isPromoted: false,
  },
]

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || profile.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleApprove = (profileId: number) => {
    //console.log("Approving profile:", profileId)
  }

  const handleReject = (profileId: number) => {
    //console.log("Rejecting profile:", profileId)
  }

  return (
    <div className="admin-profile-page min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-sky-50">
      <div className="profile-container space-y-10 text-sm text-gray-700">

        {/* Header */}
        <div className="relative rounded-2xl shadow-xl p-8 bg-white/70 backdrop-blur-md border border-white/60 overflow-hidden">
          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-r from-indigo-200/20 via-rose-200/20 to-sky-200/20" />
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-6 mb-2">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center shadow">
                  <Users className="w-8 h-8 text-indigo-700" />
                </div>
                <div className="text-center sm:text-left space-y-3">
                  <h1 className="text-3xl font-bold text-slate-900">Profile Management</h1>
                  <p className="text-slate-600 text-base">Review and manage user profiles on the platform</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">{profiles.length} Total Profiles</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full sm:w-auto justify-end">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition-all font-semibold shadow flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Bulk Approve
                </button>
                <button className="bg-white hover:bg-slate-50 text-slate-800 px-5 py-3 rounded-xl transition-all font-semibold border border-slate-200 shadow flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-700" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="h-32 rounded-xl shadow-md bg-white p-6 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-indigo-600/10 rounded-full flex items-center justify-center shadow">
              <Clock className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="text-xl font-bold text-gray-900">{profiles.filter(p => p.status === "pending").length}</p>
            <p className="text-sm text-gray-500">Pending Review</p>
          </div>
          <div className="h-32 rounded-xl shadow-md bg-white p-6 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-indigo-600/10 rounded-full flex items-center justify-center shadow">
              <CheckCircle className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="text-xl font-bold text-gray-900">{profiles.filter(p => p.status === "approved").length}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
          <div className="h-32 rounded-xl shadow-md bg-white p-6 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-indigo-600/10 rounded-full flex items-center justify-center shadow">
              <XCircle className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="text-xl font-bold text-gray-900">{profiles.filter(p => p.status === "rejected").length}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
          <div className="h-32 rounded-xl shadow-md bg-white p-6 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 bg-indigo-600/10 rounded-full flex items-center justify-center shadow">
              <Eye className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {profiles.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Total Views</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 md:p-8 relative overflow-visible">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 h-5 w-5" />
              <input
                type="text"
                placeholder="Search profiles by name, designation, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-base"
              />
            </div>
            <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-end">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 md:px-6 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium w-full sm:w-auto min-w-0"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="flex items-center px-4 md:px-6 py-3 md:py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2 text-indigo-700" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="profile-card relative bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group w-full h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-8 flex-col sm:flex-row gap-4">
                <div className="flex items-center sm:flex-row flex-col space-x-0 sm:space-x-4 space-y-3 sm:space-y-0">
                  <div className="h-[50px] w-[50px] bg-gradient-to-br from-indigo-500 to-sky-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <span className="text-lg font-bold text-white">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-gray-900 break-words">{profile.name}</h3>
                    <p className="text-sm text-gray-600 font-medium break-words">{profile.designation}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">Company</p>
                    <p className="text-sm text-gray-900 font-semibold break-words">{profile.company}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">Location</p>
                    <p className="text-sm text-gray-900 font-semibold break-words">{profile.city}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">Category</p>
                    <p className="text-sm text-gray-900 font-semibold break-words">{profile.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">Views</p>
                    <p className="text-sm text-gray-900 font-semibold">{profile.views.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-gray-600 font-medium">Submitted</p>
                    <p className="text-sm text-gray-500 break-words">{profile.submittedDate}</p>
                  </div>
                </div>
              </div>

              {profile.isPromoted && (
                <div className="mb-5 flex justify-center sm:justify-start">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                    ⭐ Promoted
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleApprove(profile.id)}
                  title="Approve profile"
                  className="h-[42px] w-full bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl text-sm font-semibold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={profile.status === "approved"}
                >
                  <CheckCircle className="h-4 w-4 inline mr-2 align-text-bottom" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(profile.id)}
                  title="Reject profile"
                  className="h-[42px] w-full bg-rose-600 hover:bg-rose-700 text-white px-4 rounded-xl text-sm font-semibold shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={profile.status === "rejected"}
                >
                  <XCircle className="h-4 w-4 inline mr-2 align-text-bottom" />
                  Reject
                </button>
              </div>

              <div className="flex justify-center mt-auto">
                <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-full text-sm hover:bg-slate-50 transition-all">
                  <Eye className="h-4 w-4 mr-2 text-indigo-700" />
                  Preview
                </button>
              </div>

              <span
                className={`absolute top-4 right-4 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                  profile.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : profile.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
