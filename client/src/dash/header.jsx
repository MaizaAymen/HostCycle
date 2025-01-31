import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppContent } from "../context/Appcontext"
import axios from "axios"
import { toast } from "react-toastify"
import { Menu, X } from "lucide-react"

const Aymen = () => {
  const navigate = useNavigate()
  const { userData, setIsLogin, setUserData } = useContext(AppContent)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownTimer, setDropdownTimer] = useState<NodeJS.Timeout | null>(null)

  const sendVerificationOTP = async () => {
    try {
      const { data } = await axios.post(
        "https://host-cycle-ji9x-aymens-projects-9ad69811.vercel.app/api/auth/sendVerifyOtp",
      )
      if (data.success) {
        toast.success(data.message)
        navigate("/EmailVerify")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      const { data } = await axios.post("https://host-cycle-ji9x-aymens-projects-9ad69811.vercel.app/api/auth/logout")
      if (data.success) {
        setIsLogin(false)
        setUserData(null)
        navigate("/Home")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleMouseEnter = () => {
    setShowDropdown(true)
    if (dropdownTimer) clearTimeout(dropdownTimer)
    setDropdownTimer(setTimeout(() => setShowDropdown(false), 1000))
  }

  const handleMouseLeave = () => {
    if (dropdownTimer) clearTimeout(dropdownTimer)
    setDropdownTimer(setTimeout(() => setShowDropdown(false), 1000))
  }

  useEffect(() => {
    return () => {
      if (dropdownTimer) clearTimeout(dropdownTimer)
    }
  }, [dropdownTimer])

  return (
    <div>
      <nav className="shadow-md py-4 px-4 sm:px-6 bg-white font-sans min-h-[70px] tracking-wide relative z-50">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full max-w-screen-xl mx-auto">
          <a href="javascript:void(0)" className="text-lg font-bold text-blue-500">
            HOSTCYCLE
          </a>

          <button
            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`${isMenuOpen ? "block" : "hidden"} lg:block w-full lg:w-auto`}>
            <ul className="lg:flex lg:items-center gap-x-5 space-y-3 lg:space-y-0 mt-4 lg:mt-0">
              <li className="border-b lg:border-b-0 py-3 lg:py-0 px-3">
                <a href="/Home" className="hover:text-blue-500 text-blue-500 font-bold block text-base">
                  Accueil
                </a>
              </li>
              <li className="border-b lg:border-b-0 py-3 lg:py-0 px-3">
                <a href="/Commerce" className="hover:text-blue-500 text-gray-600 font-bold block text-base">
                  Nouvelles
                </a>
              </li>

              {userData ? (
                <>
                  <li className="border-b lg:border-b-0 py-3 lg:py-0 px-3">
                    <a href="/Compte" className="hover:text-blue-500 text-gray-600 font-bold block text-base">
                      Compte
                    </a>
                  </li>
                  {userData.isAdmin && (
                    <li className="border-b lg:border-b-0 py-3 lg:py-0 px-3">
                      <a href="/Admin" className="hover:text-blue-500 text-gray-600 font-bold block text-base">
                        Dashboard
                      </a>
                    </li>
                  )}
                  <li className="relative">
                    <button
                      className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {userData.name[0].toUpperCase()}
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                        <ul className="py-2">
                          {!userData.isAcconuntVerified && (
                            <li onClick={sendVerificationOTP} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Verify Email
                            </li>
                          )}
                          <li onClick={logout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Logout
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 rounded-xl flex items-center"
                    onClick={() => navigate("/Login")}
                  >
                    Login
                    <img src="assets/arrow_icon.svg" alt="" className="ml-2 w-4 h-4" />
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Aymen

