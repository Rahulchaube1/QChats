import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import {
  MessageSquare,
  Users,
  QrCode,
  Settings,
  Search,
  Plus,
  ArrowLeft,
  Send,
  Paperclip,
  Mic,
  MoreVertical,
  Phone,
  Video,
  ShieldCheck,
  Check,
  CheckCheck,
  Share2,
  Copy,
  Moon,
  Sun,
  Wifi,
  Radio,
  Lock,
  ChevronRight,
  Info,
  CheckCircle2,
  X,
  Camera,
  Download,
  Image as ImageIcon,
  FileText,
  MapPin,
  User,
  BarChart2,
  Play,
  Pause,
  Bell,
  Key,
  Database,
  HelpCircle,
  Palette,
  Eye,
  Smile,
  Trash2,
  Sliders,
  Globe,
  RefreshCw,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  Volume2,
  VolumeX,
  MicOff,
  Circle,
  Network,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react'

interface Message {
  id: string
  sender: 'me' | 'peer' | 'system'
  text?: string
  time: string
  status?: 'sent' | 'delivered' | 'read'
  type?: 'text' | 'image' | 'audio' | 'location' | 'poll'
  mediaUrl?: string
  mediaCaption?: string
  audioDuration?: string
  reaction?: string
  pollData?: {
    question: string
    options: { text: string; votes: number }[]
    userVotedIndex?: number
  }
}

interface Conversation {
  id: string
  name: string
  type: 'one-to-one' | 'group'
  avatarColor: string
  avatarInitials: string
  avatarImage?: string
  lastMessage: string
  lastTime: string
  unreadCount: number
  isOnline: boolean
  transport: 'BLE Mesh' | 'Local Wi-Fi' | 'Tor Swarm' | 'Dual Mesh'
  messages: Message[]
}

interface CallRecord {
  id: string
  name: string
  avatarColor: string
  avatarInitials: string
  type: 'incoming' | 'outgoing' | 'missed'
  callType: 'audio' | 'video'
  time: string
}

interface StatusItem {
  id: string
  name: string
  time: string
  avatarColor: string
  avatarInitials: string
  avatarImage?: string
  hasUnviewed: boolean
  caption?: string
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Berty / QChats Mesh',
    type: 'group',
    avatarColor: 'from-violet-600 to-indigo-600',
    avatarInitials: 'QC',
    lastMessage: 'Mesh relay confirmed: 4 peers discovered via BLE',
    lastTime: '10:42 AM',
    unreadCount: 2,
    isOnline: true,
    transport: 'Dual Mesh',
    messages: [
      {
        id: 'm-sys-1',
        sender: 'system',
        text: '🔒 End-to-end encrypted mesh group created using libp2p & Berty Protocol.',
        time: '10:30 AM'
      },
      {
        id: 'm-1',
        sender: 'peer',
        text: 'Hello from the local mesh! No internet or cell towers needed here.',
        time: '10:38 AM'
      },
      {
        id: 'm-poll-1',
        sender: 'peer',
        type: 'poll',
        time: '10:40 AM',
        pollData: {
          question: 'Which radio frequency should we reserve for disaster relief?',
          options: [
            { text: '2.4 GHz BLE Mesh (Low Power)', votes: 6 },
            { text: '5 GHz Wi-Fi Direct (High Throughput)', votes: 3 },
            { text: 'Sub-GHz LoRa / P2P Relay', votes: 8 }
          ]
        }
      },
      {
        id: 'm-2',
        sender: 'peer',
        text: 'Mesh relay confirmed: 4 peers discovered via BLE',
        time: '10:42 AM',
        reaction: '👍'
      }
    ]
  },
  {
    id: 'conv-2',
    name: 'Alice (Field Medic)',
    type: 'one-to-one',
    avatarColor: 'from-emerald-500 to-teal-700',
    avatarInitials: 'AL',
    lastMessage: 'Shared medical supply inventory off-grid.',
    lastTime: '09:15 AM',
    unreadCount: 1,
    isOnline: true,
    transport: 'BLE Mesh',
    messages: [
      {
        id: 'm-sys-2',
        sender: 'system',
        text: 'Direct P2P session established with Alice. Verification key: 8f9b...3c12',
        time: '09:00 AM'
      },
      {
        id: 'm-3',
        sender: 'me',
        text: 'Alice, how is the direct peer connection on your end?',
        time: '09:12 AM',
        status: 'read'
      },
      {
        id: 'm-4',
        sender: 'peer',
        type: 'audio',
        audioDuration: '0:18',
        time: '09:14 AM',
        reaction: '❤️'
      },
      {
        id: 'm-5',
        sender: 'peer',
        text: 'Shared medical supply inventory off-grid.',
        time: '09:15 AM'
      }
    ]
  },
  {
    id: 'conv-3',
    name: 'Bob (Search & Rescue)',
    type: 'one-to-one',
    avatarColor: 'from-amber-500 to-orange-600',
    avatarInitials: 'BO',
    lastMessage: 'Coordinates synced via Bluetooth hop.',
    lastTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    transport: 'Local Wi-Fi',
    messages: [
      {
        id: 'm-sys-3',
        sender: 'system',
        text: 'Contact verified via QR exchange.',
        time: 'Yesterday'
      },
      {
        id: 'm-6',
        sender: 'peer',
        type: 'location',
        text: '📍 Lat: 37.7749° N, Long: 122.4194° W (Basecamp Alpha)',
        time: 'Yesterday'
      },
      {
        id: 'm-7',
        sender: 'peer',
        text: 'Coordinates synced via Bluetooth hop.',
        time: 'Yesterday'
      },
      {
        id: 'm-8',
        sender: 'me',
        text: 'Acknowledged. Stay safe on the ridge.',
        time: 'Yesterday',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-4',
    name: 'Neighborhood Watch Group',
    type: 'group',
    avatarColor: 'from-blue-600 to-cyan-700',
    avatarInitials: 'NW',
    lastMessage: 'Power grid is still offline, relying on QChats mesh relay.',
    lastTime: 'Oct 23',
    unreadCount: 0,
    isOnline: true,
    transport: 'Dual Mesh',
    messages: [
      {
        id: 'm-9',
        sender: 'peer',
        text: 'Power grid is still offline, relying on QChats mesh relay.',
        time: 'Oct 23'
      }
    ]
  }
]

const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'c-1',
    name: 'Alice (Field Medic)',
    avatarColor: 'from-emerald-500 to-teal-700',
    avatarInitials: 'AL',
    type: 'incoming',
    callType: 'audio',
    time: 'Today, 09:10 AM'
  },
  {
    id: 'c-2',
    name: 'Bob (Search & Rescue)',
    avatarColor: 'from-amber-500 to-orange-600',
    avatarInitials: 'BO',
    type: 'missed',
    callType: 'video',
    time: 'Yesterday, 14:22'
  },
  {
    id: 'c-3',
    name: 'Berty / QChats Mesh',
    avatarColor: 'from-violet-600 to-indigo-600',
    avatarInitials: 'QC',
    type: 'outgoing',
    callType: 'audio',
    time: 'October 22, 18:05'
  }
]

