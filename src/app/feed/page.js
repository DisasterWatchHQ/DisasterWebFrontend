'use client'

import { useReports } from "@/hooks/useReports"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Feed() {
  const { toast } = useToast()
  const { reports, loading, error, refreshReports } = useReports()

  const handleRefresh = async () => {
      try {
        await refreshReports()
        toast({
          title: "Success",
          description: "Feed refreshed successfully",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to refresh feed",
        })
      }
    }
  
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="w-full h-full p-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Disaster Feed</h1>
            <Button 
              onClick={refreshReports}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing
                </>
              ) : (
                'Refresh'
              )}
            </Button>
          </div>

          {error && (
            <Card className="bg-destructive/10 text-destructive mb-4">
              <CardContent className="pt-6">
                <p>{error}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && reports.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No reports available.
                </p>
              </CardContent>
            </Card>
          )}

          {reports.map((report, index) => (
            <DisasterReportCard key={index} {...report} />
          ))}
        </div>
      </main>
    </div>
  )
}

function DisasterReportCard({ title, description, date, location }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <span>{location}</span>
        <span>{formatDate(date)}</span>
      </CardFooter>
    </Card>
  )
}