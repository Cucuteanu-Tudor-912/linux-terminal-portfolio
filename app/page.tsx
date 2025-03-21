'use client'

import React, { useState, useEffect, useRef } from 'react'

type FileSystem = {
  [key: string]: string | FileSystem
}

const fileSystem: FileSystem = {
  'about.txt': 'Hi, I\'m Tudor. A cyber-security enthusiast and (learning) developer.',
  projects: {
    'project1.txt': 'Project 1: This personal portfolio!\nIt was done using Next.js and Tailwind. If you want to see the source code, go to my Github!',
    'project2.txt': 'Project 2: A network vulnerability scanner\n\nUsing python to scan the WLAN,\n then give out basic system info based on response packages.\nUsing Vulners-API, we can check each device\'s weak points!',
  },
  'education.txt':'October 2024 - Present\nBabes-Bolyai University, Cluj-Napoca\nBachelor\'s in Computer Science' ,
  experience:{
    'SC Faoxim SRL.txt':'March 2021 - Present\nPloiesti, Prahova\nFaoxim is a national oxygen supplier for a wide range of companies. \nI work in assuring network and individual system security,\n maintaining the already existing digital infrastructure and implementing new automation methods.',
  },
  'skills.txt': ' Three.JS - Beginner\n C++ - Beginner\n C - Beginner\n Java - Intermediate\n Next.js + React - Intermediate\n Bash - Intermediate \n NASM - Advanced \n Python - Advanced\n ',
  'contact.txt': 'Email: cucuteanutudor@gmail.com\nLinkedIn: Cucuteanu Tudor\nTryHackMe:Cucuteanu-Tudor',
}

const asciiArt = `
████████╗██╗   ██╗██████╗  ██████╗ ██████╗     
╚══██╔══╝██║   ██║██╔══██╗██╔═══██╗██╔══██╗    
   ██║   ██║   ██║██║  ██║██║   ██║██████╔╝    
   ██║   ██║   ██║██║  ██║██║   ██║██╔══██╗    
   ██║   ╚██████╔╝██████╔╝╚██████╔╝██║  ██║    
   ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   
   `

const commands = [
  'ls - List directory contents',
  'cd [dir] - Change directory',
  'cat [file] - Display file contents',
  'help - Show available commands',
  'clear - Clear the terminal',
]

const TerminalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-500"
  >
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
)

export default function Home() {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [output, setOutput] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingText, setLoadingText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const loadingAnimation = ['|', '/', '-', '\\']
    let i = 0
    const interval = setInterval(() => {
      setLoadingText(`Loading${'.'.repeat(i % 4)}`)
      i++
    }, 200)

    const typeFullMessage = async () => {
      await new Promise(resolve => setTimeout(resolve, 3000)) // Wait for 3 seconds
      clearInterval(interval)
      setLoading(false)
      setLoadingText('')
      
      const fullMessage = `${asciiArt}\n\nWelcome to Tudor's Portfolio Terminal\n\nAvailable commands:\n${commands.join('\n')}`
      setOutput(fullMessage.split('\n'))
    }

    typeFullMessage()

    return () => clearInterval(interval)
  }, [])

  const getCurrentDir = () => {
    let current: FileSystem | string = fileSystem
    for (const dir of currentPath) {
      if (typeof current === 'object' && dir in current) {
        current = current[dir]
      } else {
        return null
      }
    }
    return current
  }

  const handleCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ')
    const currentDir = getCurrentDir()

    switch (command) {
      case 'ls':
        if (typeof currentDir === 'object') {
          const dirContents = Object.keys(currentDir).map((item) => {
            const isDirectory = typeof currentDir[item] === "object"
            return isDirectory
              ? `<span class="text-yellow-400">${item}/</span>`
              : `<span class="text-green-300">${item}</span>`
          })
          setOutput((prev) => [...prev, `> ${cmd}`, ...dirContents])
        } else {
          setOutput(prev => [...prev, `> ${cmd}`, 'Not a directory'])
        }
        break
      case 'cd':
        if (args[0] === '..') {
          setCurrentPath(currentPath.slice(0, -1))
        } else if (typeof currentDir === 'object' && args[0] in currentDir) {
          setCurrentPath([...currentPath, args[0]])
        } else {
          setOutput(prev => [...prev, `> ${cmd}`, 'Directory not found'])
        }
        break
      case 'cat':
        if (typeof currentDir === 'object' && args[0] in currentDir && typeof currentDir[args[0]] === 'string') {
          setOutput(prev => [...prev, `> ${cmd}`, currentDir[args[0]] as string])
        } else {
          setOutput(prev => [...prev, `> ${cmd}`, 'File not found'])
        }
        break
      case 'help':
        setOutput(prev => [...prev, `> ${cmd}`, ...commands])
        break
      case 'clear':
        setOutput([])
        break
      default:
        setOutput(prev => [...prev, `> ${cmd}`, 'Command not found'])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCommand(input)
    setInput('')
  }

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 font-mono">
      <div className="w-[80%] mx-auto">
        <div className="flex items-center mb-4">
          <TerminalIcon />
          <h1 className="text-2xl font-bold ml-2">Tudor's Portfolio Terminal</h1>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-green-500">
          <div className="mb-4 overflow-x-auto whitespace-pre">
          {loading ? (
              <div>{loadingText}</div>
            ) : (
              output.map((line, index) => <div key={index} dangerouslySetInnerHTML={{ __html: line }} />)
            )}
          </div>
          {!loading && (
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="mr-2 text-green-300">
                {currentPath.length > 0 ? `/${currentPath.join('/')}` : ''}$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-transparent outline-none text-green-300"
                autoFocus
              />
            </form>
          )}
        </div>
      </div>
    </div>
  )
}