const INITIAL_STATUSES: StatusItem[] = [
  {
    id: 's-1',
    name: 'Alice (Field Medic)',
    time: '42 minutes ago',
    avatarColor: 'from-emerald-500 to-teal-700',
    avatarInitials: 'AL',
    hasUnviewed: true,
    caption: 'Mobile field clinic established at Sector 4. Off-grid triage radio operational.'
  },
  {
    id: 's-2',
    name: 'Bob (Search & Rescue)',
    time: 'Today, 07:30 AM',
    avatarColor: 'from-amber-500 to-orange-600',
    avatarInitials: 'BO',
    hasUnviewed: true,
    caption: 'Cleared North Ridge trail. All beacon transponders responsive.'
  },
  {
    id: 's-3',
    name: 'Neighborhood Watch',
    time: 'Yesterday, 21:15',
    avatarColor: 'from-blue-600 to-cyan-700',
    avatarInitials: 'NW',
    hasUnviewed: false,
    caption: 'Night patrol mesh repeater battery at 94%.'
  }
]

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [activeTab, setActiveTab] = useState<'chats' | 'updates' | 'calls' | 'settings'>('chats')
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'groups'>('all')
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [inputText, setInputText] = useState('')
  
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('qchats_theme') === 'dark' ||
      (!('qchats_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  // DUAL ONLINE & OFFLINE 100% NETWORK OPERATION MODE FEATURE
  const [networkMode, setNetworkMode] = useState<'dual' | 'offline-only' | 'online-only'>(() => {
    return (localStorage.getItem('qchats_network_mode') as any) || 'dual'
  })

  // Profile State
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('qchats_username') || 'Rahul Chaube')
  const [userStatus, setUserStatus] = useState<string>(() => localStorage.getItem('qchats_status') || 'Available for off-grid mesh routing 📡')
  const [userAvatar, setUserAvatar] = useState<string | null>(() => localStorage.getItem('qchats_avatar') || null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Status & Stories
  const [statuses, setStatuses] = useState<StatusItem[]>(INITIAL_STATUSES)
  const [activeStory, setActiveStory] = useState<StatusItem | null>(null)
  const [myStatusText, setMyStatusText] = useState<string>('Online and broadcasting on mesh channel 01')
  const [showAddStatusModal, setShowAddStatusModal] = useState(false)
  const [newStatusInput, setNewStatusInput] = useState('')

  // Modals & Panels
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [activeCall, setActiveCall] = useState<{ name: string; type: 'audio' | 'video' } | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const [selectedMessageReactionId, setSelectedMessageReactionId] = useState<string | null>(null)
  const [isPeerTyping, setIsPeerTyping] = useState(false)

  // Settings Toggles
  const [bleEnabled, setBleEnabled] = useState(true)
  const [mdnsEnabled, setMdnsEnabled] = useState(true)
  const [torBridgeEnabled, setTorBridgeEnabled] = useState(false)
  const [readReceipts, setReadReceipts] = useState(true)
  const [disappearingDuration, setDisappearingDuration] = useState<'off' | '24h' | '7d' | '90d'>('off')

  // Inputs & Refs
  const [newContactId, setNewContactId] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [incomingRequest, setIncomingRequest] = useState<{ id: string; name: string } | null>({
    id: 'req-1',
    name: 'Dr. Sarah Connor'
  })

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Real-time QR Code Generation
  useEffect(() => {
    const peerUri = `qchats://id/12D3KooWRg8K8N1hM1vFwJp132vV7Zk?name=${encodeURIComponent(userName)}&mode=${networkMode}`
    QRCode.toDataURL(peerUri, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 280,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url)
    }).catch(err => {
      console.error('Failed to generate QR code:', err)
    })
  }, [userName, networkMode])

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('qchats_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('qchats_theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('qchats_network_mode', networkMode)
  }, [networkMode])

  useEffect(() => {
    if (activeConvId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeConvId, conversations])

  // Call timer simulation
  useEffect(() => {
    let timer: any
    if (activeCall) {
      setCallDuration(0)
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      setCallDuration(0)
    }
    return () => clearInterval(timer)
  }, [activeCall])

  const activeConv = conversations.find(c => c.id === activeConvId)

  // Play real synthesized audio chime for voice notes
  const playVoiceNoteTone = (msgId: string) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null)
      return
    }
    setPlayingAudioId(msgId)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        audioContextRef.current = ctx
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3)
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      }
    } catch (e) {
      console.warn(e)
    }

    setTimeout(() => {
      setPlayingAudioId(null)
    }, 3000)
  }

  // Handle Profile Avatar Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string
        setUserAvatar(result)
        localStorage.setItem('qchats_avatar', result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Media Attachment in Chat
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && activeConvId) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string
        const newMsg: Message = {
          id: `m-img-${Date.now()}`,
          sender: 'me',
          type: 'image',
          mediaUrl: result,
          mediaCaption: file.name,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        }
        appendMessage(newMsg)
        setShowAttachmentMenu(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const appendMessage = (newMsg: Message) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: newMsg.text || '📷 Photo',
            lastTime: newMsg.time,
            messages: [...c.messages, newMsg]
          }
        }
        return c
      })
    )

    // Simulate peer typing & response
    setTimeout(() => {
      setIsPeerTyping(true)
    }, 1000)

    setTimeout(() => {
      setIsPeerTyping(false)
      if (activeConvId) {
        const peerReply: Message = {
          id: `m-rep-${Date.now()}`,
          sender: 'peer',
          text: `[${networkMode.toUpperCase()}] Received message via cryptographic P2P hop. Delivery confirmed.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        }
        setConversations(prev =>
          prev.map(c => {
            if (c.id === activeConvId) {
              return {
                ...c,
                lastMessage: peerReply.text!,
                lastTime: peerReply.time,
                messages: [...c.messages, peerReply]
              }
            }
            return c
          })
        )
      }
    }, 2400)
  }

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConvId) return

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      sender: 'me',
      type: 'text',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    }

    appendMessage(newMessage)
    setInputText('')

    setTimeout(() => {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: c.messages.map(m => (m.id === newMessage.id ? { ...m, status: 'delivered' } : m))
            }
          }
          return c
        })
      )
    }, 500)
  }

  const handleVotePoll = (messageId: string, optionIndex: number) => {
    if (!activeConvId) return
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id === messageId && m.pollData) {
                const prevVote = m.pollData.userVotedIndex
                if (prevVote === optionIndex) return m
                const newOptions = m.pollData.options.map((opt, idx) => {
                  if (idx === optionIndex) return { ...opt, votes: opt.votes + 1 }
                  if (idx === prevVote) return { ...opt, votes: Math.max(0, opt.votes - 1) }
                  return opt
                })
                return {
                  ...m,
                  pollData: {
                    ...m.pollData,
                    options: newOptions,
                    userVotedIndex: optionIndex
                  }
                }
              }
              return m
            })
          }
        }
        return c
      })
    )
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!activeConvId) return
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: c.messages.map(m => (m.id === messageId ? { ...m, reaction: emoji } : m))
          }
        }
        return c
      })
    )
    setSelectedMessageReactionId(null)
  }

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          const locMsg: Message = {
            id: `m-loc-${Date.now()}`,
            sender: 'me',
            type: 'location',
            text: `📍 GPS Fix: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E\nAccuracy: ${pos.coords.accuracy.toFixed(0)}m (Broadcast over BLE)`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered'
          }
          appendMessage(locMsg)
          setShowAttachmentMenu(false)
        },
        () => {
          const locMsg: Message = {
            id: `m-loc-${Date.now()}`,
            sender: 'me',
            type: 'location',
            text: '📍 Mesh Location: 37.7749° N, 122.4194° W (Emergency Sector 4)',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered'
          }
          appendMessage(locMsg)
          setShowAttachmentMenu(false)
        }
      )
    } else {
      const locMsg: Message = {
        id: `m-loc-${Date.now()}`,
        sender: 'me',
        type: 'location',
        text: '📍 Mesh Location: 37.7749° N, 122.4194° W (Emergency Sector 4)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      }
      appendMessage(locMsg)
      setShowAttachmentMenu(false)
    }
  }

  const handleCreateContact = () => {
    if (!newContactId.trim()) return
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      name: newContactId.trim(),
      type: 'one-to-one',
      avatarColor: 'from-purple-500 to-indigo-700',
      avatarInitials: newContactId.substring(0, 2).toUpperCase(),
      lastMessage: 'Contact request accepted.',
      lastTime: 'Just now',
      unreadCount: 0,
      isOnline: true,
      transport: networkMode === 'offline-only' ? 'BLE Mesh' : 'Dual Mesh',
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: 'system',
          text: `Direct secure channel opened with ${newContactId}. Transport: ${networkMode.toUpperCase()}`,
          time: 'Just now'
        }
      ]
    }
    setConversations([newConv, ...conversations])
    setNewContactId('')
    setShowNewChatModal(false)
    setActiveConvId(newConv.id)
  }

  const handleAddStatus = () => {
    if (!newStatusInput.trim()) return
    setMyStatusText(newStatusInput.trim())
    setNewStatusInput('')
    setShowAddStatusModal(false)
  }

  const clearChatHistory = () => {
    if (confirm('Are you sure you want to clear all local chat messages and media?')) {
      setConversations(prev =>
        prev.map(c => ({
          ...c,
          lastMessage: 'Chat history cleared.',
          unreadCount: 0,
          messages: [
            {
              id: `m-cleared-${Date.now()}`,
              sender: 'system',
              text: '🔒 Chat history cleared on this device.',
              time: 'Just now'
            }
          ]
        }))
      )
      alert('Local database wiped clean.')
    }
  }

  const copyPublicKey = () => {
    navigator.clipboard?.writeText('qchats://id/12D3KooWRg8K8N1h...vV7Zk')
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    if (chatFilter === 'unread') return c.unreadCount > 0
    if (chatFilter === 'groups') return c.type === 'group'
    return true
  })

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-900 md:bg-slate-100 md:dark:bg-zinc-950 flex justify-center items-center overflow-x-hidden p-0 md:p-6 text-slate-900 dark:text-zinc-100 font-sans antialiased">
      {/* Mobile Device Container */}
      <div className="w-full h-screen md:max-w-[412px] md:h-[860px] md:max-h-[96vh] bg-white dark:bg-zinc-900 md:rounded-[42px] md:shadow-2xl md:border-[7px] md:border-slate-800 dark:md:border-zinc-800 flex flex-col overflow-hidden relative">

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={avatarInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
        <input
          type="file"
          ref={mediaInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleMediaUpload}
        />

        {/* Smartphone Top Notch / Status Bar */}
        <div className="h-11 bg-white dark:bg-zinc-900 px-5 flex items-center justify-between text-xs font-semibold select-none z-30 border-b border-slate-100 dark:border-zinc-800/60 shrink-0">
          <span className="text-slate-800 dark:text-zinc-200">9:41</span>
          
          {/* Dual Network Mode Pill in Header */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-zinc-800 border border-indigo-200/50 dark:border-zinc-700">
            {networkMode === 'dual' ? (
              <span className="text-[#535AE4] dark:text-indigo-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Dual (Online + Offline)
              </span>
            ) : networkMode === 'offline-only' ? (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-500" />
                Air-gapped Mesh
              </span>
            ) : (
              <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-blue-500" />
                Online Relay
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="w-5 h-2.5 border border-current rounded-xs flex items-center p-0.5">
              <div className="w-3.5 h-1.5 bg-current rounded-2xs" />
            </div>
          </div>
        </div>

        {/* MAIN BODY: ACTIVE CHAT SCREEN */}
        {activeConvId && activeConv ? (
          <div className="flex-1 flex flex-col bg-[#F7F8FF] dark:bg-zinc-950 relative overflow-hidden">
            {/* Chat Top Header */}
            <div className="bg-white dark:bg-zinc-900 px-3 py-2.5 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between shadow-xs z-10 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setActiveConvId(null)}
                  className="p-1.5 -ml-1 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeConv.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 overflow-hidden`}>
                  {activeConv.avatarImage ? (
                    <img src={activeConv.avatarImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    activeConv.avatarInitials
                  )}
                </div>
                <div className="truncate">
                  <h2 className="font-bold text-sm text-[#383B62] dark:text-white leading-tight truncate">
                    {activeConv.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {isPeerTyping ? (
                      <span className="text-[#535AE4] font-semibold animate-pulse">typing...</span>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <span>{networkMode === 'offline-only' ? 'BLE Mesh' : activeConv.transport} • E2E Encrypted</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500 dark:text-zinc-400 shrink-0">
                <button
                  onClick={() => setActiveCall({ name: activeConv.name, type: 'video' })}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                  title="Encrypted Video Call"
                >
                  <Video className="w-4 h-4 text-slate-700 dark:text-zinc-200" />
                </button>
                <button
                  onClick={() => setActiveCall({ name: activeConv.name, type: 'audio' })}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                  title="Encrypted Audio Call"
                >
                  <Phone className="w-4 h-4 text-slate-700 dark:text-zinc-200" />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* E2E Security Badge */}
              <div className="flex justify-center my-2">
                <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 rounded-xl px-3 py-2 max-w-[90%] text-center shadow-2xs">
                  <div className="flex items-center justify-center gap-1 text-indigo-700 dark:text-indigo-300 font-semibold text-xs mb-0.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>End-to-End Encrypted ({networkMode.toUpperCase()})</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">
                    Zero-knowledge cryptographic signing. Operating 100% online and offline via local peer relays.
                  </p>
                </div>
              </div>

              {activeConv.messages.map(msg => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-1">
                      <span className="bg-slate-200/60 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] px-3 py-1 rounded-full text-center max-w-[85%]">
                        {msg.text}
                      </span>
                    </div>
                  )
                }

                const isMe = msg.sender === 'me'
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} my-1 relative group`}
                  >
                    <div
                      onClick={() => setSelectedMessageReactionId(selectedMessageReactionId === msg.id ? null : msg.id)}
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm shadow-xs cursor-pointer relative ${
                        isMe
                          ? 'bg-[#535AE4] text-white rounded-tr-xs'
                          : 'bg-white dark:bg-zinc-900 text-[#383B62] dark:text-zinc-100 border border-slate-200/60 dark:border-zinc-800 rounded-tl-xs'
                      }`}
                    >
                      {/* Audio Note Bubble with Live Sound Synth */}
                      {msg.type === 'audio' && (
                        <div className="flex items-center gap-3 py-1 min-w-[190px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              playVoiceNoteTone(msg.id)
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                              isMe ? 'bg-white text-[#535AE4]' : 'bg-[#535AE4] text-white'
                            }`}
                          >
                            {playingAudioId === msg.id ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1 space-y-1">
                            {/* Audio Waveform visualization */}
                            <div className="flex items-center gap-0.5 h-4">
                              {[30, 70, 45, 90, 60, 40, 85, 100, 50, 75, 40, 65, 80, 50, 30].map((h, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-full transition-all ${
                                    isMe
                                      ? playingAudioId === msg.id && i < 8 ? 'bg-white animate-pulse' : 'bg-indigo-300'
                                      : playingAudioId === msg.id && i < 8 ? 'bg-[#535AE4] animate-pulse' : 'bg-slate-300 dark:bg-zinc-700'
                                  }`}
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                            <div className={`text-[10px] font-mono ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                              {playingAudioId === msg.id ? 'Playing...' : msg.audioDuration || '0:18'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive Poll in Chat */}
                      {msg.type === 'poll' && msg.pollData && (
                        <div className="space-y-2.5 min-w-[210px] py-1">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-[#383B62] dark:text-white mb-1">
                            <BarChart2 className="w-4 h-4 text-[#535AE4]" />
                            <span>{msg.pollData.question}</span>
                          </div>
                          {msg.pollData.options.map((opt, idx) => {
                            const isVoted = msg.pollData?.userVotedIndex === idx
                            const totalVotes = msg.pollData!.options.reduce((acc, o) => acc + o.votes, 0)
                            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
                            return (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleVotePoll(msg.id, idx)
                                }}
                                className={`w-full text-left p-2 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${
                                  isVoted
                                    ? 'border-[#535AE4] bg-indigo-50/60 dark:bg-indigo-950/40'
                                    : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                }`}
                              >
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-indigo-200/40 dark:bg-indigo-900/40 pointer-events-none transition-all duration-300"
                                  style={{ width: `${pct}%` }}
                                />
                                <div className="flex justify-between items-center text-xs relative z-10">
                                  <span className={`font-medium ${isVoted ? 'text-[#535AE4] font-bold' : ''}`}>
                                    {isVoted ? '✓ ' : ''}{opt.text}
                                  </span>
                                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{pct}% ({opt.votes})</span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {/* Image Message */}
                      {msg.type === 'image' && msg.mediaUrl && (
                        <div className="mb-1 rounded-xl overflow-hidden max-h-48 border border-black/10">
                          <img src={msg.mediaUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Text / Caption */}
                      {msg.text && (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      )}

                      {/* Timestamp & Status */}
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                          isMe ? 'text-indigo-200' : 'text-slate-400 dark:text-zinc-500'
                        }`}
                      >
                        <span>{msg.time}</span>
                        {isMe && (
                          <span>
                            {msg.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                            ) : msg.status === 'delivered' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-indigo-300" />
                            )}
                          </span>
                        )}
                      </div>

                      {/* Attached Reaction Badge */}
                      {msg.reaction && (
                        <div className="absolute -bottom-2 right-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full px-1.5 py-0.2 shadow-sm text-xs">
                          {msg.reaction}
                        </div>
                      )}
                    </div>

                    {/* Quick Reactions Bar on Click */}
                    {selectedMessageReactionId === msg.id && (
                      <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full px-2 py-1 shadow-lg mt-1 z-20 animate-in fade-in zoom-in-95">
                        {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className="hover:scale-125 transition-transform text-base p-1 cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* WhatsApp-style Attachment Grid Menu */}
            {showAttachmentMenu && (
              <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-4 shadow-2xl grid grid-cols-3 gap-4 z-40 animate-in fade-in slide-in-from-bottom-4">
                <button
                  onClick={() => mediaInputRef.current?.click()}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Gallery</span>
                </button>

                <button
                  onClick={() => mediaInputRef.current?.click()}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Camera</span>
                </button>

                <button
                  onClick={() => {
                    const docMsg: Message = {
                      id: `m-doc-${Date.now()}`,
                      sender: 'me',
                      text: '📄 Mesh_Protocol_Spec_v2.pdf (1.2 MB)\nVerified checksum: 4a9f...e102',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'delivered'
                    }
                    appendMessage(docMsg)
                    setShowAttachmentMenu(false)
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Document</span>
                </button>

                <button
                  onClick={handleShareLocation}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Live GPS</span>
                </button>

                <button
                  onClick={() => {
                    const contactMsg: Message = {
                      id: `m-con-${Date.now()}`,
                      sender: 'me',
                      text: `👤 Contact Card: ${userName}\nqchats://id/12D3KooWRg8K8N1h...vV7Zk`,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'delivered'
                    }
                    appendMessage(contactMsg)
                    setShowAttachmentMenu(false)
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Contact</span>
                </button>

                <button
                  onClick={() => {
                    const pollMsg: Message = {
                      id: `m-pol-${Date.now()}`,
                      sender: 'me',
                      type: 'poll',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'delivered',
                      pollData: {
                        question: 'Emergency Evacuation Check: Ready to move?',
                        options: [
                          { text: 'Yes, squad is fully equipped', votes: 4 },
                          { text: 'Standby for 10 minutes', votes: 1 },
                          { text: 'Need medical assistance', votes: 0 }
                        ]
                      }
                    }
                    appendMessage(pollMsg)
                    setShowAttachmentMenu(false)
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-13 h-13 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">Poll</span>
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <div className="bg-white dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 p-2.5 flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  showAttachmentMenu ? 'bg-indigo-100 dark:bg-indigo-950 text-[#535AE4]' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
                title="Add Attachment"
              >
                <Paperclip className="w-5 h-5 text-[#535AE4]" />
              </button>

              <input
                type="text"
                placeholder="Write a message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-[#F7F8FF] dark:bg-zinc-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm rounded-full outline-hidden border border-slate-200/50 dark:border-zinc-700/50 focus:border-[#535AE4] focus:ring-1 focus:ring-[#535AE4]"
              />

              {inputText.trim() ? (
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-[#535AE4] hover:bg-[#464cc4] text-white rounded-full flex items-center justify-center shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const voiceMsg: Message = {
                      id: `m-voice-${Date.now()}`,
                      sender: 'me',
                      type: 'audio',
                      audioDuration: '0:14',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'delivered'
                    }
                    appendMessage(voiceMsg)
                  }}
                  className="w-10 h-10 bg-[#535AE4] text-white hover:bg-[#464cc4] rounded-full flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
                  title="Send Quick Voice Note"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* MAIN TABS SCREEN (CHATS, UPDATES, CALLS, SETTINGS) */
          <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden relative">

            {/* HEADER FOR HOME TABS */}
            <div className="px-4 pt-3 pb-2.5 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800/80 shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/qchats-icon.svg"
                    alt="QChats"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="font-extrabold text-2xl tracking-tight text-[#383B62] dark:text-white">
                    QChats
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden cursor-pointer"
                    title="Settings & Profile"
                  >
                    {userAvatar ? (
                      <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      userName.substring(0, 2).toUpperCase()
                    )}
                  </button>
                </div>
              </div>

              {/* Search Bar for Chats & Calls */}
              {activeTab === 'chats' && (
                <>
                  <div className="relative mb-2.5">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search or enter QChats ID..."
                      className="w-full bg-[#F7F8FF] dark:bg-zinc-800/80 text-sm text-slate-900 dark:text-white pl-9.5 pr-8 py-2 rounded-full outline-hidden border border-slate-200/50 dark:border-zinc-700/50 focus:border-[#535AE4] focus:ring-1 focus:ring-[#535AE4] transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-xs font-semibold cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* WhatsApp-style Filter Pills (All, Unread, Groups) */}
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => setChatFilter('all')}
                      className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        chatFilter === 'all'
                          ? 'bg-[#535AE4] text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setChatFilter('unread')}
                      className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        chatFilter === 'unread'
                          ? 'bg-[#535AE4] text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
                      }`}
                    >
                      Unread
                    </button>
                    <button
                      onClick={() => setChatFilter('groups')}
                      className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        chatFilter === 'groups'
                          ? 'bg-[#535AE4] text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
                      }`}
                    >
                      Groups
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-y-auto">

              {/* TAB 1: CHATS LIST */}
              {activeTab === 'chats' && (
                <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 pb-20">

                  {/* Incoming Contact Requests Accordion */}
                  {incomingRequest && (
                    <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/40 p-3 mx-3 my-2 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/40 shadow-2xs">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#535AE4] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            SC
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-[#383B62] dark:text-white block truncate">
                              {incomingRequest.name}
                            </span>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                              Wants to connect via Bluetooth Mesh
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setConversations([
                              {
                                id: `conv-${Date.now()}`,
                                name: incomingRequest.name,
                                type: 'one-to-one',
                                avatarColor: 'from-pink-500 to-rose-600',
                                avatarInitials: 'SC',
                                lastMessage: 'Connection accepted.',
                                lastTime: 'Just now',
                                unreadCount: 0,
                                isOnline: true,
                                transport: 'BLE Mesh',
                                messages: [
                                  {
                                    id: `m-acc-${Date.now()}`,
                                    sender: 'system',
                                    text: `Peer connection established with ${incomingRequest.name}.`,
                                    time: 'Just now'
                                  }
                                ]
                              },
                              ...conversations
                            ])
                            setIncomingRequest(null)
                          }}
                          className="flex-1 bg-[#535AE4] text-white text-xs font-semibold py-2 rounded-xl shadow-2xs hover:bg-[#464cc4] transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => setIncomingRequest(null)}
                          className="flex-1 bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs font-medium py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Conversations Loop */}
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => (
                      <div
                        key={conv.id}
                        onClick={() => {
                          setActiveConvId(conv.id)
                          setConversations(prev =>
                            prev.map(c => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                          )
                        }}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 active:bg-slate-100 cursor-pointer transition-colors"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${conv.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-xs overflow-hidden`}>
                            {conv.avatarImage ? (
                              <img src={conv.avatarImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                              conv.avatarInitials
                            )}
                          </div>
                          {conv.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                          )}
                        </div>

                        {/* Middle info */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-sm text-[#383B62] dark:text-zinc-100 truncate">
                              {conv.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-zinc-500 whitespace-nowrap ml-2">
                              {conv.lastTime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate pr-2">
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="w-5 h-5 bg-[#535AE4] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs shrink-0">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-6">
                      <div className="w-16 h-16 bg-indigo-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-500">
                        <MessageSquare className="w-8 h-8 opacity-40" />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-700 dark:text-zinc-300">
                        No conversations found
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                        Tap the + button below to start a direct P2P mesh chat.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: UPDATES / STATUS (WhatsApp Style Story Viewer & Creator) */}
              {activeTab === 'updates' && (
                <div className="p-4 space-y-4 pb-20">
                  {/* My Status Card */}
                  <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div className="relative cursor-pointer" onClick={() => setShowAddStatusModal(true)}>
                      <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden">
                        {userAvatar ? (
                          <img src={userAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          userName.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-[#535AE4] border-2 border-white dark:border-zinc-900 rounded-full flex items-center justify-center text-white">
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                    <div className="flex-1 cursor-pointer" onClick={() => setShowAddStatusModal(true)}>
                      <h4 className="font-bold text-sm text-[#383B62] dark:text-white">My Status</h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{myStatusText}</p>
                    </div>
                    <button
                      onClick={() => setShowAddStatusModal(true)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full"
                    >
                      <Camera className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Recent Status Updates */}
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Recent Updates ({statuses.length})
                    </h5>
                    <div className="space-y-3">
                      {statuses.map(st => (
                        <div
                          key={st.id}
                          onClick={() => {
                            setActiveStory(st)
                            setStatuses(prev =>
                              prev.map(s => (s.id === st.id ? { ...s, hasUnviewed: false } : s))
                            )
                          }}
                          className="flex items-center gap-3.5 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                        >
                          <div className={`p-0.5 rounded-full ${st.hasUnviewed ? 'ring-2 ring-[#535AE4]' : 'ring-2 ring-slate-300 dark:ring-zinc-700'}`}>
                            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${st.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                              {st.avatarInitials}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-[#383B62] dark:text-white truncate">{st.name}</h4>
                            <p className="text-xs text-slate-400">{st.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CALLS (WhatsApp Style) */}
              {activeTab === 'calls' && (
                <div className="p-4 space-y-4 pb-20">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#383B62] dark:text-white">Recent Calls</h4>
                    <span className="text-xs text-emerald-600 font-medium">Off-Grid P2P Voice</span>
                  </div>

                  <div className="space-y-3">
                    {INITIAL_CALLS.map(call => (
                      <div key={call.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${call.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                            {call.avatarInitials}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-[#383B62] dark:text-white">{call.name}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              {call.type === 'missed' ? (
                                <PhoneOff className="w-3.5 h-3.5 text-rose-500" />
                              ) : call.type === 'incoming' ? (
                                <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <PhoneOutgoing className="w-3.5 h-3.5 text-indigo-500" />
                              )}
                              <span>{call.time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => setActiveCall({ name: call.name, type: 'video' })}
                            className="p-2 text-[#535AE4] hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-full cursor-pointer"
                            title="Video Call"
                          >
                            <Video className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => setActiveCall({ name: call.name, type: 'audio' })}
                            className="p-2 text-[#535AE4] hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-full cursor-pointer"
                            title="Voice Call"
                          >
                            <Phone className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS (Full-Featured Settings & Profile Editor) */}
              {activeTab === 'settings' && (
                <div className="p-4 space-y-4 pb-20">

                  {/* Profile Card with Photo Upload */}
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-800 rounded-3xl border border-indigo-100 dark:border-zinc-700 relative">
                    <div className="flex items-center gap-3.5">
                      <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md overflow-hidden">
                          {userAvatar ? (
                            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            userName.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#535AE4] border-2 border-white dark:border-zinc-900 rounded-full flex items-center justify-center text-white shadow-xs">
                          <Camera className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {isEditingProfile ? (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              value={userName}
                              onChange={e => {
                                setUserName(e.target.value)
                                localStorage.setItem('qchats_username', e.target.value)
                              }}
                              className="w-full bg-white dark:bg-zinc-900 text-xs px-2 py-1 rounded-md border border-slate-300 dark:border-zinc-600 font-bold"
                            />
                            <input
                              type="text"
                              value={userStatus}
                              onChange={e => {
                                setUserStatus(e.target.value)
                                localStorage.setItem('qchats_status', e.target.value)
                              }}
                              className="w-full bg-white dark:bg-zinc-900 text-[11px] px-2 py-1 rounded-md border border-slate-300 dark:border-zinc-600"
                            />
                            <button
                              onClick={() => setIsEditingProfile(false)}
                              className="text-[10px] bg-[#535AE4] text-white px-2 py-0.5 rounded font-semibold cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-base text-[#383B62] dark:text-white truncate">
                                {userName}
                              </span>
                              <button
                                onClick={() => setIsEditingProfile(true)}
                                className="text-xs text-[#535AE4] font-semibold hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                              {userStatus}
                            </p>
                            <span className="text-[11px] text-slate-400 font-mono block mt-1">
                              qchats://id/12D3KooWRg...
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => setShowQrModal(true)}
                        className="p-2.5 bg-white dark:bg-zinc-700 text-[#535AE4] dark:text-indigo-300 rounded-2xl shadow-2xs hover:bg-slate-50 cursor-pointer"
                        title="Show My QChats QR Code"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* NEW FEATURE: 100% ONLINE & OFFLINE DUAL OPERATION MODE */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center justify-between">
                      <span>Network Operation Mode</span>
                      <span className="text-emerald-500 lowercase font-medium">100% Dual Mode</span>
                    </span>
                    <div className="bg-white dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-3.5 space-y-2.5 text-xs">
                      {/* Option 1: Dual Hybrid Mode (100% Online + Offline) */}
                      <label
                        onClick={() => setNetworkMode('dual')}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          networkMode === 'dual'
                            ? 'border-[#535AE4] bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs'
                            : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="netMode"
                          checked={networkMode === 'dual'}
                          onChange={() => setNetworkMode('dual')}
                          className="mt-1 accent-[#535AE4]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                            <Layers className="w-4 h-4 text-[#535AE4]" />
                            <span>Hybrid Dual Mode (Online + Offline 100%)</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            Simultaneously leverages Internet & Bluetooth Mesh. If internet drops, all messaging seamlessly switches to offline radio without dropping messages.
                          </p>
                        </div>
                      </label>

                      {/* Option 2: Air-gapped Offline Mesh Only */}
                      <label
                        onClick={() => setNetworkMode('offline-only')}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          networkMode === 'offline-only'
                            ? 'border-[#535AE4] bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs'
                            : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="netMode"
                          checked={networkMode === 'offline-only'}
                          onChange={() => setNetworkMode('offline-only')}
                          className="mt-1 accent-[#535AE4]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                            <Radio className="w-4 h-4 text-amber-500" />
                            <span>Offline Only (Air-gapped BLE Mesh)</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            Zero cellular or internet data. Radiates only short-range Bluetooth 5.3 & LAN multicast for extreme privacy & disaster zones.
                          </p>
                        </div>
                      </label>

                      {/* Option 3: Online Only */}
                      <label
                        onClick={() => setNetworkMode('online-only')}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          networkMode === 'online-only'
                            ? 'border-[#535AE4] bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs'
                            : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="netMode"
                          checked={networkMode === 'online-only'}
                          onChange={() => setNetworkMode('online-only')}
                          className="mt-1 accent-[#535AE4]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span>Online Relay Only (WAN / IPFS)</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            Routes traffic solely over global internet gateways and Tor onion services. Bluetooth radio disabled.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* SETTINGS GROUP 1: THEME & APPEARANCE */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Appearance & Display
                    </span>
                    <div className="bg-white dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                      <div className="flex items-center justify-between p-3.5">
                        <div className="flex items-center gap-3">
                          <Palette className="w-4.5 h-4.5 text-[#535AE4]" />
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-zinc-100">Theme Mode</span>
                            <span className="text-[11px] text-slate-400">Current: {darkMode ? 'Dark Mode (OKLCH)' : 'Light Mode'}</span>
                          </div>
                        </div>
                        <div className="flex items-center bg-slate-100 dark:bg-zinc-700 p-1 rounded-xl">
                          <button
                            onClick={() => setDarkMode(false)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              !darkMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setDarkMode(true)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              darkMode ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-500'
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SETTINGS GROUP 2: MESH & RADIO (Berty Native) */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Mesh & Radio Controls
                    </span>
                    <div className="bg-white dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                      <div className="flex items-center justify-between p-3.5">
                        <div className="flex items-center gap-3">
                          <Radio className="w-4.5 h-4.5 text-indigo-500" />
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-zinc-100">Bluetooth Low Energy (BLE 5.3)</span>
                            <span className="text-[11px] text-slate-400">Off-grid peer-to-peer relay</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={bleEnabled}
                          onChange={e => setBleEnabled(e.target.checked)}
                          className="w-4.5 h-4.5 accent-[#535AE4] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5">
                        <div className="flex items-center gap-3">
                          <Wifi className="w-4.5 h-4.5 text-blue-500" />
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-zinc-100">Local Wi-Fi Multicast (mDNS)</span>
                            <span className="text-[11px] text-slate-400">Discover LAN peers without internet</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={mdnsEnabled}
                          onChange={e => setMdnsEnabled(e.target.checked)}
                          className="w-4.5 h-4.5 accent-[#535AE4] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4.5 h-4.5 text-purple-500" />
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-zinc-100">Tor Onion Routing Daemon</span>
                            <span className="text-[11px] text-slate-400">Anonymize WAN internet connections</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={torBridgeEnabled}
                          onChange={e => setTorBridgeEnabled(e.target.checked)}
                          className="w-4.5 h-4.5 accent-[#535AE4] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SETTINGS GROUP 3: PRIVACY & SECURITY */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Privacy & Security
                    </span>
                    <div className="bg-white dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                      <div className="flex items-center justify-between p-3.5">
                        <div className="flex items-center gap-3">
                          <CheckCheck className="w-4.5 h-4.5 text-cyan-500" />
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-zinc-100">Read Receipts</span>
                            <span className="text-[11px] text-slate-400">Show blue checkmarks upon message delivery</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={readReceipts}
                          onChange={e => setReadReceipts(e.target.checked)}
                          className="w-4.5 h-4.5 accent-[#535AE4] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3.5">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-zinc-100">Disappearing Messages</span>
                            <span className="text-[11px] text-slate-400">Self-destruct timer for all chats</span>
                          </div>
                        </div>
                        <select
                          value={disappearingDuration}
                          onChange={e => setDisappearingDuration(e.target.value as any)}
                          className="bg-slate-100 dark:bg-zinc-700 text-slate-800 dark:text-white px-2 py-1 rounded-lg text-xs outline-hidden cursor-pointer"
                        >
                          <option value="off">Off</option>
                          <option value="24h">24 Hours</option>
                          <option value="7d">7 Days</option>
                          <option value="90d">90 Days</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <Key className="w-4.5 h-4.5 text-amber-500" />
                          <div>
                            <span className="font-semibold block text-slate-800 dark:text-zinc-100">Cryptographic Identity Keys</span>
                            <span className="text-[11px] text-slate-400">Backup Ed25519 seed phrase & private keys</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* SETTINGS GROUP 4: STORAGE & DATABASE MANAGEMENT */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Storage & Database
                    </span>
                    <div className="bg-white dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-3.5 text-xs space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">BLE Mesh Relayed Data</span>
                        <span className="font-semibold text-[#535AE4]">4.2 MB (4 peers)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">Encrypted Local Database</span>
                        <span className="font-semibold">SQLCipher 12.8 MB</span>
                      </div>
                      <button
                        onClick={clearChatHistory}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All Local Chat Data</span>
                      </button>
                    </div>
                  </div>

                  {/* SETTINGS GROUP 5: ABOUT */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      About QChats
                    </span>
                    <div className="bg-white dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 p-3.5 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">Application</span>
                        <span className="font-semibold">QChats Android (Play Store Ready)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">Core Daemon</span>
                        <span className="font-semibold">Go-QChats Engine (P2P + libp2p)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">Zero-Knowledge License</span>
                        <span className="font-semibold text-emerald-500">Apache 2.0 / MIT</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Berty Signature Primary Floating Action Button (FAB) */}
            {activeTab === 'chats' && (
              <button
                onClick={() => setShowNewChatModal(true)}
                className="absolute right-4 bottom-20 w-14 h-14 bg-[#535AE4] hover:bg-[#464cc4] active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40 transition-all z-20 cursor-pointer"
                title="New Chat"
              >
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </button>
            )}

            {/* BOTTOM NAVIGATION BAR (WhatsApp Style) */}
            <div className="h-16 bg-white dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 flex items-center justify-around px-2 z-10 select-none shrink-0">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'chats'
                    ? 'text-[#535AE4] font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                <div className="relative">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#535AE4] rounded-full" />
                </div>
                <span className="text-[10px]">Chats</span>
              </button>

              <button
                onClick={() => setActiveTab('updates')}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'updates'
                    ? 'text-[#535AE4] font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                <Circle className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px]">Updates</span>
              </button>

              <button
                onClick={() => setActiveTab('calls')}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'calls'
                    ? 'text-[#535AE4] font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                <Phone className="w-5 h-5" />
                <span className="text-[10px]">Calls</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'text-[#535AE4] font-bold'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-[10px]">Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL 1: NEW CONVERSATION MODAL */}
        {showNewChatModal && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xs p-5 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#383B62] dark:text-white">
                  Start New Mesh Chat
                </h3>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 block mb-1">
                  Peer Name or QChats ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Charlie or qchats://id/..."
                  value={newContactId}
                  onChange={e => setNewContactId(e.target.value)}
                  className="w-full bg-[#F7F8FF] dark:bg-zinc-800 text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 outline-hidden focus:border-[#535AE4]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreateContact}
                  className="flex-1 bg-[#535AE4] hover:bg-[#464cc4] text-white font-semibold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Connect
                </button>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium text-xs py-2.5 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: REAL SCANNABLE QR CODE MODAL */}
        {showQrModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xs p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 text-center space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-[#383B62] dark:text-white">My QChats QR</h3>
                <button onClick={() => setShowQrModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-white rounded-3xl inline-block border border-slate-200 dark:border-zinc-700 shadow-md">
                <div className="w-48 h-48 rounded-2xl flex items-center justify-center relative overflow-hidden bg-white">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QChats Scannable QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-slate-400 text-xs">Generating QR...</div>
                  )}
                  {/* Embedded QChats Brand Mark */}
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md p-1 border border-slate-100">
                    <img src="/assets/qchats-icon.svg" alt="Q" className="w-6 h-6 object-contain" />
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-sm text-[#383B62] dark:text-white block">{userName}</span>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  qchats://id/12D3KooWRg8K8N1h...vV7Zk
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyPublicKey}
                  className="flex-1 bg-[#535AE4] text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedKey ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Copied' : 'Copy ID Link'}</span>
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-4 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium py-2.5 rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: FULL-SCREEN WHATSAPP STATUS STORY VIEWER */}
        {activeStory && (
          <div className="absolute inset-0 bg-black flex flex-col justify-between p-4 z-50 text-white animate-in fade-in">
            {/* Top Progress bar & Header */}
            <div>
              <div className="w-full bg-white/30 h-1 rounded-full mb-3 overflow-hidden">
                <div className="bg-white h-full w-full animate-[progress_5s_linear]" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeStory.avatarColor} flex items-center justify-center font-bold text-xs`}>
                    {activeStory.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{activeStory.name}</h3>
                    <span className="text-[11px] text-slate-300">{activeStory.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="p-2 text-white hover:bg-white/20 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story Content / Caption */}
            <div className="my-auto text-center px-6">
              <div className="w-20 h-20 bg-indigo-600/30 rounded-3xl mx-auto flex items-center justify-center mb-6">
                <Radio className="w-10 h-10 text-indigo-400 animate-pulse" />
              </div>
              <p className="text-lg font-medium leading-relaxed max-w-xs mx-auto">
                "{activeStory.caption || 'Active off-grid peer relay established.'}"
              </p>
            </div>

            {/* Bottom Dismiss */}
            <div className="pb-4 text-center">
              <button
                onClick={() => setActiveStory(null)}
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-5 py-2 rounded-full cursor-pointer"
              >
                Close Status
              </button>
            </div>
          </div>
        )}

        {/* MODAL 4: ADD STATUS MODAL */}
        {showAddStatusModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xs p-5 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-[#383B62] dark:text-white">Post Status Update</h3>
                <button onClick={() => setShowAddStatusModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-300 block mb-1">
                  What's happening on your mesh node?
                </label>
                <textarea
                  rows={3}
                  value={newStatusInput}
                  onChange={e => setNewStatusInput(e.target.value)}
                  placeholder="e.g. Broadcasting relay at Camp Bravo..."
                  className="w-full bg-[#F7F8FF] dark:bg-zinc-800 text-sm p-3 rounded-xl border border-slate-200 dark:border-zinc-700 outline-hidden focus:border-[#535AE4]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddStatus}
                  className="flex-1 bg-[#535AE4] text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs cursor-pointer"
                >
                  Share Update
                </button>
                <button
                  onClick={() => setShowAddStatusModal(false)}
                  className="px-4 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: ENCRYPTED CALL OVERLAY WITH LIVE DURATION */}
        {activeCall && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-between p-8 z-50 text-white animate-in fade-in">
            <div className="text-center pt-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full px-3 py-1 text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>End-to-End Encrypted Call ({networkMode.toUpperCase()})</span>
              </div>
              <h2 className="text-2xl font-bold mt-2">{activeCall.name}</h2>
              <p className="text-sm font-mono text-emerald-400">
                Connected • {formatDuration(callDuration)}
              </p>
            </div>

            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-3xl font-bold shadow-2xl ring-8 ring-indigo-500/20 animate-pulse">
              {activeCall.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="w-full max-w-xs flex items-center justify-around pb-8">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setActiveCall(null)}
                className="w-16 h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <PhoneOff className="w-8 h-8" />
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isSpeaker ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'
                }`}
              >
                {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
