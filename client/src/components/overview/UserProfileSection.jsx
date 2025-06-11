import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaUser,
  FaStethoscope,
  FaEdit,
} from "react-icons/fa";

export const UserProfileSection = ({ user, onEditClick }) => {
  return (
    <div className="rounded-xl border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold dark-color flex items-center gap-2">
            Overview
          </h2>
          <button
            onClick={onEditClick}
            className="flex items-center font-semibold gap-2 px-3 py-1.5 text-sm dark-bg text-white rounded-lg"
          >
            <FaEdit className="w-3 h-3" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="p-3 mb-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start mx-5 mt-2">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=006a71&color=ffffff&size=128&bold=true`}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mt-4 text-center lg:text-left">
              <h3 className="text-2xl font-bold dark-color">{user.name}</h3>
            </div>
          </div>

          {/* Details Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email Address
                    </p>
                    <p className="font-medium text-gray-900 truncate">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Phone Number
                    </p>
                    <p className="font-medium text-gray-900">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FaBirthdayCake className="text-yellow-600 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Age
                    </p>
                    <p className="font-medium text-gray-900">
                      {user.age || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <FaVenusMars className="text-pink-600 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Gender
                    </p>
                    <p className="font-medium text-gray-900">
                      {user.gender || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaUser className="text-purple-600 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Role
                    </p>
                    <p className="font-medium text-gray-900">
                      {user.role || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {user.role === "Doctor" && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FaStethoscope className="text-red-600 w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Specialization
                      </p>
                      <p className="font-medium text-gray-900">
                        {user.specialization || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
