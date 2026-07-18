import { useState, useEffect } from 'react'
import { getDB } from '../db'

let globalReady = false

export default function useDB() {
  const [dbReady, setDbReady] = useState(globalReady)

  useEffect(() => {
    if (globalReady) return
    getDB().then(() => {
      globalReady = true
      setDbReady(true)
    })
  }, [])

  return { dbReady }
}
