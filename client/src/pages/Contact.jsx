import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"

import LoadingSpinner from '../components/LoadingSpinner'

import { ToastContainer, toast } from "react-toastify"

const initialFormData = {
    subject: 'New WhiskeyHabits Message',
    firstName: '',
    lastName: '',
    email: '',
    message: ''
}

function Contact() {
    const [formData, setFormData] = useState(initialFormData)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        try {
            const response = await axios.post('https://mail.huntermuratore.com/muratoreh@gmail.com', formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })

            if (response.status === 200) {
                navigate('/success')
                setFormData({
                    ...initialFormData
                })
                setLoading(false)
            } else {
                toast.error("Failed to send message. Please try sending message again.")
                setLoading(false)
            }

        } catch (error) {
            console.error('An error occurred while sending the message', error)
            toast.error("Failed to send message. Please try sending message again.")
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    
    if (loading) return <LoadingSpinner />

    return (
        <section className="contact flex flex-col justify-center mx-auto mt-20">
            <h2 className="text-center text-2xl font-bold mt-10">Contact Me</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto mt-10" >
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase text-xs font-bold mb-2">
                            First Name
                        </label>
                        <input className="w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 focus:bg-white" value={formData.firstName} onChange={handleInputChange} type="text" name="firstName" placeholder="George" required />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-xs font-bold mb-2">
                            Last Name
                        </label>
                        <input className="w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 focus:bg-white" value={formData.lastName} onChange={handleInputChange} type="text" name="lastName" placeholder="Stagg" required />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-xs font-bold mb-2">
                            Email
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 focus:bg-white" value={formData.email} onChange={handleInputChange} type="email" name="email" placeholder="GeorgeTStagg@gts.com" required />
                    </div>
                </div>
                <div className="flex flex-wrap mb-6">
                    <label className="block uppercase tracking-wide text-xs font-bold mb-2">Message</label>
                    <textarea id="message" rows="4" className="block p-2.5 w-full text-sm rounded-lg bg-gray-50" value={formData.message} onChange={handleInputChange} name="message" placeholder="Type your message here..." required></textarea>
                </div>

                <ToastContainer />

                <div className="flex justify-end">
                    <button className="my-btn text-sm py-2 px-3 rounded" type="submit">Send Message</button>
                </div>
            </form>
        </section>
    )
}

export default Contact