'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
    SectionContent,
    SectionDescription,
    SectionHeader,
    SectionHeading,
} from '@/app/(app)/_components/section-header'

const screenshots = [
    '/starterkits/saas-v1/landing.png',
    '/starterkits/saas-v1/auth.png',
    '/starterkits/saas-v1/blog.png',
    '/starterkits/saas-v1/dashboard.png',
    '/starterkits/saas-v1/admin-dashboard.png',
    '/starterkits/saas-v1/changelog.png',
    '/starterkits/saas-v1/billing.png',
    '/starterkits/saas-v1/users.png',
    '/starterkits/saas-v1/org-settings.png',
    '/starterkits/saas-v1/org-members.png',
    '/starterkits/saas-v1/org-invite.png',
    '/starterkits/saas-v1/waitlist.png',
    '/starterkits/saas-v1/organizations.png',
    '/starterkits/saas-v1/feedback-list.png',
    '/starterkits/saas-v1/docs.png',
]

export function SaasStarterkitScreenShots() {
    const [showAll, setShowAll] = useState(false)
    const displayedScreenshots = showAll ? screenshots : screenshots.slice(0, 6)

    return (
        <SectionHeader>
            <SectionHeading>
                Screenshots:{' '}
                <span className="hidden sm:block">See It In Action</span>
            </SectionHeading>
            <SectionDescription>
                This Next.js SaaS starter kit is packed with features designed
                to accelerate your development workflow
            </SectionDescription>

            <SectionContent className="w-full">
                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                    {displayedScreenshots.map((screenshot, index) => {
                        return (
                            <div
                                key={index}
                                className="border-border relative aspect-video w-full overflow-hidden rounded-lg border"
                            >
                                <Image
                                    src={screenshot || '/placeholder.svg'}
                                    fill
                                    alt="saas-starterkit-demo"
                                    quality={100}
                                    placeholder="blur"
                                    blurDataURL="/starterkits/saas-v1/landing.png"
                                    className="object-cover"
                                />
                            </div>
                        )
                    })}
                </div>

                <div className="border-grid flex justify-center py-6">
                    <Button
                        variant="outline"
                        onClick={() => setShowAll(!showAll)}
                        className="gap-2"
                    >
                        {showAll ? (
                            <>
                                Show Less <ChevronUp className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Show More <ChevronDown className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </SectionContent>
        </SectionHeader>
    )
}
