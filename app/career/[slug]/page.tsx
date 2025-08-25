'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Clock, 
  Star,
  Users,
  Building,
  Send,
  Share2,
  Bookmark,
  Eye,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CareerService, CareerPosition, CareerApplication } from "@/lib/services/career"
import { cn } from "@/lib/utils"
import BackButton from "@/components/ui/back-button"

interface CareerPositionPageProps {
  params: {
    slug: string
  }
}

export default function CareerPositionPage({ params }: CareerPositionPageProps) {
  const [position, setPosition] = useState<CareerPosition | null>(null)
  const [relatedPositions, setRelatedPositions] = useState<CareerPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationData, setApplicationData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume_url: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    source: 'website'
  })

  const careerService = useMemo(() => new CareerService(), [])

  const loadPosition = useCallback(async () => {
    setLoading(true)
    try {
      const positionData = await careerService.getPublicPositionBySlug(params.slug)
      if (!positionData) {
        notFound()
      }
      setPosition(positionData)
      
      // Load related positions
      if (positionData.category) {
        const related = await careerService.getRelatedPositions(positionData.id, positionData.category.id, 3)
        setRelatedPositions(related)
      }
    } catch (error) {
      console.error('Error loading position:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }, [careerService, params.slug])

  useEffect(() => {
    loadPosition()
  }, [loadPosition])

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!position) return

    setApplying(true)
    try {
      const application: Partial<CareerApplication> = {
        position_id: position.id,
        ...applicationData,
        status: 'submitted',
        applied_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString()
      }

      await careerService.submitApplication(application as CareerApplication)
      setShowApplicationForm(false)
      setApplicationData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        cover_letter: '',
        resume_url: '',
        portfolio_url: '',
        linkedin_url: '',
        github_url: '',
        source: 'website'
      })
      // Show success message or redirect
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setApplying(false)
    }
  }

  const formatSalary = (min?: number, max?: number, currency = 'IDR') => {
    if (!min && !max) return 'Salary not disclosed'
    
    const format = (amount: number) => {
      if (currency === 'IDR') {
        return `Rp ${(amount / 1000000).toFixed(0)}M`
      }
      return `$${(amount / 1000).toFixed(0)}K`
    }
    
    if (min && max) {
      return `${format(min)} - ${format(max)}`
    }
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!position) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <BackButton href="/career" label="Back to Jobs" />
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Position Header */}
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {position.featured && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1">
                          <Star className="h-3 w-3" />
                          <span>Featured</span>
                        </Badge>
                      )}
                      {position.urgent && (
                        <Badge variant="destructive" className="gap-1">
                          <span>Urgent Hiring</span>
                        </Badge>
                      )}
                                              <Badge variant="outline" className="capitalize">{position.status}</Badge>
                    </div>
                    
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{position.title}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Company Name
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {position.level?.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {formatSalary(position.salary_min, position.salary_max, position.salary_currency)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per {position.salary_type}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {position.views_count} views
                        </div>
                        <div className="flex items-center gap-1">
                          <UserPlus className="h-3 w-3" />
                          {position.applications_count} applications
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <p className="text-muted-foreground">{position.summary}</p>
                  </div>
                  
                  {position.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Full Description</h4>
                      <div 
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: position.description }}
                      />
                    </div>
                  )}

                  {position.requirements && (
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <div 
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: position.requirements }}
                      />
                    </div>
                  )}

                  {position.benefits && (
                    <div>
                      <h4 className="font-semibold mb-2">Benefits</h4>
                      <div 
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: position.benefits }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Required */}
            {position.skills && position.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {position.skills.map((skillItem) => (
                      <Badge 
                        key={skillItem.id} 
                        variant={skillItem.level === 'required' ? "default" : "secondary"}
                        className={cn(
                          skillItem.level === 'required' && "bg-primary hover:bg-primary/90"
                        )}
                      >
                        {skillItem.skill?.name}
                        {skillItem.level === 'required' && " *"}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Required skills
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Application Form */}
            {showApplicationForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleApplication} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name *</label>
                        <Input
                          required
                          value={applicationData.first_name}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, first_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name *</label>
                        <Input
                          required
                          value={applicationData.last_name}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, last_name: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          type="email"
                          required
                          value={applicationData.email}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          value={applicationData.phone}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Resume URL *</label>
                        <Input
                          type="url"
                          required
                          placeholder="https://..."
                          value={applicationData.resume_url}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, resume_url: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Portfolio URL</label>
                        <Input
                          type="url"
                          placeholder="https://..."
                          value={applicationData.portfolio_url}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">LinkedIn URL</label>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={applicationData.linkedin_url}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">GitHub URL</label>
                        <Input
                          type="url"
                          placeholder="https://github.com/..."
                          value={applicationData.github_url}
                          onChange={(e) => setApplicationData(prev => ({ ...prev, github_url: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Cover Letter *</label>
                      <Textarea
                        required
                        rows={4}
                        placeholder="Tell us why you're interested in this position..."
                        value={applicationData.cover_letter}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, cover_letter: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={applying}>
                        {applying ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Application
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowApplicationForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  className="w-full mb-4"
                  size="lg"
                  onClick={() => setShowApplicationForm(true)}
                  disabled={showApplicationForm}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application Deadline</span>
                    <span className="font-medium">
                      {position.application_deadline 
                        ? formatDate(position.application_deadline)
                        : 'Not specified'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">
                      {position.start_date 
                        ? formatDate(position.start_date)
                        : 'Immediate'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-medium">
                      {formatDate(position.created_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Department</div>
                  <Badge 
                    variant="secondary" 
                    className="text-primary-foreground border-0"
                    style={{ backgroundColor: position.category?.color || 'hsl(var(--primary))' }}
                  >
                    {position.category?.name}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Employment Type</div>
                  <Badge variant="outline">{position.type?.name}</Badge>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Experience Level</div>
                  <Badge variant="outline">{position.level?.name}</Badge>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Location</div>
                  <div className="font-medium">{position.location?.name}</div>
                  {position.remote_allowed && (
                    <div className="text-xs text-primary mt-1">Remote work allowed</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Related Positions */}
            {relatedPositions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedPositions.map((relatedPosition) => (
                      <div key={relatedPosition.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <Link href={`/career/${relatedPosition.slug}`}>
                          <h4 className="font-medium hover:text-primary transition-colors">
                            {relatedPosition.title}
                          </h4>
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1">
                          {relatedPosition.location?.name} • {relatedPosition.type?.name}
                        </div>
                        <div className="text-sm font-medium text-primary mt-1">
                          {formatSalary(relatedPosition.salary_min, relatedPosition.salary_max, relatedPosition.salary_currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
