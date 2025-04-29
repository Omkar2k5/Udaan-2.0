"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bot, ChevronLeft, LogOut, MessageSquare } from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SplineBackground } from "@/app/components/SplineBackground"

// Firebase
import { useAuth } from "@/context/auth-context"

// Gemini API Key
const GEMINI_API_KEY = "AIzaSyCGcOxCt0kgHNSaqOnBGsGA9LiNEfnEWZs";

export default function PropBotPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', content: string}>>([])
  
  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { type: 'user', content: message }]);
    setIsLoading(true);
    
    try {
      // Prepare the request payload
      const payload = {
        contents: [{
          parts: [{
            text: `You are a property legal consultant. Respond in a strict legal format with the following structure:

1. LEGAL FRAMEWORK: Begin with the relevant legal framework or statutes that apply to the query.
2. CASE LAW: If applicable, cite relevant case law or precedents with proper citations.
3. INTERPRETATION: Provide legal interpretation of how these laws apply to the specific query.
4. CONSIDERATIONS: List any important legal considerations or caveats.
5. CONCLUSION: Summarize the legal position in formal legal language.

The query is about: ${message}

Focus exclusively on property matters, real estate laws, ownership rights, and relevant legal considerations. Maintain formal legal tone throughout and cite specific sections of laws where applicable.`
          }]
        }]
      };
      
      // Make the API call directly
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );
      
      const data = await response.json();
      
      // Extract the response text
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Sorry, I couldn't generate a response. Please try again.";
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        content: botResponse 
      }]);
    } catch (error) {
      console.error("Error getting response from Gemini:", error);
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        content: "Sorry, I encountered an error processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
      <SplineBackground />
      
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Back Button */}
      <div className="relative z-10 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/")}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      {/* Main content */}
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={containerAnimation}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Page title */}
        <motion.div variants={itemAnimation} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600/20 p-4 rounded-full">
              <Bot className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Property Assistant Bot</h1>
          <p className="text-gray-400 max-w-md mx-auto mt-2">
            Get instant answers to your property-related questions
          </p>
        </motion.div>
        
        {/* Chat card */}
        <motion.div variants={itemAnimation}>
          <Card className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/5">
              <CardTitle className="text-white">PropBot Chat</CardTitle>
              <CardDescription className="text-gray-400">
                Ask questions about properties, laws, or encumbrance details
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4 mb-4 h-[400px] overflow-y-auto p-2">
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.type === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-800 text-gray-200'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-200 rounded-lg px-4 py-2">
                      <span className="animate-pulse">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question here..."
                  className="bg-black/50 border-white/20 text-white flex-grow"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700" 
                  disabled={isLoading || !message.trim()}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Footer */}
        <motion.div variants={itemAnimation} className="text-center text-sm text-gray-500 mt-8">
          <p>© {new Date().getFullYear()} Uddan Property Services | PropBot powered by Google Gemini AI</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
