"use client";
import { useState } from "react";
import PageLayout from "../components/PageLayout";

const nestMenu = [
  { label: "Saved listings", icon: "❤️" },
  { label: "Scheduled visits", icon: "📅" },
  { label: "Flatmate matches", icon: "👥" },
];
const nextMenu = [
  { label: "Job applications", icon: "💼" },
  { label: "My resume", icon: "📄" },
  { label: "My courses", icon: "📚" },
];
const accountMenu = [
  { label: "KYC verification", icon: "🪪", badge: "Pending" },
  { label: "Notifications", icon: "🔔" },
  { label: "Settings", icon: "⚙️" },
];

export default function UserProfile() {
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("Aditya Sharma");
  const [city, setCity] = useState("Bengaluru");
  const [persona, setPersona] = useState("Working professional");
  const [org, setOrg] = useState("Flipkart");

  return (
    <PageLayout>
      {/* Profile header */}
      <section className="relative mb-6 pt-2">
        <button
          onClick={() => setEditOpen(true)}
          className="absolute top-2 right-0 p-2 text-gray-400 hover:text-gray-600"
          aria-label="Edit profile"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-lg font-semibold text-[#1D9E75]">
            AS
          </div>
          <div>
            <h1 className="text-base font-medium text-gray-900">{name}</h1>
            <p className="text-xs text-gray-500">{persona}</p>
            <div className="flex gap-1.5 mt-1">
              <span className="text-[10px] font-medium text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-0.5 rounded-full">Nest found</span>
              <span className="text-[10px] font-medium text-[#534AB7] bg-[#534AB7]/10 px-2 py-0.5 rounded-full">Job seeker</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-3 gap-3 mb-6">
        {[
          { value: 12, label: "Saved nests" },
          { value: 5, label: "Job applies" },
          { value: 3, label: "Visits scheduled" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xl font-medium text-[#1D9E75]">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* My Nest menu */}
      <section className="mb-2">
        <p className="text-[11px] uppercase text-gray-400 tracking-wider px-1 pt-4 pb-2 font-medium">My Nest</p>
        <div className="bg-white rounded-xl overflow-hidden">
          {nestMenu.map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                i < nestMenu.length - 1 ? "border-b border-gray-200" : ""
              }`}
              style={{ borderBottomWidth: "0.5px" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-gray-800">{item.label}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* My Next menu */}
      <section className="mb-2">
        <p className="text-[11px] uppercase text-gray-400 tracking-wider px-1 pt-4 pb-2 font-medium">My Next</p>
        <div className="bg-white rounded-xl overflow-hidden">
          {nextMenu.map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                i < nextMenu.length - 1 ? "border-b border-gray-200" : ""
              }`}
              style={{ borderBottomWidth: "0.5px" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-gray-800">{item.label}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* Account menu */}
      <section className="mb-6">
        <p className="text-[11px] uppercase text-gray-400 tracking-wider px-1 pt-4 pb-2 font-medium">Account</p>
        <div className="bg-white rounded-xl overflow-hidden">
          {accountMenu.map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                i < accountMenu.length - 1 ? "border-b border-gray-200" : ""
              }`}
              style={{ borderBottomWidth: "0.5px" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-gray-800">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* Log out */}
      <button className="w-full py-2.5 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors mb-8">
        Log out
      </button>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30" onClick={() => setEditOpen(false)}>
          <div
            className="bg-white rounded-xl w-[90%] max-w-[400px] min-h-[400px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-medium text-gray-900 mb-4">Edit profile</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                  style={{ borderWidth: "0.5px" }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                  style={{ borderWidth: "0.5px" }}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Persona</label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75] bg-white"
                  style={{ borderWidth: "0.5px" }}
                >
                  <option>Student</option>
                  <option>Fresher</option>
                  <option>Working professional</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">College or Company</label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1D9E75]"
                  style={{ borderWidth: "0.5px" }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setEditOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </button>
              <button
                onClick={() => setEditOpen(false)}
                className="px-6 py-2 text-sm font-medium text-white bg-[#1D9E75] rounded-lg hover:bg-[#178c68] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
