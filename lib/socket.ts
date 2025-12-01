"use client"

import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export function initializeSocket(token: string): Socket {
  if (socket) {
    return socket
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

  socket = io(apiUrl, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on("connect", () => {
    console.log("[v0] Socket conectado:", socket?.id)
  })

  socket.on("disconnect", () => {
    console.log("[v0] Socket desconectado")
  })

  socket.on("error", (error) => {
    console.error("[v0] Erro de socket:", error)
  })

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
