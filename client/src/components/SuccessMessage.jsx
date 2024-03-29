import { useState, useEffect } from "react"

const SuccessMessage = ({ message, setShowSuccess }) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (message) {
            setVisible(true)
            const timer = setTimeout(() => {
                setVisible(false)
                setShowSuccess(false)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [setShowSuccess])

    return (
        <div>
            {visible && (
                <div className="success-message text-center mx-auto font-bold py-2">
                    <p>{message}</p>
                </div>
            )}
        </div>
    )
}

export default SuccessMessage
