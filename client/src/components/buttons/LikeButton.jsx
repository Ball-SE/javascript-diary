import { useEffect, useState } from "react"
import happyLight from "../../assets/images/happy_light.png"
import { AlertDialog } from "../alert/AlertDialog"

export function LikeButton({ post, onChange }) {
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(post?.likes_count || 0)
    const [pending, setPending] = useState(false)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'

    const isAuthenticated = Boolean(localStorage.getItem('token'))

    useEffect(() => {
        const fetchLikeState = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/posts/${post.id}/likes`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
                })
                const data = await res.json()
                if (res.ok) {
                    setIsLiked(Boolean(data.liked))
                    const count = data.likesCount ?? 0
                    setLikesCount(count)
                    onChange?.({ liked: Boolean(data.liked), likesCount: count })
                }
            } catch {
                // ignore
            }
        }
        if (post?.id) fetchLikeState()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post?.id])

    const handleToggleLike = async () => {
        if (!post?.id || pending) return
        setPending(true)

        const prevLiked = isLiked
        const prevCount = likesCount
        const nextLiked = !prevLiked
        const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1)
        setIsLiked(nextLiked)
        setLikesCount(nextCount)
        onChange?.({ liked: nextLiked, likesCount: nextCount })
        try {
            const res = await fetch(`${API_BASE_URL}/posts/${post.id}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
            })
            const data = await res.json()
            if (res.ok) {
                const finalLiked = Boolean(data.liked)
                const finalCount = typeof data.likesCount === 'number' ? data.likesCount : nextCount
                setIsLiked(finalLiked)
                setLikesCount(finalCount)
                onChange?.({ liked: finalLiked, likesCount: finalCount })
            } else {
                // rollback
                setIsLiked(prevLiked)
                setLikesCount(prevCount)
                onChange?.({ liked: prevLiked, likesCount: prevCount })
            }
        } catch {
            setIsLiked(prevLiked)
            setLikesCount(prevCount)
            onChange?.({ liked: prevLiked, likesCount: prevCount })
        } finally {
            setPending(false)
        }
    }

    const ButtonView = (
        <button 
            type="button"
            onClick={isAuthenticated ? handleToggleLike : undefined}
            disabled={pending}
            className={"bg-white border border-[#75716B] text-[#26231E] px-4 py-2 rounded-full flex items-center hover:bg-gray-50 transition-colors duration-200 shadow-sm disabled:opacity-50"}
        >
            <img src={happyLight} alt="Like" className="w-5 h-5 mr-3" />
            <span className="text-base font-medium">
                {likesCount}
            </span>
        </button>
    )
    
    if (!isAuthenticated) {
        return <AlertDialog trigger={ButtonView} />
    }

    return ButtonView
}