"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../layouts/DashboardLayout"

function GetAppointment() {
  const userToken = localStorage.getItem("userToken")

  const [doctors, setDoctors] = useState([])
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        const data = await res.json()
        setDoctors(data)
      } catch (err) {
        setError("Failed to load doctors", err)
      }
    }
    fetchDoctors()
  }, [userToken])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Booking failed")
      }

      const result = await res.json()
      setMessage(result.message)
      setFormData({ doctorId: "", date: "", time: "", reason: "" })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-12 w-full h-full bg-white rounded-lg flex flex-col justify-center items-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 dark-color">Book an Appointment</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md sm:max-w-lg lg:max-w-xl">
          <div>
            <label className="block mb-1 font-medium">Select Doctor</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Reason (Optional)</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Describe your symptoms or reason..."
            />
          </div>

          <button type="submit" className="dark-bg white-color font-bold px-4 py-2 rounded hover:bg-blue-700 w-full">
            Book Appointment
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default GetAppointment
