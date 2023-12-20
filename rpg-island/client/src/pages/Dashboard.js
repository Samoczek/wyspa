import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        window.location.reload()
    }

    return (
        <div>
            <i className="log-out-button" onClick={logout}> x </i>
        </div>
    )

}
export default Dashboard