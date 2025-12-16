'use client'

import api from '@/src/utils/api'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ArticleEdit() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState({ subject: '', content: '' })
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const getArticle = async () => {
    return await api
      .get(`/articles/${params.id}`)
      .then((res) => res.data.data.article)
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ['article', id],
    queryFn: getArticle,
  })

  useEffect(() => {
    if (data) {
      setArticle({ subject: data.subject, content: data.content })
    }
  }, [data])

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (patchArticle) => api.patch(`/articles/${id}`, patchArticle),
    onSuccess: () => {
      alert('success')
      queryClient.invalidateQueries({ queryKey: ['article', id] })
      router.push(`/article/${id}`)
    },
    onError: (err: any) => {
      if (err?.response?.status == 401) {
        alert('로그인 후 이용해주세요')
        router.push('/member/login')
        return
      }
      alert('fail')
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    mutation.mutate(article)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setArticle({ ...article, [name]: value })
  }

  if (error) console.log(error)

  if (isLoading) <>Loading....</>

  if (data) {
    return (
      <>
        <h4>게시물 수정</h4>
        <form onSubmit={handleSubmit}>
          <label>
            제목 :
            <input
              type="text"
              name="subject"
              onChange={handleChange}
              value={article.subject}
            />
          </label>
          <br />
          <label>
            내용 :
            <input
              type="text"
              name="content"
              onChange={handleChange}
              value={article.content}
            />
          </label>
          <input type="submit" value="수정" />
        </form>
      </>
    )
  }
}
