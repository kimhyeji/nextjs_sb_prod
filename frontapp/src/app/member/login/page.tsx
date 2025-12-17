'use client'

import api from '@/src/utils/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [user, setUser] = useState({ username: '', password: '' })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await api
      .post('/members/login', user)
      .then(() => {
        alert('로그인 되었습니다')
        router.back()
      })
      .catch((err) => console.log(err + process.env.NEXT_PUBLIC_API_BASE_URL))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleLogout = async () => {
    await api
      .post('/members/logout')
      .then(() => {
        alert('로그아웃 되었습니다')
        router.push('/')
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <h4>로그인</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="아이디"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="비밀번호"
        />
        <input type="submit" value="로그인" />
      </form>

      <button onClick={handleLogout}>로그아웃</button>
    </>
  )
}
