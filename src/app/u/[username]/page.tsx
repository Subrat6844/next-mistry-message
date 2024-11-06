"use client"
import { useParams } from 'next/navigation'
import React from 'react'

export default function page() {
   const param =  useParams<{ username: string }>()
  return (
    <div>{param.username}</div>
  )
}
