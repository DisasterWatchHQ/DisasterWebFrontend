"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  AlertTriangle, 
  Flame, 
  Waves, 
  Wind, 
  CloudLightning, 
  Thermometer,
  Download,
  Printer,
  Share2,
  Video,
  Link
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const disasterTypes = [
  { id: 'flood', name: 'Flood', icon: <Waves className="w-4 h-4" /> },
  { id: 'fire', name: 'Fire', icon: <Flame className="w-4 h-4" /> },
  { id: 'hurricane', name: 'Hurricane', icon: <Wind className="w-4 h-4" /> },
  { id: 'tornado', name: 'Tornado', icon: <CloudLightning className="w-4 h-4" /> },
  { id: 'earthquake', name: 'Earthquake', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'heatwave', name: 'Heat Wave', icon: <Thermometer className="w-4 h-4" /> },
]

const guideContent = {
  flood: {
    before: [
      "Create an emergency kit with essential supplies",
      "Know your area's flood risk and evacuation routes",
      "Keep important documents in a waterproof container",
      "Install check valves in plumbing",
      "Maintain emergency supplies of food and water"
    ],
    during: [
      "Move to higher ground immediately",
      "Avoid walking or driving through flood waters",
      "Keep monitoring local news and weather updates",
      "Follow evacuation orders promptly",
      "Turn off utilities if instructed to do so"
    ],
    after: [
      "Wait for official word that it's safe to return",
      "Document damage for insurance claims",
      "Clean and disinfect everything that got wet",
      "Check for structural damage",
      "Be aware of contaminated water"
    ],
    documents: [
      "Identification (Driver's license, passport)",
      "Insurance policies",
      "Birth certificates",
      "Medical records and prescriptions",
      "Bank account information",
      "Emergency contact list"
    ]
  },
  // Add similar content for other disaster types
}

export default function Guides() {
  const [selectedDisaster, setSelectedDisaster] = useState('flood')
  const [checklist, setChecklist] = useState({})

  // Handle checklist item toggle
  const toggleChecklistItem = (category, index) => {
    setChecklist(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }))
  }

  // Handle PDF download
  const downloadPDF = () => {
    // Implementation with a PDF library like jsPDF
    console.log('Downloading PDF...')
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedDisaster.charAt(0).toUpperCase() + selectedDisaster.slice(1)} Safety Guide`,
          text: 'Check out this disaster safety guide',
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
                  <h2 className="text-xl font-semibold mb-4">Disaster Types</h2>
                  <div className="space-y-2">
                    {disasterTypes.map((disaster) => (
                      <Button
                        key={disaster.id}
                        variant={selectedDisaster === disaster.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedDisaster(disaster.id)}
                      >
                        <span className="mr-2">{disaster.icon}</span>
                        {disaster.name}
                      </Button>
                    ))}
                  </div>
                </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Header with Action Buttons */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {disasterTypes.find(d => d.id === selectedDisaster)?.name} Safety Guide
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive guide for before, during, and after a {selectedDisaster}.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={downloadPDF}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Video className="mr-2 h-4 w-4" />
                    Watch Video Guide
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Video Guide</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-muted">
                    {/* Video player component here */}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Emergency Contacts
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Emergency Contacts</DialogTitle>
                  </DialogHeader>
                  {/* Emergency contacts list */}
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Link className="mr-2 h-4 w-4" />
                    Related Resources
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Related Resources</DialogTitle>
                  </DialogHeader>
                  {/* Resources list */}
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="before" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="before">Before</TabsTrigger>
                <TabsTrigger value="during">During</TabsTrigger>
                <TabsTrigger value="after">After</TabsTrigger>
                <TabsTrigger value="checklist">Emergency Kit</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-400px)] mt-6">
                {/* Previous tab contents with added checkboxes */}
                <TabsContent value="before">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preparation Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {guideContent[selectedDisaster]?.before.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Checkbox
                              checked={checklist[`before-${index}`]}
                              onCheckedChange={() => toggleChecklistItem('before', index)}
                            />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Emergency Kit Checklist */}
                <TabsContent value="checklist">
                  <Card>
                    <CardHeader>
                      <CardTitle>Emergency Kit Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Add emergency kit items with checkboxes */}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => window.print()}
                        >
                          Print Checklist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Print-specific content (hidden during normal view) */}
      <div className="hidden print:block">
        {/* Formatted content for printing */}
      </div>
    </div>
  )
}